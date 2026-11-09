# Consequences: publishing `docs/` to the live site

What this change does to its surroundings and what it leaves behind. The design is in
[`plan.md`](plan.md) and the evidence behind it in [`research/README.md`](research/README.md).

## Published artifacts

No library artifact or version changes, so nothing is bumped or released.

The live site gains one public folder, `https://spartanlaboratories.org/OrganizationPage/docs/`,
stored at `/spartanlaboratories.org/OrganizationPage/docs` inside the production folder. It mirrors
the repository's `docs/` folder path for path, so the organization work board is at
`/OrganizationPage/docs/plans/org-work-board/`. `/docs/` at the site root stays free. The folder
holds its own `.ftp-deploy-sync-state.json`, which lists file names, sizes and hashes and is
publicly readable, as the production folder's already is, and a `publish-info.json` that names the
commit, run and attempt last published.

## Blast radius

**Workflows.** `OrganizationPage Deploy` no longer starts for a push that changes only `docs/`, and
the new `OrganizationPage Docs Publish` starts for any push to `main` that changes `docs/`. A push
that changes both starts both. A workflow that a push does not match leaves no entry at all in the
Actions list, so a missing run is normal. Most landings in this repository are mixed pushes, because
plan documents are committed with the code they describe: their documents go live at the merge, and
a board can describe a change before production has it.

**The deployment rules.** Rules 1 and 2 in `CLAUDE.md` and `docs/DEPLOYMENT.md` now apply outside
`docs/`, and a new rule 10 states the exemption from rules 1, 2, 3, 5 and 9.
`docs/DEPLOYMENT.md` also states that, in this repository, a pull request changing only boards may
be approved and merged by the automated version control process without the owner's review. Taken
together, such a pull request goes live with no person looking at it.

**What becomes public.** Everything under `docs/`, now and later, is served from the organization's
domain as soon as it lands, and search engines may index it: plans, research, boards and
`DEPLOYMENT.md`. The repository is already public, so nothing new is disclosed, but nothing
sensitive can be committed under `docs/`.

**The live host.** The production and staging folders are untouched, and each keeps its own sync
record, so no sync removes what another uploaded. The site's build output must never contain a
top-level `OrganizationPage` or `staging` entry: a later build without it would make production's
sync remove that whole folder.

**What may no longer be added under `docs/`.** A file the host would execute or interpret
(`.php`, `.htaccess`, `.cgi`, `.fcgi` and the rest of the refusal list in `publish-docs.yml`), or a
symbolic link of any kind, now fails the publish on `main`. The boards and documents generated under
`docs/` have to keep clear of those names and cannot use links.

**Downstream consumers.** None: no other repository consumes these workflows. The organization work
board is committed to this repository from other repositories' landings, and each of those commits
now publishes it rather than starting a site deployment.

## Adoption

The shared deploy action gains a third caller and does not change. Nothing else in this repository
uses a mechanism this change replaces: `deploy-spaceship.yml` is the only deploying workflow, and
`ci.yml` never deploys.

## Sibling units

None: this is the only unit of the work.

## Neighbouring issues

- **[SpartanLaboratories/OrganizationPage#7](https://github.com/SpartanLaboratories/OrganizationPage/issues/7)** (the organization's Dokka and project site standard).
  Its API reference at `/docs/api/` is unaffected, because `/docs/` at the site root stays free. The
  assets it adds under `docs/brand/` and `docs/dokka/` will be served under
  `/OrganizationPage/docs/` as soon as they land.
- **[SpartanLaboratories/OrganizationPage#9](https://github.com/SpartanLaboratories/OrganizationPage/issues/9)** (the staging target check compares folder strings).
  The documents check compares resolved paths and leaves the staging check as it is. Neither issue
  blocks the other.

## Follow-ups

Each of these is still open. They come from the plan's
[follow-ups](plan.md#13-sequencing--follow-ups).

- **A dedicated FTP account confined to `/OrganizationPage/docs/`.** The publish reuses the
  account that can write the whole site, so its two checks are the only fence, and they live in a
  workflow file on `main`. A confined account would keep the job inside its folder even by mistake.
  It needs the account created on the host, its own secrets, and the target check changed to suit a
  login whose root is that folder. Whether to set it up is open with the owner, and no issue tracks
  it.
- **Pointing the organization work board's links at the served URLs.** They stay GitHub URLs until
  the board's template changes, which is outside this repository.
- **Sharing the production and staging folder defaults** between the two workflow files, if a third
  workflow needs them. Today both files repeat them.
- **A regression check for the guards.** The target check, the refusal list and the workflow's
  declarative guards are tested once, by checks that are not committed, so a later edit to the
  refusal list has nothing to catch a mistake. Committing those checks needs a CI job, which this
  change leaves out because `ci.yml` does not change.
- **The boards-only merge rule's exact coverage.** `docs/DEPLOYMENT.md` states the rule without
  saying which paths count as boards or whether other pull requests gain a gate. Both are open with
  the owner.
- **Observations on the live system,** none of which has been made yet. Each is recorded in a
  comment on [SpartanLaboratories/OrganizationPage#8](https://github.com/SpartanLaboratories/OrganizationPage/issues/8)
  when it happens. Only the first of these is part of acceptance.
  - *This landing's own runs and first publish* ([observations 1 to 5 and 7](plan.md#9-test-plan)):
    the runs start, the publish log and the confirm step are clean, the folder is served, the
    production and staging folders are undisturbed, one file of each static type comes back
    unchanged, and the owner judges the landing page.
  - *The organization work board's first commit,* a docs-only push: it starts a publish run and no
    deployment run, and uploads only the new files and `publish-info.json`.
  - *The first push to `main` with nothing under `docs/`:* it starts no publish run.
  - *The first push that removes a folder under `docs/`:* the folder and a removed file disappear
    from the site and from the sync record. Until then, the assumption that the FTP server accepts
    the `//`-prefixed removal path stays open. If it fails, the publish fails loudly and keeps the
    previous record.
  - *The owner's go-ahead for manual runs,* on a branch cut from `main` after this landing:
    `OrganizationPage Docs Publish` is skipped there and publishes on `main`, and
    `OrganizationPage Deploy` goes to staging only there.

## Outcome of the plan's assumptions

None of the [plan's assumptions](plan.md#3-assumptions) has failed. Each can only be tested on the
live system, so each stays unconfirmed until the event named here.

| Assumption | Confirmed or refuted by |
|---|---|
| GitHub starts a newly added workflow on the push that adds it | this landing: a publish run starts, or the workflow is run by hand on `main` |
| Spaceship's host matches cPanel and LiteSpeed defaults | one file of each static type coming back unchanged at landing |
| The documents folder path resolves for the FTP login | the first publish |
| The FTP server accepts the `//`-prefixed path when removing a recorded folder | the first push that removes a folder under `docs/` |
| A request with a new query string reaches the file, not a cached copy | the first publish's confirm step |
| The repository boards are generated for this landing, and the organization work board follows in its own commit | this landing, and that board's first commit |

## Known gaps

- **The organization work board link on the landing page.** `docs/index.html` links to
  `plans/org-work-board/`, which has no target at this landing, because that board first reaches
  `main` in its own commit afterwards. The link answers 404 until then and starts working with that
  commit, with no change to the page.
- **No static shell check of the workflow's step bodies.** `actionlint` passes on both workflow
  files, but `shellcheck` is not installed where it ran, so it made no shell pass. The bodies were
  exercised directly by the gating checks instead.
