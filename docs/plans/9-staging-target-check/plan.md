# Plan: the staging target check compares resolved folder paths

**Covers:** SpartanLaboratories/OrganizationPage#9, "Staging target check compares folder strings, not resolved paths".
**Architecture:** none. This is a fix inside one step of one workflow, plus the test that runs that step.
**Branch:** `fix/issue-9-staging-target-check` (it exists). This plan document is committed in the same commit as the implementation it describes (see [Version control](#6-version-control)).
**Plans:** a resolved-path comparison in the staging job's `Check staging target` step, and a regression test in `workflow-checks` that runs the step as committed.
**Status:** planning only. **Target version:** none; no published artifact changes.

---

## 1. Requirements

The `Check staging target` step of the staging job in `.github/workflows/deploy-spaceship.yml` must:

1. **Resolve both folders before comparing them.** Apply their `.` and `..` segments (a `..` with nothing above it stays at the root), collapse repeated slashes, and read a folder written without its leading slash from the root, as today.
2. **Refuse, and write no `remote_dir`,** when the resolved staging folder is the resolved production folder, or is the FTP root, however each is written. The refusal is an `::error::` annotation that names `SPACESHIP_STAGING_REMOTE_DIR`, so the variable to change is plain.
3. **Hand the resolved staging folder to `Deploy to staging`,** with a trailing slash, as `remote_dir`. A folder already written plainly, the default `/spartanlaboratories.org/staging` among them, is handed on exactly as it is today.
4. **Keep accepting what is live:** production `/../../spartanlaboratories.org/` with staging at its default, and any staging folder that sits inside the production folder or beside it.
5. **Be covered by a regression test** that runs the step as committed over pairs of folders, fails today for the issue's case (production `/../../spartanlaboratories.org/`, staging `/spartanlaboratories.org/`), and passes once the step is fixed.

Acceptance: the new test class fails on the unchanged step in exactly the five tests marked in [section 4](#4-regression-test), and every test of the `workflow-checks` module passes after the fix.

**Out of scope.** The production job's own target check, `.github/workflows/publish-docs.yml`, `.github/actions/spaceship-deploy`, and a refusal of a staging folder that contains the production folder (other than the FTP root, which this fix refuses) or the documents folder. They are listed in [`consequences.md`](consequences.md).

## 2. Root cause

The step compares the two folders as text, and the text still carries the `.` and `..` segments of its spelling.

- `.github/workflows/deploy-spaceship.yml:112-116`: `normalize` puts a `/` in front and a `/` behind. It applies no `.` or `..` segment and collapses no repeated slash.
- `:118-119`: both folders go through it, so production stays `/../../spartanlaboratories.org/`.
- `:121`: the guard is `[[ "$staging" == "/" || "$staging" == "$production" ]]`, two string comparisons. `/spartanlaboratories.org/` is not `/../../spartanlaboratories.org/`, and `/..` or `/a/..` is not `/`, so none of them is refused.
- `:126`: the unresolved staging string is what `Deploy to staging` receives as `remote-dir` (`:174`).
- Why it matters: `:181` passes the manual run's `clean_staging` option on as `clean-remote`, which `.github/actions/spaceship-deploy/action.yml:139` hands to the upload as `dangerous-clean-slate`: everything in the remote folder is deleted before the upload. For a staging folder that resolves to production, that folder is the production site.

Confirmed at the baseline (`main` at `a4a7b9e`):

- Run as committed with production `/../../spartanlaboratories.org/` and staging `/spartanlaboratories.org/`, the step exits 0 and writes `remote_dir=/spartanlaboratories.org/`. Staging `/..` and `//` pass too, writing `remote_dir=/../` and `remote_dir=//`.
- The repository variable `SPACESHIP_REMOTE_DIR` is `/../../spartanlaboratories.org/`. No `SPACESHIP_STAGING_REMOTE_DIR` variable exists on the repository or on the `staging` environment, so staging uses its default, `/spartanlaboratories.org/staging`.
- The documents publish already compares resolved paths (`.github/workflows/publish-docs.yml:51-53`), with `realpath -m`.
- The step dates from `1553407` and was adjusted by `fd486bb`, both of 2026-09-26, before any plan folder existed.

## 3. Fix

### 3.1 The workflow step

`.github/workflows/deploy-spaceship.yml`, step `Check staging target` (lines 106-126). The step keeps its name, id, shell and its one output, `remote_dir`. Its `run` block becomes the text below; nothing else in the file changes.

```yaml
      - name: Check staging target
        id: target
        shell: bash
        run: |
          set -euo pipefail

          # Folders are compared as resolved paths: the production folder is configured as
          # /../../spartanlaboratories.org/, which is the same folder as /spartanlaboratories.org/.
          # The text is resolved here and nothing on this runner is consulted: "." and ".."
          # segments are applied, a ".." at the root stays at the root, and repeated slashes
          # collapse. The result starts and ends with a slash.
          resolve() {
            local rest="$1/" segment resolved=""
            while [[ -n "$rest" ]]; do
              segment="${rest%%/*}"
              rest="${rest#*/}"
              case "$segment" in
                '' | .) ;;
                ..) resolved="${resolved%/*}" ;;
                *) resolved="$resolved/$segment" ;;
              esac
            done
            printf '%s/' "$resolved"
          }

          staging="$(resolve "$STAGING_REMOTE_DIR")"
          production="$(resolve "$PRODUCTION_REMOTE_DIR")"

          # The manual clean option deletes everything in the staging folder, so the staging folder
          # must be neither the production folder nor the FTP root, however either is written.
          if [[ "$staging" == "/" ]]; then
            echo "::error::SPACESHIP_STAGING_REMOTE_DIR ($STAGING_REMOTE_DIR) resolves to the FTP root; set it to a folder of its own." >&2
            exit 1
          fi
          if [[ "$staging" == "$production" ]]; then
            echo "::error::SPACESHIP_STAGING_REMOTE_DIR ($STAGING_REMOTE_DIR) resolves to the production folder ($production); it must be a separate folder." >&2
            exit 1
          fi

          echo "remote_dir=$staging" >> "$GITHUB_OUTPUT"
```

- `resolve` returns a folder that starts and ends with a slash, so the FTP root is `/`. It reads its argument as text: nothing is expanded, globbed or looked up, so a name holding a space or a `*` stays as written.
- The two refusals have their own messages. Each names `SPACESHIP_STAGING_REMOTE_DIR` and the value as set; the second also gives the resolved production folder. Both fail the step before it writes `remote_dir`, so `Deploy to staging` never starts. Under `set -e` a failure inside `resolve` fails the step too: the check fails closed.
- `remote_dir` is the resolved staging folder.

**Why the folders are resolved in bash and not with `realpath`.** The documents publish matches its folders with `realpath -m`. This step matches its meaning, not its mechanism. `realpath -m` resolves symbolic links on the runner's own file system, which means nothing for a folder on an FTP server, and some builds keep a leading `//` as a root of its own (Git for Windows' build does: `realpath -m -- //spartanlaboratories.org//` prints `//spartanlaboratories.org`), so the same two folders would compare differently in the bash that runs the test than on the runner. Resolving the text directly has neither dependency, and the test exercises exactly the code the runner runs. `realpath -ms`, with the leading slashes stripped first, gives the same answers on every folder in [section 4](#4-regression-test) (tried with Git for Windows' coreutils); it is not used because it adds a tool and a flag to a guard that needs neither.

**Why the resolved folder is what gets uploaded.** What was checked must be what is uploaded to. Handing on the folder as written would leave the host to read a spelling the check had already read differently. For every folder written plainly, which includes the live default, the two are byte for byte the same.

### 3.2 The regression test class

New file `workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/integration/workflows/StagingTargetCheckTest.kt`, in the module's integration tests beside `StagingMarkingTest`, which it follows: it runs the step body as committed through `DeployWorkflow.runBlockOf` and `Bash.executable`. The three variables the step reads are assigned at the top of the script it writes, so neither a runner's real `GITHUB_OUTPUT` and folders (a Gradle run on a runner inherits them) nor a particular bash's handling of its environment can reach the test. Every failure is a thrown `AssertionError` or, for a step that does not finish, an `IllegalStateException`; nothing is returned as a `Result`.

```kotlin
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
```

### 3.3 A comment in the support object

`workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/support/workflows/DeployWorkflow.kt`, the class comment on lines 5-9: "the two checks that use this rely on the file's own layout" becomes "the checks that use this rely on the file's own layout", because a third check now reads the workflow through it. Nothing else in the file changes.

### 3.4 Documentation

Documentation levels touched: level 1 (the step's comments, the test class comment, the support-object comment) and level 3 (`docs/DEPLOYMENT.md`, `README.md`, `CHANGELOG.md`, and this plan with its `consequences.md`). Level 2 is untouched: `workflow-checks` is test-only and is not part of the API reference.

- **`docs/DEPLOYMENT.md` changes, two edits.**
  - Lines 154-155, the Hosting bullet "the staging folder must differ from the production folder, and neither can be the FTP root;" becomes:

    ```
    - the staging folder must differ from the production folder, and neither can be the
      FTP root. The staging job compares resolved paths: it applies the `.` and `..`
      segments of both folders (a `..` at the root stays at the root) and collapses repeated
      slashes, so a staging folder that resolves to the production folder is refused however
      it is written (`/../../spartanlaboratories.org/` and `/spartanlaboratories.org/` are the
      same folder), and so is one that resolves to the FTP root. It uploads to the resolved
      staging folder;
    ```

  - Lines 179-182, the paragraph that lists what `workflow-checks` runs, becomes:

    ```
    The `workflow-checks` module runs this step, as committed, over a fixture of the packaged
    site (`StagingMarkingTest`), runs the staging target check, as committed, over pairs of
    folders (`StagingTargetCheckTest`), and asserts the push filter's patterns and their order
    (`DeployPushFilterTest`). `./gradlew build` and `check` run them, so the deploy build
    stops on any of them.
    ```

- **`README.md` changes, one edit.** The `workflow-checks` row of the module table (line 15) becomes "Regression tests of the deployment workflows: the staging marking step, the staging target check and the push filter. Holds no site code." The module's table row lists what it tests, and it would otherwise leave out the new class. The variable table's statement that `SPACESHIP_STAGING_REMOTE_DIR` "must differ from the production folder" stays accurate and is left alone.
- **`CHANGELOG.md` changes.** Under `## [Unreleased]`, after the `### Changed` list, a new section:

  ```
  ### Fixed

  - The staging target check compares resolved folder paths, not strings. A staging folder that names the production folder another way, such as `/spartanlaboratories.org/` while production is `/../../spartanlaboratories.org/`, or that resolves to the FTP root, used to pass and let a manual `clean_staging` run delete the production site; it is now refused. The staging deploy uploads to the resolved folder. `workflow-checks` gains a regression test for the step.
  ```

### 3.5 Files not changed

`.github/workflows/publish-docs.yml` (its own resolver stays), `.github/workflows/ci.yml`, `.github/actions/spaceship-deploy/action.yml`, the production job (including `Check production target` and the approval check), `workflow-checks/build.gradle.kts` (the new class is picked up by its package, and the workflows are already inputs of the module's tests), `CLAUDE.md`, and the variable table in `README.md`. The deployment rules in `CLAUDE.md` and `docs/DEPLOYMENT.md` all hold: no production path, approval check or staging marking changes.

## 4. Regression test

**Set and place.** Integration tests: `com.spartanlaboratories.testing.integration.workflows.StagingTargetCheckTest`, at `workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/integration/workflows/StagingTargetCheckTest.kt`. It runs a real bash over the step body, as `StagingMarkingTest` does, and uses `kotlin.test` on the JUnit 4 that `kotlin("test")` resolves in this module, as the module's other classes do. The module's `integrationTest` task picks it up by its package, and `test` runs it with the module's gating tests. A machine with no bash skips the class, through JUnit 4's `Assume`, as it skips `StagingMarkingTest`; the runner has bash.

**The assertion that fails today and passes after the fix.** `failsWhenTheStagingFolderResolvesToProduction` calls `assertRefused("/spartanlaboratories.org/")` with production `/../../spartanlaboratories.org/`, and its first assertion is

```kotlin
assertNotEquals(0, result.exitCode, "the step should have refused '$staging' next to '$production': ${result.output}")
```

Today the step exits 0 and writes `remote_dir=/spartanlaboratories.org/`, so the assertion fails with `the step should have refused '/spartanlaboratories.org/' next to '/../../spartanlaboratories.org/': . Actual: 0`. After the fix the step exits 1, prints an `::error::` annotation that names `SPACESHIP_STAGING_REMOTE_DIR`, and writes nothing, so all three assertions of `assertRefused` hold.

| Test | It locks down | On the step as committed |
|------|---------------|--------------------------|
| `failsWhenTheStagingFolderResolvesToProduction` | the issue's case | **fails** |
| `failsForEveryWayOfWritingTheProductionFolder` | seven spellings of production: no trailing slash, no leading slash, repeated slashes, a `.` segment, a `..` back to production, a detour, and production's own spelling | **fails** (at the first) |
| `failsWhenOnlyTheStagingFolderIsWrittenWithDots` | production written plainly, staging written with the `..` segments | **fails** |
| `failsWhenTheStagingFolderResolvesToTheFtpRoot` | `/`, `//`, `/./`, `/..`, `/../`, `/../..`, `/spartanlaboratories.org/..` | **fails** (at `//`) |
| `deploysToTheResolvedStagingFolder` | dot segments and repeated slashes are gone from `remote_dir` | **fails** |
| `acceptsTheLiveConfiguration` | production as set, staging at its default with and without a trailing slash; `remote_dir` is exactly `/spartanlaboratories.org/staging/` | passes |
| `acceptsAFolderThatSitsBesideProduction` | a folder unrelated to production is accepted | passes |
| `readsFolderNamesLiterally` | a space, a `*` and an apostrophe in a folder name | passes |

**Order of work (test first).**

1. Add the test class. Run `./gradlew :workflow-checks:integrationTest --tests "com.spartanlaboratories.testing.integration.workflows.StagingTargetCheckTest"` on the unchanged workflow. Expected: 8 tests, the 5 marked above fail, 3 pass.
2. Change the step as in [3.1](#31-the-workflow-step) and run the same command. Expected: 8 pass.
3. Run `./gradlew :workflow-checks:test`. Expected: 18 tests (3 push filter, 7 staging marking, 8 staging target check), all passing. The module declares `.github/workflows` as an input of its tests, so the edited workflow runs all three classes again.
4. Make the documentation edits of [3.4](#34-documentation).

**Runs not made.** Only the `workflow-checks` module's tests exercise this change. `shared`, `server` and `web` are untouched, so no test of theirs is run here (the repository's CI build runs every module on the pull request, as it always does).

**Not automated.** How the FTP host reads `..` (see the first assumption in [5.2](#52-assumptions)), and the step's first run on the live variables ([5.1](#51-edge-cases-and-callers)).

## 5. Risks

### 5.1 Edge cases and callers

- **The step is the only guard in front of the manual clean option.** A mistake in `resolve` could refuse the live configuration, which fails the first step of the staging job before anything is uploaded, and production is untouched. Or it could accept a folder it should refuse. The tests above cover the issue's case, its spelled variants, the root, and the live configuration.
- **First run on the live variables.** The step first runs on the live variables in the staging job of a manual run on the topic branch (Actions, OrganizationPage Deploy, Run workflow; it stages only) and again in the staging job of the run the merge to `main` starts. A manual run deploys to the live host, so it needs the owner's go-ahead first (deployment rule 9), and the owner views the staged site as for any change outside `docs/` (rule 1). With production `/../../spartanlaboratories.org/` and staging at its default, the step must pass and write `remote_dir=/spartanlaboratories.org/staging/`, exactly the value it writes today.
- **Behaviour that changes.** A staging folder written with `.`, `..`, repeated slashes or no leading slash now uploads to the resolved folder instead of the text as written. With no `SPACESHIP_STAGING_REMOTE_DIR` variable set, the default is already plain, so the live upload folder does not change.
- **Callers.** `Deploy to staging` (`deploy-spaceship.yml:174`) is the only reader of this step's `remote_dir`. The production job has its own `target` step and reads its own output (`:261`); it is untouched.
- **An empty value cannot reach the step.** The workflow-level `||` default replaces an unset or empty variable (`:48`, `:53`). If one did arrive, it would resolve to the root and be refused.
- **Names are compared as written.** Case is significant, and a space, a `*` or a quote is an ordinary character. Nothing is trimmed, expanded or looked up.
- **A production folder that resolves to the root** makes every non-root staging folder a folder inside production; the staging check only compares and does not judge production. The production job's own check is a follow-up.

### 5.2 Assumptions

- **The FTP host reads a `..` at its root as the root,** so `/../../spartanlaboratories.org/` is the folder `/spartanlaboratories.org/`. `docs/DEPLOYMENT.md` records exactly this, and production deploys through that spelling today. If the host read it differently, the check would compare staging with a folder production does not use; the owner would then set `SPACESHIP_REMOTE_DIR` to the plain spelling, `/spartanlaboratories.org`, which the check reads as before.
- **The host's folder names are case-sensitive,** so two spellings that differ only in case are two folders. If the host ignored case, such a spelling of the production folder would pass as a separate folder.

## 6. Version control

- **Branch:** `fix/issue-9-staging-target-check`, cut from `main` at `a4a7b9e`.
- **One commit,** subject `fix: compare resolved paths in the staging target check`, holding the workflow step, `StagingTargetCheckTest.kt`, the comment in `DeployWorkflow.kt`, the `docs/DEPLOYMENT.md`, `README.md` and `CHANGELOG.md` edits, and this plan with `consequences.md`, so that `git log --follow` ties the plan to the change it describes. The issue board files in this folder (`plan.json`, `plan.js`, `dashboard.html`) are generated and are committed with the boards, not with this change.
- **No version moves.** The site artifact and the server jar are built from the same sources, so nothing a consumer of a published artifact sees changes; `version` stays `0.1.0`. The versioning rule therefore decides the commit's type for a change that moves no version, which the subject above proposes as `fix:`.
- The pull request that lands it closes SpartanLaboratories/OrganizationPage#9.
