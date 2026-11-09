package com.spartanlaboratories.testing.support.workflows

import java.io.File

/** Finds a bash to run workflow step bodies with: `bash` on the PATH, or the one Git for Windows ships. */
object Bash {
    /**
     * The command to start bash with, or null when none on this machine runs. Resolved once, on first
     * read, by starting each candidate as a child process.
     */
    val executable: String? by lazy {
        (listOf("bash") + gitForWindowsBash()).firstOrNull(::runs)
    }

    private fun gitForWindowsBash(): List<String> {
        if (!System.getProperty("os.name").startsWith("Windows")) return emptyList()
        return runCatching {
            val execPath = ProcessBuilder("git", "--exec-path").start().inputStream.bufferedReader().readText().trim()
            // `git --exec-path` is <install>/mingw64/libexec/git-core, so three levels up is the Git install folder.
            File(execPath).resolve("../../../bin/bash.exe").normalize().path
        }.fold(onSuccess = { listOf(it) }, onFailure = { emptyList() })
    }

    private fun runs(candidate: String): Boolean = runCatching {
        ProcessBuilder(candidate, "-c", "exit 0").start().waitFor() == 0
    }.getOrDefault(false)
}
