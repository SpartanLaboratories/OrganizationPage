# Consequences: the Dokka API reference and the site's branding

What this change does to its surroundings and what it leaves behind. The design is in
[`plan.md`](plan.md) and the evidence behind it in [`research/README.md`](research/README.md).

## Published artifacts

No library artifact or version changes: no module publishes, so nothing is bumped or released and no
javadoc jar is produced.

The live site gains `https://spartanlaboratories.org/docs/api/`, and staging gains
`https://spartanlaboratories.org/staging/docs/api/`. The `site` artifact grows from five files to
about 205 (about 5.4 MB). The server jar and the Docker image carry the same files, so they serve the
reference at `/docs/api/` as well. `/favicon.svg` disappears on the next deployment to each site,
because each site's sync record lists it and the build no longer produces it, and
`/spartan-laboratories-logo.png` takes its place.

## Blast radius

**Gradle.** The version catalog, `settings.gradle.kts`, the root build file and all three module build files change, and one module is added: `workflow-checks`, which holds only tests of the deployment workflows.
`./gradlew build`, `check`, `:web:jsBrowserDistribution` and `:server:buildFatJar` now generate the
API reference, so the deploy build and the Docker build do too. A documentation warning, such as a
broken KDoc link, fails all of them, and so can block a deployment. Moving the logo or the stylesheet
fails the same tasks until the root build file is updated with them.

**Workflows.** `ci.yml` gains a `docs` job. `deploy-spaceship.yml` replaces `paths-ignore: docs/**`
with an ordered `paths` list, so a push that changes only `docs/brand/` or `docs/dokka/` now starts a
site deployment; before this change a push touching only `docs/` never did. A push touching only other
files under `docs/` still starts none. The staging job marks every page of the site, not only
`index.html`, and fails if the artifact has no reference. The production job, the approval gate, the
shared deploy action and `publish-docs.yml` do not change, and deployment rule 10 keeps its text.

**The live host.** From the first deployment, production's sync record owns `/docs/` at the site root,
so nothing else may be placed there by hand: a later build without that folder would remove it,
recursively, along with anything put beside the reference ([`../8-docs-only-deploy-skip/research/ftp-deploy-nested-sync.md`](../8-docs-only-deploy-skip/research/ftp-deploy-nested-sync.md),
section 2). It is a different folder from the documents folder at `/OrganizationPage/docs/`, whose sync
record is untouched. The first upload to each site sends about 200 files; later uploads send only what
changed, because the generated pages are byte-identical when regenerated. `docs/brand/` and `docs/dokka/` also appear under `/OrganizationPage/docs/` through the
documents publish, as any committed file under `docs/` does.

**The site.** The header shows the logo in place of the text mark, the favicon is the same PNG, and
the header gains an `API docs` link. That image is 324 KB, once on first load.

**The server.** No source changes; `/docs/api/...` is answered through the static resources it already
serves. Its tests now depend on the reference having been generated, because they run through the real
web distribution.

**Tests.** `workflow-checks` runs the deploy workflow's staging marking step, as committed, over a
fixture of the site, and asserts the push filter's patterns and their order; `./gradlew build` and
`check` include it, so a change that breaks either fails CI and the deploy build. It is tied to the
workflow file's layout, so a reformat of that file fails the tests until they are updated. `server`
gains an `integrationTest` task and `workflow-checks` has `gatingTest` and `integrationTest`.

**Documentation.** `docs/DEPLOYMENT.md`, `README.md` and `CHANGELOG.md` move with the change.

**Downstream consumers.** None: no other repository consumes this repository's modules or workflows.

## Adoption

The organization's Dokka and project site standard is met as far as it applies here: Dokka 2 in V2
mode, the three modules aggregated at the root, `failOnWarning` in every configuration, the theme at
the root and in each module, the logo and the stylesheet under `docs/brand/` and `docs/dokka/styles/`,
the reference at `/docs/api/` because the site already uses `/api`, and a Dokka job in CI. The site is
hosted on Spaceship, so `pages.yml` and `website/` do not apply, and the Compose page at `/` is the
landing page. No module is published, so the javadoc jar does not apply.

Nothing else in the repository uses a mechanism this change replaces: `favicon.svg` had one reference,
which now points at the logo.

The stylesheet is adapted from the Spartan Laboratories theme in `SpartanLaboratories/WebTools`, in this
site's navy and amber. The logo is the same file as in `SpartanLabsGaming/MyGameTools` and
`SpartanLaboratories/WebTools`.

## Sibling units

None: this is the only unit of the work.

## Neighbouring issues

