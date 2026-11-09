package com.spartanlaboratories.testing.support.workflows

import java.io.File

/**
 * `.github/workflows/deploy-spaceship.yml` read as text, with LF line endings. Gradle runs a test from
 * its module folder, so the repository root is one level up. No YAML parser is on the test classpath;
 * the two checks that use this rely on the file's own layout.
 */
object DeployWorkflow {
    /**
     * Every line of the workflow file, LF-normalised. Read once, on first use of this object, relative
     * to the working directory, so it needs a test running from a module folder directly under the
     * repository root. Fails with the file-read exception (wrapped in ExceptionInInitializerError) if
     * the file is absent.
     */
    val lines: List<String> = File("../.github/workflows/deploy-spaceship.yml")
        .readText()
        .replace("\r\n", "\n")
        .lines()

    /**
     * The body of the named step's `run: |` block, without its indentation.
     *
     * @param stepName the exact `name:` of the step in the workflow file.
     * @return the block's lines joined with LF, with the block's indentation removed. The search is not
     *   bounded by the step: for a step with no block of its own, this is the next step's block.
     * @throws IllegalStateException when no step has this name, or when no `run: |` line follows it
     *   anywhere in the file.
     */
    fun runBlockOf(stepName: String): String {
        val stepLine = lines.indexOfFirst { it.trim() == "- name: $stepName" }
        check(stepLine >= 0) { "The deploy workflow has no step named '$stepName'." }
        val offset = lines.drop(stepLine).indexOfFirst { it.trim() == "run: |" }
        check(offset >= 0) { "The step '$stepName' has no 'run: |' block." }
        val body = lines.drop(stepLine + offset + 1)
        val indent = body.first().length - body.first().trimStart().length
        return body
            .takeWhile { it.isBlank() || it.startsWith(" ".repeat(indent)) }
            .joinToString("\n") { it.drop(indent) }
    }
}
