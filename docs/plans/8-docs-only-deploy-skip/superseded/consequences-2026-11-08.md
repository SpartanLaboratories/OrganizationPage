> Superseded by [`consequences.md`](../consequences.md).

# Consequences: publishing `docs/` to the live site

What this change does to its surroundings and what it leaves behind. The design is in
[`plan.md`](../plan.md) and the evidence behind it in [`research/README.md`](../research/README.md).

## Published artifacts

No library artifact or version changes, so nothing is bumped or released.

The live site gains one public folder, `https://spartanlaboratories.org/OrganizationPage/docs/`,
stored at `/spartanlaboratories.org/OrganizationPage/docs` inside the production folder. It mirrors
the repository's `docs/` folder path for path, so the organization work board is at
`/OrganizationPage/docs/plans/org-work-board/`. `/docs/` at the site root stays free. The folder
holds its own `.ftp-deploy-sync-state.json`, which lists file names, sizes and hashes and is
publicly readable, as the production folder's already is.

## Blast radius

**Workflows.** `OrganizationPage Deploy` no longer starts for a push that changes only `docs/`, and
the new `OrganizationPage Docs Publish` starts for any push to `main` that changes `docs/`. A push
that changes both starts both. A workflow that a push does not match leaves no entry at all in the
Actions list, so a missing run is normal. Most landings in this repository are mixed pushes, because
plan documents are committed with the code they describe: their documents go live at the merge, and
a board can describe a change before production has it.

**The deployment rules.** Rules 1 and 2 in `CLAUDE.md` and `docs/DEPLOYMENT.md` now apply outside
`docs/`, and a new rule 10 states the exemption from rules 1, 2, 3, 5 and 9.
`docs/DEPLOYMENT.md` also states that a pull request changing only generated boards may be approved
and merged by the automated version control process without the owner's review. Taken together,
such a pull request goes live with no person looking at it.

**What becomes public.** Everything under `docs/`, now and later, is served from the organization's
domain as soon as it lands, and search engines may index it: plans, research, boards and
`DEPLOYMENT.md`. The repository is already public, so nothing new is disclosed, but nothing
sensitive can be committed under `docs/`.

**The live host.** The production and staging folders are untouched, and each keeps its own sync
record, so no sync removes what another uploaded. The site's build output must never contain a
top-level `OrganizationPage` or `staging` entry: a later build without it would make production's
sync remove that whole folder.

**What may no longer be added under `docs/`.** A file the host would execute or interpret
(`.php`, `.htaccess`, `.cgi` and the rest of the refusal list in `publish-docs.yml`) now fails the
publish on `main`. The boards and documents generated under `docs/` have to keep clear of those
names.

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

- **SpartanLaboratories/OrganizationPage#7** (the organization's Dokka and project site standard).
  Its API reference at `/docs/api/` is unaffected, because `/docs/` at the site root stays free. The
  assets it adds under `docs/brand/` and `docs/dokka/` will be served under
  `/OrganizationPage/docs/` as soon as they land.
- **SpartanLaboratories/OrganizationPage#9** (the staging target check compares folder strings).
  The documents check compares resolved paths and leaves the staging check as it is. Neither issue
  blocks the other.

## Follow-ups

- **A dedicated FTP account confined to `/OrganizationPage/docs/`.** The publish reuses the
  account that can write the whole site, so its two checks are the only fence, and they live in a
  workflow file on `main`. A confined account would keep the job inside its folder even by mistake.
  It needs the account created on the host, its own secrets, and the target check changed to suit a
  login whose root is that folder.
- **Pointing the organization work board's links at the served URLs.** They stay GitHub URLs until
  the board's template changes, which is outside this repository.
- **Sharing the production and staging folder defaults** between the two workflow files, if a third
  workflow needs them. Today both files repeat them.
