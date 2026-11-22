# Consequences: the staging target check compares resolved paths

What this fix does to its surroundings and what it leaves behind. The design is in [`plan.md`](plan.md).

## Published artifacts

None changes and no version moves. The site artifact and the server jar are built from the same sources as before. The live staging upload folder stays `/spartanlaboratories.org/staging/`: no `SPACESHIP_STAGING_REMOTE_DIR` variable is set, and the default is already written plainly, so resolving it changes nothing.

## Blast radius

- **The staging job.** Its first step now refuses two kinds of staging folder that used to pass: one that resolves to the production folder, and one that resolves to the FTP root, however each is written. Either used to let a manual `clean_staging` run delete the whole folder. The step also hands on the resolved folder, so a folder written with `.`, `..` or repeated slashes uploads to the folder it resolves to.
- **Callers.** `Deploy to staging` is the only reader of the step's output. The production job, its target check and its approval check, `publish-docs.yml`, `ci.yml` and the shared deploy action are untouched.
- **The deploy build.** `./gradlew build` and `check` run the new test class with the rest of `workflow-checks`, so a later edit that breaks the check stops the build. The class skips itself on a machine with no bash, as `StagingMarkingTest` does.
- **Documents.** `docs/DEPLOYMENT.md`, `README.md` and `CHANGELOG.md` change as [the plan's documentation section](plan.md#34-documentation) lists. `docs/DEPLOYMENT.md` goes live at the merge through the documents publish, and the workflow change takes effect at the same merge.
- **Downstream consumers.** None: no other repository uses these workflows.

## Adoption

The mechanism this fix replaces is a folder compared as normalized text. Two other places in the repository handle the same folders, and neither is moved onto the new function here:

- **The production job's `Check production target`** tests its folder against `/` as text. It is a follow-up (1 below).
- **The documents publish's target check** resolves paths with `realpath -m` and already compares resolved paths. It stays as it is (follow-up 3 below).

## Neighbouring issues

- **[SpartanLaboratories/OrganizationPage#8](https://github.com/SpartanLaboratories/OrganizationPage/issues/8)** (publishing `docs/` to the live site). Its documents check compares resolved paths. This fix gives the staging check the same meaning by another mechanism, for the reasons in [the plan](plan.md#31-the-workflow-step). Its consequences name this issue as open and its staging check as left alone; that was true at its landing, and the note stays as written.
- **[SpartanLaboratories/OrganizationPage#7](https://github.com/SpartanLaboratories/OrganizationPage/issues/7)** (the Dokka and project site standard). It edited a different step of the staging job and added the `workflow-checks` module, to which this fix adds one test class. Its consequences carry the same note about this issue, and it stays as written too.

## Follow-ups

Each of these is open. The first two are gaps this fix knowingly leaves.

1. **The production job's own check compares text.** `Check production target` refuses a production folder only when its text is `/`, so a `SPACESHIP_REMOTE_DIR` of `/..` or `/a/..` would pass and send the site into the FTP root. The production job never cleans, so the effect is a site uploaded into the home folder, not a deletion. Resolving the folder with the same function and refusing the root closes it, in `.github/workflows/deploy-spaceship.yml`, with a test beside the staging one.
2. **A staging folder that contains production or the documents.** This fix refuses a staging folder equal to production and one at the FTP root. It still accepts a staging folder that is a proper ancestor of production, and one that contains the documents folder. For the live production folder, `/spartanlaboratories.org`, the only proper ancestor is the FTP root, which is refused, so the live configuration is covered; a production folder nested deeper would not be. A manual `clean_staging` run on such a folder would delete production or the documents. `docs/DEPLOYMENT.md` already says never to point the staging variable at a folder that holds the documents, because the staging job does not check it. Refusing a resolved staging folder that is a proper ancestor of the resolved production folder or of the documents folder closes it, with a test for each.
3. **One resolver for the three folders.** The documents publish resolves with `realpath -m`, which follows symbolic links on the runner and keeps a leading `//` as a root of its own on some platforms; the staging check resolves the text itself. For the live folders the two agree. Moving the documents publish onto the same function would leave one way of resolving the production, staging and documents folders. The earlier follow-up for a committed regression check of the documents publish's target check, in the consequences of #8, stays open, and `workflow-checks` is now where it would go.
4. **A shared step runner for the workflow tests.** `StagingMarkingTest` and `StagingTargetCheckTest` each carry their own code that writes a step body to a script, runs it in bash with a timeout and reads what it left. A third step test is the moment to move it into `support/workflows`.
