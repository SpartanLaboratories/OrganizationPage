package com.spartanlaboratories.testing.integration.workflows

import com.spartanlaboratories.testing.support.workflows.Bash
import com.spartanlaboratories.testing.support.workflows.DeployWorkflow
import java.io.File
import java.util.concurrent.TimeUnit
import kotlin.io.path.createTempDirectory
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertContentEquals
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue
import org.junit.Assume.assumeTrue

/**
 * Runs the `Mark as staging` step of the deploy workflow, as committed, over a small fixture of the
 * packaged site. The step keeps staging out of search results and marks it visibly, so a change that
 * stops marking pages would otherwise show only as staged pages indexed by accident.
 */
class StagingMarkingTest {
    private val root: File = createTempDirectory("staging-marking").toFile()
    private val deploy = root.resolve(".deploy")

    private val pages = listOf(
        "index.html",
        "docs/api/index.html",
        "docs/api/shared/index.html",
        "docs/api/shared/com.example/-organization/index.html",
    )
    private val leftAlone = listOf("docs/api/navigation.html", "docs/api/shared/navigation.html", "web.js")

    private fun page(title: String) =
        "<!DOCTYPE html>\n<html>\n<head>\n    <title>$title</title>\n</head>\n<body></body>\n</html>\n"

    private fun fixture(path: String) = deploy.resolve(path)

    private fun write(path: String, text: String) = fixture(path).apply {
        parentFile.mkdirs()
        writeText(text)
    }

    private fun snapshot(): Map<String, ByteArray> = deploy.walkTopDown().filter { it.isFile }
        .associate { it.relativeTo(deploy).invariantSeparatorsPath to it.readBytes() }

    private data class StepResult(val exitCode: Int, val output: String)

    private fun runStep(): StepResult {
        val script = root.resolve("mark-as-staging.sh")
        script.writeText(DeployWorkflow.runBlockOf("Mark as staging"))
        val output = root.resolve("mark-as-staging.log")
        // The output goes to a file so that nothing blocks on reading it before the timeout below.
        val process = ProcessBuilder(Bash.executable, script.name)
            .directory(root)
            .redirectErrorStream(true)
            .redirectOutput(output)
            .start()
        val finished = process.waitFor(60, TimeUnit.SECONDS)
        if (!finished) process.destroyForcibly()
        check(finished) { "The marking step did not finish." }
        return StepResult(process.exitValue(), output.readText())
    }

    private fun assertRefused(result: StepResult, before: Map<String, ByteArray>, annotationNames: String? = null) {
        assertNotEquals(0, result.exitCode, "the step should have failed: ${result.output}")
        annotationNames?.let {
            assertTrue("::error::" in result.output && it in result.output, "expected an annotation naming $it: ${result.output}")
        }
        val after = snapshot()
        assertEquals(before.keys, after.keys)
        before.forEach { (path, bytes) -> assertContentEquals(bytes, after[path], "$path changed") }
    }

    @BeforeTest
    fun writeFixture() {
        assumeTrue("Running the step body needs bash.", Bash.executable != null)
        pages.forEach { write(it, page(it)) }
        write("docs/api/navigation.html", "<div class=\"sideMenu\"></div>\n")
        write("docs/api/shared/navigation.html", "<div class=\"sideMenu\"></div>\n")
        write("web.js", "console.log('<head><title>');\n")
    }

    @AfterTest
    fun deleteFixture() {
        root.deleteRecursively()
    }

    @Test
    fun marksEveryPageOfTheSite() {
        assertEquals(0, runStep().exitCode)
        pages.forEach { path ->
            val text = fixture(path).readText()
            assertEquals(1, Regex("""<meta name="robots" content="noindex, nofollow" />""").findAll(text).count(), path)
            assertEquals(1, Regex("""<title>\[Staging] """).findAll(text).count(), path)
            assertEquals(1, Regex("<head>").findAll(text).count(), path)
        }
    }

    @Test
    fun leavesNavigationFragmentsAndOtherFilesAsBuilt() {
        val before = snapshot()
        assertEquals(0, runStep().exitCode)
        leftAlone.forEach { assertContentEquals(before.getValue(it), fixture(it).readBytes(), "$it changed") }
    }

    @Test
    fun failsWhenTheArtifactHasNoReference() {
        fixture("docs/api/index.html").delete()
        val before = snapshot()
        assertRefused(runStep(), before, annotationNames = ".deploy/docs/api/index.html")
    }

    @Test
    fun failsWhenTheReferenceIndexHasNoHead() {
        write("docs/api/index.html", "<html><title>x</title></html>\n")
        val before = snapshot()
        assertRefused(runStep(), before, annotationNames = "docs/api/index.html")
    }

    @Test
    fun failsWhenTheReferenceIndexHasNoTitle() {
        write("docs/api/index.html", "<html>\n<head></head>\n</html>\n")
        val before = snapshot()
        assertRefused(runStep(), before, annotationNames = "docs/api/index.html")
    }

    @Test
    fun failsWhenTheHomePageHasNoHead() {
        write("index.html", "<html><title>x</title></html>\n")
        val before = snapshot()
        assertRefused(runStep(), before)
    }

    @Test
    fun failsWhenTheHomePageHasNoTitle() {
        write("index.html", "<html>\n<head></head>\n</html>\n")
        val before = snapshot()
        assertRefused(runStep(), before)
    }
}
