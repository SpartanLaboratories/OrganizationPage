# OrganizationPage

This repository includes an automated GitHub Actions pipeline for deploying the site to Spaceship hosting.

## Deployment: staging, then production

Every change goes to a pre-production **staging** site first. Production only changes
after someone has looked at staging and approved it.

```
push to main ──> build + tests ──> staging (automatic) ──> production (waits for approval)
```

`.github/workflows/deploy-spaceship.yml` ("OrganizationPage Deploy") runs on every push to `main`:

1. **build** runs `./gradlew check :web:jsBrowserDistribution` and stores the site as the
   `site` artifact, together with a `build-info.json` naming the commit.
2. **staging** uploads that artifact to the staging folder. The staging copy gets a
   `[Staging]` title prefix and a `noindex` tag so search engines leave it out.
3. **production** pauses until a reviewer approves the `production` environment. Open
   the run, check the staging site, then use **Review deployments → Approve**. It then
   uploads the *same* artifact, so production is byte-for-byte what you reviewed
   (without the staging markers). Rejecting leaves production untouched.

The production job also checks that the `production` environment actually requires a
reviewer, and refuses to deploy if not. A missing setting can therefore never turn into
an unreviewed release.

**Staging a branch before merging:** Actions → **OrganizationPage Deploy** → **Run workflow**, pick the
branch. It deploys to staging only; production jobs only run for `main`.

**Rolling back:** open an earlier successful OrganizationPage Deploy run on `main`, re-run its
**production** job, and approve it. Site artifacts are kept for 90 days.

To confirm what is live, open `/build-info.json` on either site.

### One-time setup

1. **Staging site on Spaceship.** The FTP login starts in the hosting account's home
   folder, where production is served from `spartanlaboratories.org/`. Staging is the
   `staging/` subfolder of the production site, at
   `https://spartanlaboratories.org/staging/`, and `staging.spartanlaboratories.org`
   redirects there. The workflow already defaults to these folders and URLs. Because
   staging sits inside the production folder, production deploys never clean their
   target folder. Their normal sync only removes files they uploaded themselves, so
   `staging/` is left alone.
2. **Environments** (Settings → Environments):
   - `production`: click **New environment** and name it exactly `production`
     (GitHub only creates it on its own once a `main` run reaches the production job).
     Add yourself (or the release team) under **Required reviewers**, and limit
     **Deployment branches** to `main`.
   - `staging`: no protection needed. Leave branches unrestricted so any branch can be
     staged.
3. **Secrets** (Settings → Secrets and variables → Actions):
   `SPACESHIP_FTP_SERVER`, `SPACESHIP_FTP_USERNAME`, `SPACESHIP_FTP_PASSWORD`. Both sites
   use these. To give staging its own FTP account, add the same secret names to the
   `staging` environment; environment secrets override repository ones.
4. **Variables** (optional), same page. Folders are paths as the FTP login sees them.

| Variable                       | Default                                   | Purpose |
|--------------------------------|-------------------------------------------|---------|
| `SPACESHIP_REMOTE_DIR`         | `/spartanlaboratories.org`                 | Production folder. `/` is rejected. |
| `SPACESHIP_PRODUCTION_URL`     | `https://spartanlaboratories.org`         | Production address, shown as the environment link |
| `SPACESHIP_STAGING_REMOTE_DIR` | `/spartanlaboratories.org/staging`        | Staging folder. Must differ from the production folder. |
| `SPACESHIP_STAGING_URL`        | `https://spartanlaboratories.org/staging/` | Staging address, shown as the environment link and in the run summary |
| `SPACESHIP_FTP_PROTOCOL`       | no       | `ftps` (default) or `ftps-legacy`. `ftp` is upgraded to `ftps` because Spaceship commonly times out on plain FTP |
| `SPACESHIP_FTP_PORT`           | no       | Defaults to `21`, or `990` for `ftps-legacy`. `443` (control-connection FIN disconnects) and `22` (SFTP, unsupported) are rejected |
| `SPACESHIP_FTP_TIMEOUT`        | no       | FTP operation timeout in milliseconds, default `90000` |

Both environments upload through the same local action,
`.github/actions/spaceship-deploy`, so staging exercises the exact deploy path
production uses.

## Continuous integration

`.github/workflows/ci.yml` runs `./gradlew build` and builds the server jar on pull
requests and on pushes to branches other than `main`. The jar is attached to the run as
an artifact.
