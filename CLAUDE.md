# OrganizationPage

Website for the Spartan Laboratories organization. Kotlin multi-module Gradle build:
`shared` (KMP models + site copy), `server` (Ktor), `web` (Compose HTML, Kotlin/JS).
See README.md for layout and commands. `./gradlew build` compiles and tests everything.
Site text lives in `shared/src/commonMain/kotlin/com/spartanlaboratories/shared/content/OrganizationContent.kt`.

## Deployment policy (this project)

These rules apply to OrganizationPage only. They are a prototype that may later be
adopted by other projects, but they are not organization-wide policy.

1. Every change goes to a pre-production (staging) environment first and is viewed
   there in a browser before it reaches production.
2. Production changes only after a person explicitly approves it. Never add automatic,
   direct, or auto-approved production deploys, and never skip or weaken an approval check.
3. Production receives the exact build artifact that was staged. Never rebuild for
   production.
4. Staging and production deploy through the same mechanism, so staging exercises the
   real deploy path.
5. The production path fails closed: if the approval gate is missing or can't be
   verified, it refuses to deploy.
6. Staging is kept out of search results and is visibly marked as staging.
7. Any branch may be staged for review; only `main` can reach production.
8. Workflows are named after the project ("OrganizationPage Deploy", "OrganizationPage CI").
9. Deploying to a live server is outward-facing: get the owner's go-ahead before
   triggering a deploy, and have them check the staged result before shipping.

## How the policy is implemented

- **Workflow:** `.github/workflows/deploy-spaceship.yml` ("OrganizationPage Deploy").
  Jobs: `build` (tests + `site` artifact, kept 90 days) → `staging` (automatic) →
  `production` (`main` only). Keep this filename: GitHub offers the manual "Run workflow"
  button only for workflow files already on `main`.
- **Triggers:** push to `main` (staging, then production after approval); manual run on
  any branch (staging only).
- **Approval:** the `production` GitHub environment must have required reviewers
  (repo is public, so this works on any plan). The `production` job checks for this via
  the API before uploading and fails if it's absent. Approve with
  "Review deployments" on the run.
- **Shared deploy action:** `.github/actions/spaceship-deploy` (FTP-Deploy-Action over
  FTPS; ftp is upgraded to ftps; ports 22 and 443 are rejected).
- **Hosting (Spaceship, cPanel, FTP login starts in the home folder):**
  - Production: `/spartanlaboratories.org` → https://spartanlaboratories.org
  - Staging: `/spartanlaboratories.org/staging` → https://spartanlaboratories.org/staging/
    (`staging.spartanlaboratories.org` redirects there)
  - The repo variable `SPACESHIP_REMOTE_DIR` is set to `/../../spartanlaboratories.org/`,
    which resolves to the same folder.
- **Because staging sits inside the production folder:** production deploys never use
  clean-slate (it would delete staging); the manual "clean" option applies to staging only.
  The staging folder must differ from production and can't be the FTP root, and
  production can't be the FTP root.
- **Staging marking:** `[Staging]` title prefix and a `noindex` meta tag, added to the
  staging upload only. `robots.txt` isn't used because crawlers only read it at the site root.
- **Rollback:** re-run the `production` job of an earlier successful `main` run and
  approve it.
- **Verify what's live:** `/build-info.json` on either site names the commit and run.
- **Secrets:** `SPACESHIP_FTP_SERVER`, `SPACESHIP_FTP_USERNAME`, `SPACESHIP_FTP_PASSWORD`.
