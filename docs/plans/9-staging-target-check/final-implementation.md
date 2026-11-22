# Final implementation: the staging target check compares resolved paths

**Covers:** [SpartanLaboratories/OrganizationPage#9](https://github.com/SpartanLaboratories/OrganizationPage/issues/9),
"Staging target check compares folder strings, not resolved paths".
**Plan:** [`plan.md`](plan.md). **What it leaves behind:** [`consequences.md`](consequences.md).
**Baseline:** `main` at `a4a7b9e`. **Version:** no bump; no published artifact changes, and `version` stays `0.1.0`.

## What was built

- **`.github/workflows/deploy-spaceship.yml`, step `Check staging target`.** As [planned](plan.md#31-the-workflow-step):
  `normalize` is replaced by `resolve`, a bash function that applies the `.` and `..` segments of a
  folder from its text alone (a `..` at the root stays at the root), collapses repeated slashes and
  returns a folder that starts and ends with a slash. Both folders are resolved before they are
  compared. The step refuses a staging folder that resolves to the FTP root and one that resolves to
  the production folder, each with its own `::error::` annotation that names
  `SPACESHIP_STAGING_REMOTE_DIR` and the value as set, and writes no `remote_dir`. Otherwise
  `remote_dir` is the resolved staging folder, so a folder written plainly, the live default among
  them, is handed on exactly as before. The step's comment and the comment above the `env:` folder
  defaults differ from the plan in the ways [deviations 2 and 3](#deviations-from-the-plan) give.
- **The `workflow-checks` tests.** Two classes named `StagingTargetCheckTest`. The integration one, 8
  tests, is the class [planned](plan.md#32-the-regression-test-class); its tests are the ones in the
  [plan's table](plan.md#4-regression-test). The gating one, 3 tests, was added ([deviation 1](#deviations-from-the-plan)).
  Each writes the step body to a script with `PRODUCTION_REMOTE_DIR`, `STAGING_REMOTE_DIR` and
  `GITHUB_OUTPUT` assigned at its top, runs it in bash with a 60-second limit, and reads the exit
  code, the output and the `remote_dir` handed on. Both skip themselves on a machine with no bash.
  `DeployWorkflow`'s class comment now says "the checks that use this", because three checks, in four
  classes, read the workflow through it. `workflow-checks/build.gradle.kts` is unchanged: the classes
  are picked up by their packages.
- **Documents.** As [planned](plan.md#34-documentation), with [deviation 5](#deviations-from-the-plan) for the one
  paragraph that differs. `docs/DEPLOYMENT.md`: the Hosting bullet states the resolved-path rule, the
  refusal of the root and the upload to the resolved folder, and the `workflow-checks` paragraph names
  both classes. `README.md`: the `workflow-checks` row lists the staging target check.
  `CHANGELOG.md`: a `### Fixed` entry under `[Unreleased]`.
- **Not changed.** `publish-docs.yml`, `ci.yml`, `.github/actions/spaceship-deploy/action.yml`, the
  production job (its `Check production target` and its approval check among them), `CLAUDE.md`, the
  variable table in `README.md`, and everything under `shared/`, `server/` and `web/`.

## Acceptance

The plan's [five requirements](plan.md#1-requirements) hold in the build, as far as the tests show.
Its acceptance criterion is met: the integration class fails on the unchanged step in exactly the five
tests the [plan marks](plan.md#4-regression-test), and every test of the `workflow-checks` module
passes with the fix.

| Criterion | State |
|---|---|
| The integration class fails on the unchanged step in the five marked tests | Met: 5 of 8 fail on `main`'s step, the marked five; see [Measurements](#measurements) |
| Every `workflow-checks` test passes with the fix | Met: 21 of 21 |
| Requirement 4: the live configuration still passes | Met by `acceptsTheLiveConfiguration` in both classes. The step has not yet run on the live variables ([known gap](consequences.md#known-gaps)) |

## Measurements

| Check | Result |
|---|---|
| `:workflow-checks:test` as built | 21 pass, none skipped. The gating tests run 6: `DeployPushFilterTest` 3, `StagingTargetCheckTest` 3. The integration tests run 15: `StagingMarkingTest` 7, `StagingTargetCheckTest` 8 |
| The new classes on `main`'s unchanged step | Gating: 3 tests, 2 fail (`failsWhenTheStagingFolderResolvesToProduction`, `failsWhenTheStagingFolderResolvesToTheFtpRoot`) and `acceptsTheLiveConfiguration` passes. Integration: 8 tests, 5 fail and 3 pass |
| The issue's case, on `main`'s step | `failsWhenTheStagingFolderResolvesToProduction` fails with "the step should have refused '/spartanlaboratories.org/' next to '/../../spartanlaboratories.org/': . Actual: 0", because the unchanged step exits 0 and writes `remote_dir=/spartanlaboratories.org/` |
| The same tests on Ubuntu | Pass at the commit that holds the step and both test classes, in the `build` job of `OrganizationPage CI` (Ubuntu 24.04). The edits made after it are comments, import grouping and one documentation paragraph |
| `dokkaGeneratePublicationHtml` | Passes in the `API docs (Dokka)` job of the same CI run; the build fails on any Dokka warning |
| Diff scope | `deploy-spaceship.yml` has two hunks, the step and the comment above `env:`; no other workflow, no action file, no build file and nothing under `shared/`, `server/` or `web/` changed |

The test rows were measured on Windows with Git for Windows' bash at the as-built state, except the
two CI rows. The step has not run on the live variables ([known gap](consequences.md#known-gaps)).

## Deviations from the plan

Deviation 1 adds a test class. Deviations 2 to 5 are comment and documentation wording only, and
deviation 6 is about commits. The step's logic and the integration class's tests are as planned.

1. **A gating class of the same name was added beside the integration class.**
   [Plan 3.2](plan.md#32-the-regression-test-class) and [plan 4](plan.md#4-regression-test) put the
   step's tests in the integration tests alone. The build adds
   `workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/gating/workflows/StagingTargetCheckTest.kt`,
   package `com.spartanlaboratories.testing.gating.workflows`, with three tests, each next to production
   `/../../spartanlaboratories.org/`: `failsWhenTheStagingFolderResolvesToProduction` (staging
   `/spartanlaboratories.org/`), `failsWhenTheStagingFolderResolvesToTheFtpRoot` (`/..`) and
   `acceptsTheLiveConfiguration` (staging `/spartanlaboratories.org/staging`, handed on as
   `/spartanlaboratories.org/staging/`). It runs the step the same way as the integration class and
   carries its own copies of that class's private helpers; no shared runner was extracted. The changed
   step is now covered in the gating tests, which run before a commit, as well as in the integration
   tests; the plan's placement left it with no gating test. Three classes each carry a step runner
   now (`StagingMarkingTest` and the two `StagingTargetCheckTest` classes), so the shared runner the
   plan left as a [follow-up](consequences.md#follow-ups) is due. *Based on:* [plan 4](plan.md#4-regression-test),
   which placed the tests, and the module's own split, the push filter's check in the gating tests and
   the marking step's in the integration tests; no research finding or architecture section bears on it.

2. **The step's comment names the repository variable.**
   [Plan 3.1](plan.md#31-the-workflow-step) gives the comment above `resolve` as "the production folder
   is configured as /../../spartanlaboratories.org/". The build says "the repository variable
   SPACESHIP_REMOTE_DIR sets the production folder as /../../spartanlaboratories.org/", with the lines
   rewrapped. A reader of the step can then see which setting carries the folder. *Based on:* the
   variable [plan 2](plan.md#2-root-cause) names; no research finding bears on it.

3. **The comment above the `env:` folder defaults is reworded.**
   [Plan 3.1](plan.md#31-the-workflow-step) says nothing else in the file changes. The comment said
   that repository variables "of the same name" override the defaults, but each default is overridden by
   a variable with another name (`PRODUCTION_REMOTE_DIR` by `SPACESHIP_REMOTE_DIR`, and likewise for
   the other three), so it pointed a reader at variables that do not exist. It now reads "Each default
   below is overridden by the repository variable its line reads", which agrees with the step's comment
   in deviation 2. *Based on:* the `env:` block at `.github/workflows/deploy-spaceship.yml:47-54`;
   no research finding bears on it.

4. **Both new test files group their imports under regions.**
   [Plan 3.2](plan.md#32-the-regression-test-class) lists the integration class's imports in one run,
   as the module's other test files have them. The build groups the imports of both new classes under
   `//region` blocks with the sub-headings the organization's commenting standard sets out: the
   organization's own packages, the Java and Kotlin standard libraries, and testing. The imports are
   the same and in the same order; only comment lines were added. These two files are the first in the
   repository to follow the standard; the rest of the repository's imports are tracked in
   [#34](https://github.com/SpartanLaboratories/OrganizationPage/issues/34). *Based on:* the module's
   existing test files, which the plan's listing followed; no research finding bears on it.

5. **`docs/DEPLOYMENT.md` names both classes.**
   [Plan 3.4](plan.md#34-documentation) gives the `workflow-checks` paragraph as naming
   `StagingTargetCheckTest` once, after "over pairs of folders". The build drops that name there and adds
   a sentence after the push filter: two classes named `StagingTargetCheckTest` cover the target check,
   the gating one over three folder pairs and the integration one over the full list. The reference has
   to say where the check is covered, which deviation 1 changed. *Based on:*
   [plan 3.4](plan.md#34-documentation) and deviation 1; no research finding bears on it.

6. **The plan's one commit is more than one.**
   [Plan 6](plan.md#6-version-control) puts the step, the tests, the documents and the plan in one
   commit. The commit that lands the behaviour holds the step, both test classes, the support-object
   comment, the first versions of the three documents, and the plan with its `consequences.md`. The
   edits of deviations 2 to 5 ride in a later commit, with this record and the reconciled
   `consequences.md`; they change no behaviour. The type is `fix:` and no version moves, as planned.
   *Based on:* the plan's own commit split; no research finding bears on it.
