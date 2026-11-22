package com.spartanlaboratories.testing.integration.workflows

import com.spartanlaboratories.testing.support.workflows.Bash
import com.spartanlaboratories.testing.support.workflows.DeployWorkflow
import java.io.File
import java.util.concurrent.TimeUnit
import kotlin.io.path.createTempDirectory
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue
import org.junit.Assume.assumeTrue

/**
 * Runs the `Check staging target` step of the deploy workflow, as committed, over pairs of folders.
 * The manual clean option deletes everything in the staging folder, and this step is the one check that
 * stands between it and the production site. Production is configured as `/../../spartanlaboratories.org/`,
 * so a staging folder that names the same folder another way must be refused, however it is written.
 */
class StagingTargetCheckTest {
    private val root: File = createTempDirectory("staging-target").toFile()

    /** The production folder as the repository variable `SPACESHIP_REMOTE_DIR` holds it. */
    private val production = "/../../spartanlaboratories.org/"

    /** What one run of the step left behind: its exit code, its output, and what it handed to the deploy step. */
    private data class StepResult(val exitCode: Int, val output: String, val handedOver: String)

    /** [text] as one single-quoted bash word, whatever characters it holds. */
    private fun quoted(text: String) = "'" + text.replace("'", "'\\''") + "'"

    /**
     * Runs the step body in bash with the three variables it reads, assigned at the top of the script. On a
     * runner the build job's own environment already holds the workflow's real folders and a real
     * `GITHUB_OUTPUT` file, and a test must neither read the one nor write the other; assigning them in the
     * script also keeps them from depending on how a particular bash passes its environment on.
     */
    private fun runStep(production: String, staging: String): StepResult {
        val handedOver = root.resolve("github-output.txt").apply { writeText("") }
        val assignments = listOf(
            "PRODUCTION_REMOTE_DIR" to production,
            "STAGING_REMOTE_DIR" to staging,
            "GITHUB_OUTPUT" to handedOver.name,
        ).joinToString("\n") { (name, value) -> "$name=${quoted(value)}" }
        val script = root.resolve("check-staging-target.sh")
        script.writeText(assignments + "\n" + DeployWorkflow.runBlockOf("Check staging target"))
        val output = root.resolve("check-staging-target.log")
        // The output goes to a file so that nothing blocks on reading it before the timeout below.
        val process = ProcessBuilder(Bash.executable, script.name)
            .directory(root)
            .redirectErrorStream(true)
            .redirectOutput(output)
            .start()
        val finished = process.waitFor(60, TimeUnit.SECONDS)
        if (!finished) process.destroyForcibly()
        check(finished) { "The staging target check did not finish." }
        return StepResult(process.exitValue(), output.readText(), handedOver.readText())
    }

    private fun assertRefused(staging: String, production: String = this.production) {
        val result = runStep(production, staging)
        assertNotEquals(0, result.exitCode, "the step should have refused '$staging' next to '$production': ${result.output}")
        assertTrue(
            "::error::" in result.output && "SPACESHIP_STAGING_REMOTE_DIR" in result.output,
            "expected an annotation naming SPACESHIP_STAGING_REMOTE_DIR for '$staging': ${result.output}",
        )
        assertEquals("", result.handedOver, "a refused folder must not reach the deploy step: '$staging'")
    }

    private fun assertDeploysTo(staging: String, folder: String, production: String = this.production) {
        val result = runStep(production, staging)
        assertEquals(0, result.exitCode, "the step should have accepted '$staging' next to '$production': ${result.output}")
        assertEquals("remote_dir=$folder\n", result.handedOver, "the folder handed to the deploy step for '$staging'")
    }

    @BeforeTest
    fun requireBash() {
        assumeTrue("Running the step body needs bash.", Bash.executable != null)
    }

    @AfterTest
    fun deleteFixture() {
        root.deleteRecursively()
    }

    @Test
    fun failsWhenTheStagingFolderResolvesToProduction() {
        assertRefused("/spartanlaboratories.org/")
    }

    @Test
    fun failsForEveryWayOfWritingTheProductionFolder() {
        listOf(
            "/spartanlaboratories.org",
            "spartanlaboratories.org/",
            "//spartanlaboratories.org//",
            "/spartanlaboratories.org/.",
            "/spartanlaboratories.org/staging/..",
            "/elsewhere/../spartanlaboratories.org/",
            "/../../spartanlaboratories.org/",
        ).forEach { assertRefused(it) }
    }

    @Test
    fun failsWhenOnlyTheStagingFolderIsWrittenWithDots() {
        assertRefused("/../../spartanlaboratories.org/", production = "/spartanlaboratories.org")
    }

    @Test
    fun failsWhenTheStagingFolderResolvesToTheFtpRoot() {
        listOf("/", "//", "/./", "/..", "/../", "/../..", "/spartanlaboratories.org/..").forEach { assertRefused(it) }
    }

    @Test
    fun acceptsTheLiveConfiguration() {
        assertDeploysTo("/spartanlaboratories.org/staging", "/spartanlaboratories.org/staging/")
        assertDeploysTo("/spartanlaboratories.org/staging/", "/spartanlaboratories.org/staging/")
    }

    @Test
    fun acceptsAFolderThatSitsBesideProduction() {
        assertDeploysTo("/other/staging", "/other/staging/")
    }

    @Test
    fun deploysToTheResolvedStagingFolder() {
        assertDeploysTo("/spartanlaboratories.org/./staging/../staging", "/spartanlaboratories.org/staging/")
        assertDeploysTo("/../../spartanlaboratories.org//staging", "/spartanlaboratories.org/staging/")
    }

    @Test
    fun readsFolderNamesLiterally() {
        assertDeploysTo("/my site/stage*", "/my site/stage*/")
        assertDeploysTo("/it's/staging", "/it's/staging/")
    }
}
