# Deployment

How OrganizationPage gets from a commit to https://spartanlaboratories.org, and the
rules that path must keep. The short form of the rules lives in `CLAUDE.md`; this file
is the full reference.

## Policy

These rules apply to OrganizationPage only. They are a prototype that may later be
adopted by other projects, but they are not organization-wide policy.

1. **Staging first.** Every change outside `docs/` goes to staging first and is checked
   in a browser before it reaches production.
2. **A person approves production.** Outside `docs/`, production only changes after a
   person explicitly approves it: no automatic, direct or auto-approved production
   deploys, and no skipping or weakening the approval step.
3. **Ship what was staged.** Production gets the exact build that was staged, never a
   fresh build.
4. **One deploy mechanism.** Staging and production deploy the same way, so staging
   tests the real deploy.
5. **Fail closed.** If the approval step is missing or can't be confirmed, production
   refuses to deploy.
6. **Staging is marked.** Staging is hidden from search engines and visibly marked as
   staging.
7. **Only `main` ships.** Any branch can be staged for review; only `main` can reach
   production.
8. **Project-named workflows.** Workflows are named after the project
   ("OrganizationPage Deploy", "OrganizationPage CI").
9. **Owner go-ahead.** Deploying to the live server needs the owner's go-ahead, and the
   owner checks staging before anything ships.
10. **`docs/` goes live directly.** A push to `main` that changes a file under `docs/`
    publishes `docs/` straight to the live site, with no staging and no approval, so the
    boards stay current. Rules 1, 2, 3, 5 and 9 do not apply to that publication. The
    exemption covers `docs/` and nothing else: every other change, including the rest of
    a push that also changes `docs/`, keeps the full path.

A pull request that changes only boards may be approved and merged by the automated
version control process without the owner's review. This applies to OrganizationPage
only.

## How the policy is implemented

### Workflow

`.github/workflows/deploy-spaceship.yml`, named **"OrganizationPage Deploy"**:

```
build (tests + site artifact) ──> staging (automatic) ──> production (main only, waits for approval)
```

- **build** runs `./gradlew check :web:jsBrowserDistribution` (which also generates the
  API reference with Dokka and fails on any documentation warning), writes
  `build-info.json`, and stores the result as the `site` artifact, kept for 90 days. The
  artifact carries the reference at `docs/api/`.
- **staging** uploads that artifact to the staging folder automatically.
- **production** runs only for `main`, and waits for approval before uploading the same
  artifact.

**Triggers:** a push to `main` that changes a file outside `docs/`, or a file under
`docs/brand/` or `docs/dokka/`, runs staging, then production after approval; a push that
changes only other files under `docs/` does not start this workflow. `docs/brand/` and
`docs/dokka/` are the only parts of `docs/` the site build reads, so they are the only
ones that deploy the site; the rest of `docs/` is published by the documents workflow
alone. If the site build starts reading another folder under `docs/`, add it to the
`paths` list in `deploy-spaceship.yml`: a change to that folder alone starts no
deployment until it is listed. The list is ordered and the last pattern that matches a
path decides, so `'!docs/**'` stays after `'**'` and the two re-includes stay after it.
A manual run (Actions → OrganizationPage Deploy → Run workflow) on a branch other than
`main` deploys to staging only; a manual run on `main` also reaches the production job
and waits for approval there.

Keep the filename. GitHub only shows the "Run workflow" button for workflow files that
are already on `main`, so renaming the file would lose it.

`.github/workflows/ci.yml` ("OrganizationPage CI") builds and tests pull requests and
pushes to branches other than `main`. It never deploys. Its `docs` job, "API docs
(Dokka)", runs `./gradlew dokkaGeneratePublicationHtml`.

### Documents workflow

`.github/workflows/publish-docs.yml`, named **"OrganizationPage Docs Publish"**, uploads
`docs/` to the documents folder on every push to `main` that changes a file under
`docs/`. It implements rule 10. It has no staging step and declares no GitHub
environment, so the `production` environment's required reviewer does not apply to it.

Two guards run before the upload and one after it. A target check on resolved paths
requires the documents folder to be strictly inside the production folder and clear of
the staging folder. A refusal check stops the job on any symbolic link, and on any file
the server would execute or interpret (the names are listed in the workflow): the job
names each one and publishes nothing. A check after the upload compares the live site's
`publish-info.json` with the one this run wrote, so a copy left by an earlier run cannot
pass it. The check after the upload only reports: when it fails, the files have already
been uploaded, possibly to another folder, so look for them on the host before
re-running.

`docs/index.html` must stay: the shared deploy action refuses a folder without one, so
every publish fails if it is removed or renamed.

A push that changes both `docs/` and other files runs both workflows independently:
`docs/` goes live at once, the rest waits for staging and approval. A push that changes
`docs/brand/` or `docs/dokka/` starts both workflows: the files go live in the documents
folder at once, and the site, including the API reference, waits for staging and
approval.

A workflow that a push does not match leaves no entry in the Actions list: no run, no
skipped entry. A push that changes only `docs/` files other than `docs/brand/` and
`docs/dokka/` therefore shows no "OrganizationPage Deploy" run, and a push with nothing
under `docs/` shows no "OrganizationPage Docs Publish" run. That is expected.

To republish by hand: Actions → OrganizationPage Docs Publish → Run workflow on `main`. A
run on any other branch does nothing.

