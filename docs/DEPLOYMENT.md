# Deployment

How OrganizationPage gets from a commit to https://spartanlaboratories.org, and the
rules that path must keep. The short form of the rules lives in `CLAUDE.md`; this file
is the full reference.

## Policy

These rules apply to OrganizationPage only. They are a prototype that may later be
adopted by other projects, but they are not organization-wide policy.

1. **Staging first.** Every change goes to staging first and is checked in a browser
   before it reaches production.
2. **A person approves production.** Production only changes after a person explicitly
   approves it. No automatic, direct or auto-approved production deploys, and no
   skipping or weakening the approval step.
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

## How the policy is implemented

### Workflow

`.github/workflows/deploy-spaceship.yml`, named **"OrganizationPage Deploy"**:

```
build (tests + site artifact) ──> staging (automatic) ──> production (main only, waits for approval)
```

- **build** runs `./gradlew check :web:jsBrowserDistribution`, writes
  `build-info.json`, and stores the result as the `site` artifact, kept for 90 days.
- **staging** uploads that artifact to the staging folder automatically.
- **production** runs only for `main`, and waits for approval before uploading the same
  artifact.

**Triggers:** a push to `main` runs staging, then production after approval. A manual
run (Actions → OrganizationPage Deploy → Run workflow) on any branch deploys to staging
only.

Keep the filename. GitHub only shows the "Run workflow" button for workflow files that
are already on `main`, so renaming the file would lose it.

`.github/workflows/ci.yml` ("OrganizationPage CI") builds and tests pull requests and
pushes to branches other than `main`. It never deploys.

### Approval

- The `production` GitHub environment must have a required reviewer (the repository is
  public, so this works on any plan), with deployment branches limited to `main`.
- The `production` job reads the environment's protection rules through the API before
  uploading, and fails if there is no required reviewer or the rules can't be read.
- Approve with **Review deployments** on the run page, after checking staging.
  Rejecting leaves production untouched.

### Deploy mechanism

One shared composite action, `.github/actions/spaceship-deploy`, uploads over FTPS
(FTP-Deploy-Action) for both staging and production.

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

The repository variable `SPACESHIP_REMOTE_DIR` is set to `/../../spartanlaboratories.org/`,
which resolves to the same production folder.

Because staging sits inside the production folder:

- production deploys never wipe their folder (a clean-slate upload would delete
  staging); their normal sync only removes files they uploaded themselves;
- the manual "clean" option applies to staging only;
- the staging folder must differ from the production folder, and neither can be the
  FTP root.

### Staging marking

The staging upload gets a `[Staging]` prefix on the page title and a
`noindex, nofollow` robots meta tag. Only the staging copy is changed; production gets
the artifact exactly as built. `robots.txt` isn't used, because crawlers only read it at
the site root.

### Secrets and variables

Secrets (Settings → Secrets and variables → Actions): `SPACESHIP_FTP_SERVER`,
`SPACESHIP_FTP_USERNAME`, `SPACESHIP_FTP_PASSWORD`. Both sites use them; environment
secrets of the same name on `staging` override them for staging.

Optional variables: `SPACESHIP_REMOTE_DIR`, `SPACESHIP_PRODUCTION_URL`,
`SPACESHIP_STAGING_REMOTE_DIR`, `SPACESHIP_STAGING_URL`, `SPACESHIP_FTP_PROTOCOL`,
`SPACESHIP_FTP_PORT`, `SPACESHIP_FTP_TIMEOUT`. Defaults and meanings are listed in the
README's one-time setup section.

## Operating it

- **Rolling back:** re-run the `production` job of an earlier successful `main` run and
  approve it. This works while that run's `site` artifact exists (90 days).
- **Checking what's live:** `/build-info.json` on either site shows the commit and run
  it was built from.
