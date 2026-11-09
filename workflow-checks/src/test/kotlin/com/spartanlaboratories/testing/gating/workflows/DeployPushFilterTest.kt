package com.spartanlaboratories.testing.gating.workflows

import com.spartanlaboratories.testing.support.workflows.DeployWorkflow
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

/**
 * The deploy workflow's push filter is ordered, and a mistake in it leaves no run and no error: GitHub
 * just starts nothing. The folders under docs/ that feed the site build must stay after the exclusion.
 */
class DeployPushFilterTest {
    private val lines = DeployWorkflow.lines
    private val pathsLine = lines.indexOfFirst { it.trim() == "paths:" }

    @Test
    fun patternsAreListedInOrder() {
        val patterns = lines.drop(pathsLine + 1).takeWhile { it.trimStart().startsWith("- ") }.map { it.trim() }
        assertEquals(listOf("- '**'", "- '!docs/**'", "- 'docs/brand/**'", "- 'docs/dokka/**'"), patterns)
    }

    @Test
    fun filterSitsUnderThePushEvent() {
        val push = lines.indexOf("  push:")
        val dispatch = lines.indexOf("  workflow_dispatch:")
        assertTrue(push in 0 until pathsLine && pathsLine < dispatch, "paths: must sit between push: and workflow_dispatch:")
    }

    @Test
    fun theOldIgnoreFilterIsGone() {
        assertTrue(lines.none { "paths-ignore" in it })
    }
}