### Approval

- The `production` GitHub environment must have a required reviewer (the repository is
  public, so this works on any plan), with deployment branches limited to `main`.
- The `production` job reads the environment's protection rules through the API before
  uploading, and fails if there is no required reviewer or the rules can't be read.
- Approve with **Review deployments** on the run page, after checking staging.
  Rejecting leaves production untouched.

### Deploy mechanism

One shared composite action, `.github/actions/spaceship-deploy`, uploads over FTPS
(FTP-Deploy-Action) for staging, production and the published documents.

- `ftp` is upgraded to `ftps`, because Spaceship commonly times out on plain FTP.
- The port defaults to `21`, or `990` for `ftps-legacy`. Port `443` (control-connection
  FIN disconnects) and port `22` (SFTP, unsupported) are rejected.

### Hosting

Spaceship shared hosting (cPanel). The FTP login starts in the hosting account's home
folder, so folders below are paths as the FTP login sees them.

| Site       | Folder                             | URL |
|------------|------------------------------------|-----|
| Production | `/spartanlaboratories.org`         | https://spartanlaboratories.org |
| Staging    | `/spartanlaboratories.org/staging` | https://spartanlaboratories.org/staging/ (`staging.spartanlaboratories.org` redirects there) |
| Documents  | `/spartanlaboratories.org/OrganizationPage/docs` | https://spartanlaboratories.org/OrganizationPage/docs/ |

The repository variable `SPACESHIP_REMOTE_DIR` is set to `/../../spartanlaboratories.org/`,
which resolves to the same production folder.

Because staging and the published documents sit inside the production folder:

- production deploys never wipe their folder (a clean-slate upload would delete
  staging and the published documents); their normal sync only removes files they
  uploaded themselves;
- the manual "clean" option applies to staging only. The documents publish refuses a
  documents folder that is, sits inside, or contains the staging folder, but it checks
  this only when it runs: the staging job does not, so never point
  `SPACESHIP_STAGING_REMOTE_DIR` at a folder that holds the documents;
- the staging folder must differ from the production folder, and neither can be the
  FTP root;
- the documents folder must be strictly inside the production folder and must not be,
  sit inside, or contain the staging folder;
- each of the three folders keeps its own sync record (`.ftp-deploy-sync-state.json` in
  the folder), so no sync removes what another uploaded;
- the site's build output must never contain a top-level `OrganizationPage` or `staging`
  entry: a later build without it would make production's sync remove that whole folder,
  with the documents or staging in it;
- the site's build output holds `docs/api/` (the API reference), which production's and
  staging's own sync records list, so nothing else may be placed under `/docs/` at the
  site root; that `/docs/` is not the documents folder, which is
  `/OrganizationPage/docs`.

### Staging marking

The staging upload gets a `[Staging]` prefix on the page title and a
`noindex, nofollow` robots meta tag on every page of the site: the home page and each
page of the API reference. Dokka's `navigation.html` files are fragments its pages load
by script, not pages, so they are left as built. The step fails if the artifact has no
`docs/api/index.html`, or if that page has no `<head>` or `<title>`. Only the staging
copy is changed; production gets the artifact exactly as built. `robots.txt` isn't used,
because crawlers only read it at the site root.

The `workflow-checks` module runs this step, as committed, over a fixture of the packaged
site (`StagingMarkingTest`), and asserts the push filter's patterns and their order
(`DeployPushFilterTest`). `./gradlew build` and `check` run them, so the deploy build
stops on either.

### Secrets and variables

Secrets (Settings → Secrets and variables → Actions): `SPACESHIP_FTP_SERVER`,
`SPACESHIP_FTP_USERNAME`, `SPACESHIP_FTP_PASSWORD`. The site deployment's staging and
production jobs and the documents publish use them; environment secrets of the same name
on `staging` override them for staging.

Optional variables: `SPACESHIP_REMOTE_DIR`, `SPACESHIP_PRODUCTION_URL`,
`SPACESHIP_STAGING_REMOTE_DIR`, `SPACESHIP_STAGING_URL`, `SPACESHIP_DOCS_REMOTE_DIR`,
`SPACESHIP_DOCS_URL`, `SPACESHIP_FTP_PROTOCOL`, `SPACESHIP_FTP_PORT`,
`SPACESHIP_FTP_TIMEOUT`. Defaults and meanings are listed in the table in the README's
one-time setup section.

## Operating it

- **Rolling back:** re-run the `production` job of an earlier successful `main` run and
  approve it. This works while that run's `site` artifact exists (90 days).
- **Rolling back the documents:** revert the change on `main`; that push publishes the
  reverted `docs/`. The site rollback above does not touch the documents.
- **Checking what's live:** `/build-info.json` on either site shows the commit and run
  it was built from.
- **Removing a published document:** delete it from `docs/` on `main`; the next publish
  removes it from the site.
- **The documents and `/build-info.json`:** that file describes the site build only, so
  it says nothing about the documents.
- **Checking which documents are live:** `/OrganizationPage/docs/publish-info.json` shows
  the commit, run and attempt last published.
- **Seeing the API reference:** https://spartanlaboratories.org/docs/api/ (staging:
  https://spartanlaboratories.org/staging/docs/api/). It is generated by the build and
  ships inside the `site` artifact, so it changes only when the site does and rolls back
  with it. The same files are in the server jar under `static/docs/api/`.
