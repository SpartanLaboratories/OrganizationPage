package com.spartanlaboratories.testing.support.workflows

import java.io.File

/**
 * `.github/workflows/deploy-spaceship.yml` read as text, with LF line endings. Gradle runs a test from
 * its module folder, so the repository root is one level up. No YAML parser is on the test classpath;
 * the two checks that use this rely on the file's own layout.
 */
object DeployWorkflow {
    val lines: List<String> = File("../.github/workflows/deploy-spaceship.yml")
        .readText()
        .replace("\r\n", "\n")
        .lines()

    /**
     * The body of the named step's `run: |` block, without its indentation.
     *
     * @throws IllegalStateException when the step or its `run: |` block is not in the file.
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
