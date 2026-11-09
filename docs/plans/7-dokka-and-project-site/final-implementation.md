# Final implementation: the Dokka API reference and the site's branding

**Covers:** [SpartanLaboratories/OrganizationPage#7](https://github.com/SpartanLaboratories/OrganizationPage/issues/7),
"Adopt the organization's Dokka and project site standard".
**Plan:** [`plan.md`](plan.md). **What it leaves behind:** [`consequences.md`](consequences.md).
**Baseline:** `main` at `028231e`. **Version:** no bump; nothing in this repository is published.

## What was built

- **The API reference.** Dokka `2.3.0` in V2 mode, named in `gradle/libs.versions.toml`. The root
  build file applies it beside the Kotlin plugins, which stay `apply false`, and aggregates `shared`,
  `server` and `web`. One `allprojects` hook sets `failOnWarning`, the stylesheet, the logo and the
  footer for the root and every module that applies Dokka. `reportUndocumented` stays off, and no
  existing declaration gained KDoc.
- **Packaging.** The root exposes `build/dokka/html` as a consumable `api-reference` configuration, and
  `web`'s `jsBrowserDistribution` places it at `docs/api/`. The `site` artifact, the server jar and the
  Docker image all carry it, with no workflow copy step. `jsProcessResources` adds the logo at the
  distribution root.
- **The site.** The header shows the logo at 48 px on a soft cream glow, in place of the text "S" mark.
  The favicon is the same PNG and `favicon.svg` is gone. The nav gains an `API docs` link with the
  relative `href` `docs/api/`.
- **Brand files.** `docs/brand/spartan-laboratories-logo.png`, byte for byte the file in
  `SpartanLabsGaming/MyGameTools`, and `docs/dokka/styles/dokka-styles.css`, in the site's navy and amber.
- **CI.** `ci.yml` gains a `docs` job, "API docs (Dokka)", running `./gradlew dokkaGeneratePublicationHtml`.
- **Deployment.** `deploy-spaceship.yml`'s `on.push` has the ordered `paths` list in place of
  `paths-ignore`, so a change under `docs/brand/` or `docs/dokka/` starts a deployment. Its `Mark as
  staging` step marks every page of the packaged site and fails with an annotation if the artifact has
  no `docs/api/index.html` or that page has no `<head>` or `<title>`. `docs/DEPLOYMENT.md` records the
  triggers, the marking, the new folder and the regression tests. Rule 10 and everything about staging,
  approval, the same artifact and failing closed are unchanged.
- **Tests.** `ApiReferenceServingTest` (12 tests) checks the reference, the logo and the site's links
  through the real packaged distribution. The test-only module `workflow-checks` holds
  `DeployPushFilterTest` (3), and `StagingMarkingTest` (7), which runs the committed step body in bash
  over a fixture that includes a page under a `-` folder, with a 60-second limit on each run; the
  support objects are `DeployWorkflow` and `Bash`. `server` has an `integrationTest` task, and
  `workflow-checks` has `gatingTest` and `integrationTest`; `test` still runs everything.
- **`README.md` and `CHANGELOG.md`.** The changes in
  [plan 7.10](plan.md#710-documentation-pass-readmemd-and-changelogmd-commit-2).
- **Not changed.** `publish-docs.yml`, `.github/actions/spaceship-deploy/action.yml`, the production job
  and its approval gate, `Dockerfile`, `.dockerignore`, `CLAUDE.md`, `docs/index.html`, and everything
  under `shared/src` and `server/src/main`.

## Acceptance

The build meets the [requirements](plan.md#1-requirements). What only a live host can show has not been
shown yet.

| Criterion | State |
|---|---|
| [Gating checks](plan.md#gating-local-before-committing) | Hold in the as-built state, as measured below. Item 8 was run by hand. The mutants of items 2, 3, 5 and 7 are not on record. |
| Staged branch ([observation 1](plan.md#end-to-end-and-uat-manual)) | Not yet made: a deployment needs the owner's go-ahead. [Tracked in `consequences.md`](consequences.md#known-gaps). |
| Production ([observation 2](plan.md#end-to-end-and-uat-manual)) | Not yet made, for the same reason. |

## Measurements

| Check | Result |
|---|---|
| `:server:test` | 16 pass: `ApplicationTest` 4, `ApiReferenceServingTest` 12 |
| `:workflow-checks:test` | 10 pass, none skipped: `DeployPushFilterTest` 3, `StagingMarkingTest` 7. `gatingTest` and `integrationTest` each run their own class |
| The same tests on Ubuntu | Not run: [Known gaps](consequences.md#known-gaps) |
| `dokkaGeneratePublicationHtml --rerun-tasks` | Passes with no warning |
| A broken KDoc link planted in `shared`, `server` and `web` in turn | Fails the task each time (`Couldn't resolve link`, `Failed with warningCount=`) |
| Undocumented public declarations, with reporting on | 93: 41 in `shared`, 44 in `web`, 8 in `server` |
| `web/build/dist/js/productionExecutable` | 205 files, 5.4 MB: `web.js` 967 KB, the logo 324 KB, `docs/api/` 201 files and 3.4 MB. No `favicon.svg`, and no top-level `OrganizationPage` or `staging` entry |
| `organization-page-server.jar` | Holds `static/docs/api/index.html` and `static/spartan-laboratories-logo.png`, and no `static/favicon.svg` |
| `Mark as staging`, as committed, over a copy of the real distribution | Exit 0. 141 pages marked, each with one `noindex` tag, one `[Staging]` title and one `<head>`; the 4 `navigation.html` fragments and the 60 other files byte-identical |
| Mutants of the deploy workflow | Each fails `:workflow-checks:test`: filter order (`patternsAreListedInOrder`), no reference guard (the three `failsWhen...Reference...` tests), home page only and no title expression (`marksEveryPageOfTheSite`) |
| The workflows as test inputs | An unchanged run is up to date; a comment edit in `deploy-spaceship.yml` reruns the tests |
| Logo | 324,247 bytes, git blob `6b680404171c361cdbcda35e51a45a87776f5f74`, the same as in MyGameTools |
| Stylesheet | Every hex literal is in the plan's set; no WebTools value and no `--sl-navy` or `--sl-bronze`; the logo token is defined once |
| Declarative guards | `deploy-spaceship.yml` has two hunks against the baseline, the filter and the marking step. The files listed as not changed above are unchanged. The root build file sets `failOnWarning` once and `reportUndocumented` nowhere |
| `actionlint` on `ci.yml` and `deploy-spaceship.yml` | Run by hand by the owner and reported clean; no output was kept |

Everything above the last row was measured on Windows at the as-built state.

## Deviations from the plan

Deviations 1 to 4 are comments and documentation wording only. No build logic, workflow step or test
differs from the plan.

1. **The comment on `reportUndocumented` in the root build file.**
   [Plan 7.1](plan.md#71-gradle) gives the file's final content, which says the existing declarations
   carry no KDoc yet. The build says many existing public declarations carry none, because some do
   have it. *Based on:* the plan's own text; no research finding bears on it.

2. **The logo-glow comments in `AppStylesheet.kt` and `dokka-styles.css`.**
   [Plan 7.2](plan.md#72-compose-site-and-resources) and
   [plan 7.3](plan.md#73-docsdokkastylesdokka-stylescss-new) give comments saying the glow fades out
   before the box edge. The gradient's last stop is `transparent 100%`, so it reaches transparent at
   the edge, and the comments now say that. *Based on:* the plan's own text; no research finding bears
   on it.

3. **`DeployWorkflow` and `Bash` carry more KDoc than the plan's content.**
   [Plan 7.7](plan.md#77-workflow-checks-tests-new) gives their final content. In the build,
   `DeployWorkflow.lines` has its own KDoc, `runBlockOf` names its parameter, its return and its
   failures, including that the search for a `run: |` block is not bounded by the step, and `Bash` has
   KDoc on `executable` and a comment explaining the path it derives from `git --exec-path`. These are
   the contracts a reader of the shared support needs. *Based on:* the plan's own text; no research
   finding bears on it.

4. **The failure sentence in `docs/DEPLOYMENT.md`'s Staging marking section.**
   [Plan 7.8](plan.md#78-docsdeploymentmd-changed-in-commit-1), item 6, says the step fails if the
   artifact has no `docs/api/index.html` or that page has no `<head>` or `<title>`. The file also says
   it fails if the home page has neither, because the step does: [plan section 5](plan.md#5-error-handling-logging-and-documentation-approach)
   keeps those two guards. *Based on:* the plan's own text; no research finding bears on it.

5. **The edits in deviations 1 to 4 ride in commit 2.**
   [Plan 11](plan.md#11-version-control) puts those files in commit 1 and has commit 2 carry only
   documents. Commit 1 holds the behaviour; these edits change none. *Based on:* the plan's own commit
   split; no research finding bears on it.