- **[SpartanLaboratories/OrganizationPage#8](https://github.com/SpartanLaboratories/OrganizationPage/issues/8)**
  (publishing `docs/` to the live site). Its documents say that `/docs/` at the site root stays free;
  this change takes that path for the reference. The `paths-ignore` filter it added is replaced by the
  ordered `paths` list, and its documents publish is unchanged.
- **[SpartanLaboratories/OrganizationPage#9](https://github.com/SpartanLaboratories/OrganizationPage/issues/9)**
  (the staging target check compares folder strings). This change edits a different step of the staging
  job and leaves that check as it is. Neither issue blocks the other.
- **[SpartanLaboratories/OrganizationPage#12](https://github.com/SpartanLaboratories/OrganizationPage/issues/12)**
  (local JS builds leave an untracked `kotlin-js-store/yarn.lock`). Building the site locally leaves that
  file behind, and whether it is committed or ignored is settled there. This change does not touch it.

## Follow-ups

These come from the plan's [follow-ups](plan.md#13-sequencing--follow-ups).

- **KDoc for the undocumented public declarations.** With undocumented reporting on, Dokka lists 93: 41 in
  `shared`, 44 in `web` and 8 in `server`. No existing declaration gained KDoc here, and
  `reportUndocumented` stays off until they are done, or `failOnWarning` would fail on each of them. No
  issue tracks this yet.
- **`/docs/api` without the trailing slash on the Ktor form.** The server answers it with the same page,
  whose relative links then resolve one level up. The form is not deployed today and the site's link
  carries the slash. A redirect there would close it.
- **Smaller logo variants.** One 324 KB PNG serves the header and the favicon. A small favicon, an
  `apple-touch-icon` and a header-sized image would cut the first load.
- **A link from `docs/index.html` to the reference**, which goes live ahead of a production approval, so
  it would answer 404 for a while on any change that moves it.
- **Dokka source links**, a view-source link on each reference page.
- **The footer year** in the Dokka theme is a literal and needs a manual edit each year.
- **A convention plugin** if the build grows past the one shared hook for Dokka's settings.
- **Moving `ApplicationTest` into a level-scoped test package**, so the existing server tests match the
  testing hierarchy the new integration test already follows.
- **Observations on the live system**, none of which has been made yet, because a deployment needs the
  owner's go-ahead. Each is recorded in a comment on
  [SpartanLaboratories/OrganizationPage#7](https://github.com/SpartanLaboratories/OrganizationPage/issues/7)
  when it happens. The first two are part of [acceptance](final-implementation.md#acceptance); the two
  filter observations close on their own triggers, because a manual run does not evaluate the filter:
  - *the staged branch* ([observation 1](plan.md#end-to-end-and-uat-manual)): the reference at
    `/staging/docs/api/`, its links, assets and marking, and the site's logo, favicon, palette and link;
  - *production after landing and approval* ([observation 2](plan.md#end-to-end-and-uat-manual));
  - *the first push that changes only `docs/brand/` or `docs/dokka/`:* it starts a site deployment and a
    documents publish;
  - *the first push that changes only another file under `docs/`:* it starts the documents publish and no
    deployment.

## Outcome of the plan's assumptions

None of the [plan's assumptions](plan.md#3-assumptions) has failed. Each can only be tested on the live
system, so each stays unconfirmed until the event named here.

| Assumption | Confirmed or refuted by |
|---|---|
| The logo, with its glow, reads well on the dark header and at favicon size | the owner's look at staging (observation 1) |
| The amber values outside the site's own palette look right in the reference | the owner's look at staging (observation 1) |
| The host redirects `/docs/api` to `/docs/api/` | the first deployment to staging |
| The first upload of about 200 files over FTPS completes within the FTP timeout | the first staging run |
| Folders that start with `-` survive the FTP commands | the first staging run ([Known gaps](#known-gaps)) |
| The three dot-name corners the deploy-trigger research left inferred hold | the first push that touches such a path; none is tracked today |

## Known gaps

- **Nothing has reached a live host.** The reference, the new header and favicon, and the push filter have
  been built and tested but not deployed or seen on staging or production, because a deployment needs
  the owner's go-ahead. The observations under [Follow-ups](#follow-ups) close this.
- **Folders that start with `-` over FTP are untested.** Dokka names class folders this way (for example
  `-organization/`). Whether the FTP commands the sync sends handle them is unmeasured, and only the
  first staging upload can show it. If they fail, the plan's [assumption](plan.md#3-assumptions) says what
  it would take.
- **The tests have run on Windows only.** On the branch's last push, the `API docs (Dokka)` job passed on
  Ubuntu, but the `build` job stopped at `kotlinNpmInstall`, on a `504 Gateway Timeout` from the npm
  registry, before any test ran. `build` still has to complete on Ubuntu.
