# Consequences: the staging target check compares resolved paths

What this fix does to its surroundings and what it leaves behind. The design is in [`plan.md`](plan.md)
and what was built in [`final-implementation.md`](final-implementation.md).

## Published artifacts

None changes and no version moves. The site artifact and the server jar are built from the same sources as before. The live staging upload folder stays `/spartanlaboratories.org/staging/`: no `SPACESHIP_STAGING_REMOTE_DIR` variable is set, and the default is already written plainly, so resolving it changes nothing.

## Blast radius

- **The staging job.** Its first step now refuses two kinds of staging folder that used to pass: one that resolves to the production folder, and one that resolves to the FTP root, however each is written. Either used to let a manual `clean_staging` run delete the whole folder. The step also hands on the resolved folder, so a folder written with `.`, `..` or repeated slashes uploads to the folder it resolves to.
- **Callers.** `Deploy to staging` is the only reader of the step's output. The production job, its target check and its approval check, `publish-docs.yml`, `ci.yml` and the shared deploy action are untouched.
- **The deploy build.** `./gradlew build` and `check` run both `StagingTargetCheckTest` classes with the rest of `workflow-checks`: the gating one, which covers the issue's case, the root and the live configuration, and the integration one, which runs the full list of spellings ([what was built](final-implementation.md#what-was-built)). A later edit that breaks the check stops the build. Both classes skip themselves on a machine with no bash, as `StagingMarkingTest` does.
- **Documents.** `docs/DEPLOYMENT.md`, `README.md` and `CHANGELOG.md` change as [the as-built record](final-implementation.md#what-was-built) lists. `docs/DEPLOYMENT.md` goes live at the merge through the documents publish, and the workflow change takes effect at the same merge.
- **Downstream consumers.** None: no other repository uses these workflows.

## Adoption

The mechanism this fix replaces is a folder compared as normalized text. Two other places in the repository handle the same folders, and neither is moved onto the new function here:

- **The production job's `Check production target`** tests its folder against `/` as text. It is follow-up 1 below.
- **The documents publish's target check** resolves paths with `realpath -m` and already compares resolved paths. It stays as it is (follow-up 3 below).

## Neighbouring issues

- **[SpartanLaboratories/OrganizationPage#8](https://github.com/SpartanLaboratories/OrganizationPage/issues/8)** (publishing `docs/` to the live site). Its documents check compares resolved paths. This fix gives the staging check the same meaning by another mechanism, for the reasons in [the plan](plan.md#31-the-workflow-step). Its consequences name this issue as open and its staging check as left alone; that was true at its landing, and the note stays as written.
- **[SpartanLaboratories/OrganizationPage#7](https://github.com/SpartanLaboratories/OrganizationPage/issues/7)** (the Dokka and project site standard). It edited a different step of the staging job and added the `workflow-checks` module, to which this fix adds two test classes. Its consequences carry the same note about this issue, and it stays as written too.
- **[SpartanLaboratories/OrganizationPage#34](https://github.com/SpartanLaboratories/OrganizationPage/issues/34)** (group imports as the commenting standard sets out). The two new test files group theirs; the other Kotlin files in the repository do not, and this fix leaves them as they are ([deviation 4](final-implementation.md#deviations-from-the-plan)).

## Follow-ups

Each of these is open. The first two are the gaps this fix knowingly leaves in the check's coverage, and each has an issue.

1. **The production job's own check compares text** ([#35](https://github.com/SpartanLaboratories/OrganizationPage/issues/35)). `Check production target` refuses a production folder only when its text is `/`, so a `SPACESHIP_REMOTE_DIR` of `/..` or `/a/..` would pass and send the site into the FTP root. The production job never cleans, so the effect is a site uploaded into the home folder, not a deletion. The issue proposes resolving the folder the way the staging check now does, refusing the root, and a test beside the staging ones. The [plan](plan.md#1-requirements) leaves it out of scope.
2. **A staging folder that contains production or the documents** ([#36](https://github.com/SpartanLaboratories/OrganizationPage/issues/36)). This fix refuses a staging folder equal to production and one at the FTP root. It still accepts a staging folder that is a proper ancestor of production, and one that contains the documents folder. For the live production folder, `/spartanlaboratories.org`, the only proper ancestor is the FTP root, which is refused, so the live configuration is covered; a production folder nested deeper would not be. A manual `clean_staging` run on such a folder would delete production or the documents. `docs/DEPLOYMENT.md` already says never to point the staging variable at a folder that holds the documents, because the staging job does not check it. The issue proposes refusing a resolved staging folder that is a proper ancestor of the resolved production folder or of the documents folder, with a test for each case, and then dropping that warning. The [plan](plan.md#1-requirements) leaves it out of scope.
3. **One resolver for the three folders** ([#38](https://github.com/SpartanLaboratories/OrganizationPage/issues/38)). The documents publish resolves with `realpath -m`, which follows symbolic links on the runner and keeps a leading `//` as a root of its own on some platforms; the staging check resolves the text itself. For the live folders the two agree. Once #35 moves the production job onto the same resolution, the documents publish is the only one of the three that differs; moving it onto the same function would leave one way of resolving the production, staging and documents folders. The earlier follow-up for a committed regression check of the documents publish's target check, in the consequences of #8, stays open, and `workflow-checks` is now where it would go. The issue proposes moving the documents publish onto the same function, with a test of its target check.
4. **A shared step runner for the workflow tests, now due.** `StagingMarkingTest` and the two `StagingTargetCheckTest` classes each carry their own code that writes a step body to a script, runs it in bash with a timeout and reads what it left, and the gating class repeats the integration class's helpers ([deviation 1](final-implementation.md#deviations-from-the-plan)). The plan named a third step test as the moment to move that code into `support/workflows`; with three classes it has come. No issue tracks this.
5. **The JVM tests run on JUnit 4** ([#37](https://github.com/SpartanLaboratories/OrganizationPage/issues/37)). `server`'s tests and every class of `workflow-checks` run on the JUnit 4 binding that `kotlin("test")` falls back to, while the organization's testing policy names JUnit 5 for JVM tests. The two new classes follow the module as it is and skip without bash through `org.junit.Assume`, so they change with the move: the issue proposes `useJUnitPlatform()` on the test tasks and `Assumptions.assumeTrue` in place of `Assume`.

## Outcome of the plan's assumptions

Neither of the [plan's assumptions](plan.md#52-assumptions) has failed. Both rest on how the FTP host behaves, which the build cannot test: the step reads text, and only the host reads paths.

| Assumption | Confirmed or refuted by |
|---|---|
| The FTP host reads a `..` at its root as the root | Production's deploys through `/../../spartanlaboratories.org/`, which serve the site from `/spartanlaboratories.org`, are the evidence. A deploy through that spelling that landed anywhere else would refute it |
| The host's folder names are case-sensitive | Nothing in this repository tests it. The host serving one folder under two spellings that differ only in case would refute it |

## Known gaps

- **The step has not run on the live variables.** At this landing no deploy run has exercised it, so its acceptance of the live configuration (production `/../../spartanlaboratories.org/`, staging at its default) is shown by the tests alone. It needs a deploy run: a manual run of `OrganizationPage Deploy` on the branch, which stages only and needs the owner's go-ahead first (deployment rule 9), or the staging job of the run the merge to `main` starts. The step must pass and write `remote_dir=/spartanlaboratories.org/staging/`, exactly what it writes today. The result goes in a comment on [#9](https://github.com/SpartanLaboratories/OrganizationPage/issues/9) ([plan 5.1](plan.md#51-edge-cases-and-callers)).
- **The check's two coverage gaps** are follow-ups 1 and 2 above.
