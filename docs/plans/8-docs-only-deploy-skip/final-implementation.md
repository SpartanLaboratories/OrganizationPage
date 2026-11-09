# Final implementation: publish `docs/` to the live site

**Covers:** [SpartanLaboratories/OrganizationPage#8](https://github.com/SpartanLaboratories/OrganizationPage/issues/8),
"Do not start a deployment for documentation-only pushes".
**Plan:** [`plan.md`](plan.md). **What it leaves behind:** [`consequences.md`](consequences.md).
**Baseline:** `main` at `21c23eb`. **Version:** no bump; no published artifact changes.

## Scope as built

Issue #8 asks for one thing: a push that changes only documentation should not start a deployment.
The build does that and goes further. Everything under `docs/` now goes to the live site on a push
to `main`, with no staging and no approval, at `https://spartanlaboratories.org/OrganizationPage/docs/`,
and the deployment rules state that exemption. The issue's text describes less than this; the
[plan's requirements](plan.md#1-requirements) are the full scope.

## What was built

- **`.github/workflows/deploy-spaceship.yml`.** `paths-ignore: docs/**` on the `push` trigger, so a
  push that changes only `docs/` starts no site deployment. The jobs, the approval gate and the
  folder defaults are unchanged.
- **`.github/workflows/publish-docs.yml`, "OrganizationPage Docs Publish".** Runs on a push to
  `main` that changes `docs/**`, and by hand; the job runs only on `main`. It has no environment, a
  read-only token and its own concurrency group. In order, it checks the target folder on resolved
  paths, refuses any symbolic link and any file the host would execute or interpret, writes
  `publish-info.json` naming the commit, run and attempt, uploads `docs/` through the shared deploy
  action without ever cleaning, and compares the marker the site serves with the one it wrote.
- **`docs/index.html`.** The folder's landing page, which the shared action requires.
- **`CLAUDE.md` and `docs/DEPLOYMENT.md`.** Rules 1 and 2 apply outside `docs/`, and rule 10 states
  the exemption. The reference describes the documents workflow, its guards, the documents folder,
  the variables `SPACESHIP_DOCS_REMOTE_DIR` and `SPACESHIP_DOCS_URL` and how to operate it. It
  records the boards-only merge rule, and it now says that a manual run on `main` reaches the
  production job.
- **`README.md` and `CHANGELOG.md`.** The changes in [plan 7.7](plan.md#77-documentation-pass-readmemd-and-changelogmd-commit-2-not-part-of-the-implementation-commit).
- **Not changed.** `.github/actions/spaceship-deploy/action.yml`, `.github/workflows/ci.yml`, and
  everything under `web/`, `server/` and `shared/`. `docs/plans/org-work-board/` is not part of this
  change.

## Acceptance

All ten [requirements](plan.md#1-requirements) hold in the build. Requirement 7 (this change starts
a full site deployment) and the generated boards in requirement 9 take effect at landing.

| Criterion | State |
|---|---|
| Gating checks | Pass; see [Measurements](#measurements) |
| Refusal check over the real `docs/` | Clean on the tree as it stands; it runs once more after the boards are generated |
| Observations that close at landing (1 to 5 and 7 in the [test plan](plan.md#9-test-plan)) | Not yet made: they need the landing run and the first publish. Results go in a comment on the issue, and they are [tracked in `consequences.md`](consequences.md#follow-ups) |

## Measurements

| Check | Result |
|---|---|
| `actionlint` on both workflow files | exit 0, with no shell pass ([known gap](consequences.md#known-gaps)) |
| Gating checks, items 3 to 7 | 96 of 96 pass |
| Mutants, item 8 | 31 of 31 caught |
| Diff scope, item 2 | no change to `action.yml`, `ci.yml` or any module; the diff of `deploy-spaceship.yml` is as deviation 1 describes |

The last run of the gating checks and mutants follows the last edit to either workflow file. No
Gradle suite ran, because no module's code changed.

## Deviations from the plan

Deviations 1 to 3 are comments only. No workflow logic differs from the plan.

1. **`deploy-spaceship.yml` has three comment changes beyond the five planned lines.**
   [Plan 7.1](plan.md#71-githubworkflowsdeploy-spaceshipyml-changed-one-addition) and Gating item 2
   call for only those five lines. The file also gains a line above `env:` saying that
   `publish-docs.yml` repeats the production and staging defaults, and its two comments on why
   production never cleans its folder now name the published documents too. Those comments describe
   what shares the production folder, which this change altered, and the repeated defaults should be
   visible from both files. *Based on:* [`research/ftp-deploy-nested-sync.md`](research/ftp-deploy-nested-sync.md),
   section 2, and the clean-slate point in the [verification results](research/README.md#verification-results).

2. **`publish-docs.yml` has comments the plan's full text does not.**
   [Plan 7.2](plan.md#72-githubworkflowspublish-docsyml-new) gives the file's full content. The build
   adds four comment lines at `concurrency`, on why publishes run one at a time and what the queue can
   do, and three in the refuse step, on why `*.pl` and `*.pl.*` are separate and why patterns end in a
   wildcard. Whoever next edits the queue or the list needs those reasons beside it, and the list has
   no committed regression check. *Based on:* [`research/github-path-filters.md`](research/github-path-filters.md),
   F7, and [`research/host-executable-files.md`](research/host-executable-files.md), section 2.

3. **`docs/index.html` has a comment after the doctype.**
   [Plan 7.3](plan.md#73-docsindexhtml-new) gives the page's full text. The build adds a comment saying
   the deploy action requires the file, because nothing else on the page shows that removing it would
   fail every publish. *Based on:* [`research/ftp-deploy-nested-sync.md`](research/ftp-deploy-nested-sync.md),
   section 6.

4. **`docs/DEPLOYMENT.md` differs from the plan's wording in four places.**
   [Plan 7.5](plan.md#75-docsdeploymentmd-changed), items 6, 8 and 10.
   - *Guards (item 6).* The paragraph opens "Two guards run before the upload and one after it" and
     closes by saying the check after the upload only reports. It runs after the files have gone, so
     a red run means looking on the host before re-running. *Based on:*
     [`research/ftp-deploy-nested-sync.md`](research/ftp-deploy-nested-sync.md), section 3.
   - *`docs/index.html` (item 6).* An added paragraph says the file must stay, for the reason in
     deviation 3. *Based on:* the same file, section 6.
   - *Clean option (item 8).* The plan says the documents folder can never be inside the staging
     folder, so the manual clean cannot wipe it. That overstates the guard: the target check runs only
     when the documents publish runs, and the staging job makes no such check. The bullet says so and
     warns against pointing `SPACESHIP_STAGING_REMOTE_DIR` at a folder holding the documents. *Based
     on:* the clean-slate point in the [verification results](research/README.md#verification-results).
   - *Rollback (item 10).* An added bullet explains that the documents roll back by reverting on
     `main`, because the site rollback does not touch them. *Based on:*
     [`research/ftp-deploy-nested-sync.md`](research/ftp-deploy-nested-sync.md), section 2.

5. **The comment and wording edits in deviations 1 to 4 ride in commit 2.**
   [Plan 11](plan.md#11-version-control) puts those files in commit 1 and has commit 2 carry only the
   documentation. Commit 1 holds the workflow logic, and commit 2 adds these edits, which change no
   behaviour. *Based on:* the plan's own commit split; no research finding bears on it.
