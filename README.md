# OrganizationPage

The main website for the Spartan Laboratories organization: a Kotlin multi-module
project with a [Ktor](https://ktor.io) backend and a
[Compose HTML](https://github.com/JetBrains/compose-multiplatform#compose-html) (Kotlin/JS)
frontend, deployed to Spaceship hosting.

## Modules

| Module    | Kind                                | Responsibility |
|-----------|-------------------------------------|----------------|
| `shared`  | Kotlin Multiplatform (JVM + JS)     | Data models, API routes, JSON config and the site copy (`OrganizationContent`). The single contract between backend and frontend. |
| `server`  | Kotlin/JVM, Ktor (Netty)            | JSON API under `/api` and serving of the compiled frontend. Packaged as one runnable jar. |
| `web`     | Kotlin/JS, Compose HTML             | The browser UI. Builds to a static site (`index.html` + `web.js`). |

```
shared  <──  server
   ^
   └──────  web  ──(static bundle embedded into)──>  server
```

The frontend renders the content compiled into its bundle straight away, so it works as
plain static files. When it is served by the Ktor server it also fetches
`/api/organization` and shows the live copy.

To change the site's text, edit
`shared/src/commonMain/kotlin/com/spartanlaboratories/shared/content/OrganizationContent.kt`.

## Requirements

- JDK 21 (the Gradle wrapper downloads Gradle; the Kotlin plugin downloads Node.js for the web build)

## Common tasks

```bash
./gradlew build                          # compile everything and run all tests
./gradlew :server:run                    # API + site on http://localhost:8080
./gradlew :web:jsBrowserDevelopmentRun   # frontend dev server with live reload on http://localhost:3000
                                         # (proxies /api to :8080, so run the server too)
./gradlew :web:jsBrowserDistribution     # static site -> web/build/dist/js/productionExecutable
./gradlew :server:buildFatJar            # server/build/libs/organization-page-server.jar (includes the site)
```

### Server configuration

`server/src/main/resources/application.yaml`, overridable with environment variables:

| Variable       | Default   | Purpose |
|----------------|-----------|---------|
| `PORT`         | `8080`    | HTTP port |
| `HOST`         | `0.0.0.0` | Bind address |
| `CORS_ORIGINS` | *(empty)* | Comma-separated origins allowed to call the API from a browser, e.g. `https://spartanlaboratories.org` when the static site and API live on different hosts |

## Hosting on Spaceship

Two deployment shapes are supported:

1. **Static site (current pipeline).** Spaceship web hosting accepts files over FTP but
   does not run JVM processes. The deploy workflow builds the `web` module and uploads
   `web/build/dist/js/productionExecutable`. The page renders from the bundled content;
   the `/api` call simply falls back when no backend is present.
2. **Full stack.** To run the Ktor backend, deploy the server jar (or the `Dockerfile`
   image) to a host that runs a JVM or containers, such as a Spaceship VPS. That one
   process serves both the API and the site:

   ```bash
   docker build -t organization-page .
   docker run -p 8080:8080 organization-page
   # or: java -jar server/build/libs/organization-page-server.jar
   ```

## Deployment: staging, then production

Every change goes to a pre-production **staging** site first. Production only changes
after someone has looked at staging and approved it. The deployment policy and the
full reference for how it is implemented are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

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
