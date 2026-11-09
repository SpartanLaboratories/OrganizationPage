# Research: publishing `docs/` to the live site

Everything under `docs/` is published to the live site on a push to `main`, with no staging
and no approval, at `https://spartanlaboratories.org/OrganizationPage/docs/`. Every other
change keeps the staging and approval path of `OrganizationPage Deploy`. The questions below
are the points that design depends on and that this repository cannot answer by itself. Each
answer lives in the findings file named under its question.

## Questions

### 1. How do GitHub Actions path filters decide which workflows a push to `main` starts?

Two workflows split the work by path: the site deployment ignores `docs/**`, and a separate
publish workflow runs on `docs/**`. The alternative is one workflow that inspects the changed
files inside a job and routes from there.

An answer has to establish:

- that a push changing only `docs/` starts the publish workflow and not the site deployment,
  a push changing nothing under `docs/` starts the site deployment and not the publish
  workflow, and a push changing both starts both, independently;
- how the changed files are worked out for a pull request landing as a merge commit on `main`,
  whose diff includes everything the branch changed;
- whether the push that adds a workflow file starts that workflow, since the commit that
  introduces the publish workflow also changes `docs/`;
- whether `docs/**` matches every depth under `docs/`, including dot-named files and folders;
- what a filtered push leaves behind: a skipped run, a pending check, or nothing at all, on a
  branch with no required checks;
- what happens at the documented limits (commit count, changed-file count, a diff that times
  out), and which way each one fails for `paths` and for `paths-ignore`;
- what `concurrency` with `cancel-in-progress: false` does when publishes arrive faster than
  they finish, given that each publish uploads the whole folder at its own commit.

GitHub's workflow syntax, events and concurrency documentation settles most of this; the
behaviour of a newly added workflow may need GitHub's own statements or reports from practice.

Findings: [`github-path-filters.md`](github-path-filters.md)

### 2. How does `SamKirkland/FTP-Deploy-Action@v4.4.0` sync a folder nested inside another folder it also syncs?

The publish target, `/spartanlaboratories.org/OrganizationPage/docs/`, sits inside the
production folder, which the site deployment syncs with the same action from a different
local folder. The staging folder already sits inside the production folder the same way. The
options are a default state file in each target folder, or a state file renamed through
`state-name`.

An answer has to establish:

- where the sync state file lives on the server and what it records;
- how the action decides what to delete, and whether a sync of the parent folder can ever
  delete files under a nested folder it did not upload, or the reverse;
- what happens on a first publish with no state file on the server, including creating a
  remote path whose parent folders do not exist yet;
- which local files the default `exclude` patterns leave out of a `docs/` upload;
- what state is left after an upload fails partway, and what a re-run then does;
- what happens if the local folder is empty or nearly empty, since a state-based sync deletes
  what is no longer present.

The action's source at the `v4.4.0` tag and the `@samkirkland/ftp-deploy` library it bundles
settle this.

Findings: [`ftp-deploy-nested-sync.md`](ftp-deploy-nested-sync.md)

### 3. Which uploaded files can run code or change server behaviour on a LiteSpeed cPanel shared host?

The publish job has no approval step, and the host is Spaceship shared hosting (cPanel) served
by LiteSpeed. The job must refuse to run when `docs/` holds a file the host would execute or
interpret on the server. The options are a list of refused names and extensions, or a list of
allowed extensions.

An answer has to establish:

- which file names and extensions such a host executes or honours by default: PHP handler
  extensions, `.htaccess`, `.user.ini`, server-side includes, CGI scripts;
- whether matching is case-sensitive on the host, and whether a double extension such as
  `name.php.txt` is treated as executable;
- which of a refusal list or an allow list better fits a folder that holds HTML, JavaScript,
  JSON, Markdown, images and diagram sources today and will gain more static file types.

LiteSpeed, cPanel and PHP documentation, and Spaceship's own hosting documentation where it
exists, settle this.

Findings: [`host-executable-files.md`](host-executable-files.md)

## Verification results

Every load-bearing claim in the three findings files was re-opened at its own source, at the
version the claim cites: 17 in `github-path-filters.md`, 16 in `ftp-deploy-nested-sync.md` and
17 in `host-executable-files.md`. All 50 hold, none fails and none is unclear. Claims about this
repository were checked against the repository, its run history and the live site instead.

Points of precision that bear on how the claims are used:

- **The `queue` concurrency option is live on github.com.** `github-path-filters.md` describes
  it as behind a feature flag; that flag is enabled for github.com. The design does not use the
  option.
- **A clean-slate upload on a parent folder also wipes a nested folder**, because the working
  directory is cleared recursively. Only the manual staging option can clean, and only on the
  staging folder.
- **A custom `exclude` replaces the defaults** rather than adding to them. The design sets none.
- **`Mergify, "Path filters are not a CI gate"`** is one vendor's description of what a filtered
  push leaves behind; it agrees with GitHub's wording about checks.
- **The quote about state after a failed upload** comes from a comment on issue 341, not the
  issue body. The source code is the primary evidence.
- **cPanel's global CGI and server-parsed mappings** carry a narrower stated purpose in their
  configuration comments, and are removed per account when CGI is off. The names stay refused
  because whether this account has CGI is not visible from outside.

### Did not hold in the build

- **`*.perl*` and `perlmutter.md`.** The pitfalls in
  [`host-executable-files.md`](host-executable-files.md) say that `*.perl*` refuses `perlmutter.md`.
  It does not: the pattern needs a literal `.perl` in the name, and the built refusal step passes
  `perlmutter.md`. The recommendation and the refusal list are unaffected.

## Summary of findings

### Starting the right workflow for each push

Two workflows with complementary native filters split every non-empty push exactly: the publish
workflow on `push` to `main` with `paths: docs/**`, and `OrganizationPage Deploy` with
`paths-ignore: docs/**` beside its `branches` filter. A push changing only `docs/` starts the
publish workflow, a push with nothing under `docs/` starts the site deployment, and a push
changing both starts both. GitHub evaluates a landing's merge commit with a two-dot diff of the
old and new tip of `main`, so it is judged on everything the branch brought in
([`github-path-filters.md`](github-path-filters.md), F1, F2).

Routing inside one workflow does not fit: it needs a runner and a checkout on every push to
decide anything, and it would put a publish that nobody approves into the run that holds the
site's required reviewer. Dokka uses the same shape, a dedicated workflow with a `paths` include;
OkHttp routes with job-level `if:` because its workflows also validate documentation on pull
requests.

A filtered push leaves no run and no check on a branch with no required checks, so the absence of
a run is normal and has to be explained in the deployment reference. The documented limits (1,000
commits, 3,000 files, a diff that times out) are far above this repository's pushes.

Two points are not settled by GitHub's text. No sentence says that a workflow added by a push has
its `paths` filter evaluated on that same push; the documented mechanics and this repository's own
history for an unfiltered workflow point that way, so the design does not depend on it and gives
the publish workflow a `workflow_dispatch` trigger, limited to `main` by a job condition. Whether
`docs/**` expands into dot-named children is unstated; `docs/` tracks no such file.

Publish runs share a `concurrency` group of their own with `cancel-in-progress: false`: one runs,
the newest waits, and an older waiting run is cancelled, which loses nothing because each run
uploads the whole folder. GitHub does not guarantee queue order, so a stale publish is possible
in a narrow window; the next push under `docs/` or a manual run repairs it. The group name must
differ from `deploy-staging` and `deploy-production`, since group names are shared across
workflows.

### Uploading into a folder inside the production folder

A default state file in each target folder is safe, and `state-name` adds nothing
([`ftp-deploy-nested-sync.md`](ftp-deploy-nested-sync.md)). The action records what its last upload
sent and deletes only paths in that record that are gone locally; it never lists the remote folder.
Production, staging and the documents folder therefore keep separate records, and none can delete
what another uploaded. The live production and staging state files show exactly this. The one way
in is a site build that contains a top-level `OrganizationPage` or `staging` entry and later drops
it, which would make production's sync remove that folder recursively.

The first publish needs no folder created in advance: with no state file the action uploads
everything, deletes nothing, and creates each missing level of the target. The state file is
written last, so a failed run leaves the previous record and a re-run recomputes against it; files
from a failed run that are removed from the repository before a successful run stay on the server.

The composite action's check for an `index.html` in the local folder applies wherever the upload
is served from, because it looks at `local-dir`, which is `docs/`. A committed `docs/index.html`
satisfies it and keeps its purpose: a checkout without `docs/` fails before anything is deleted. A
file generated during the job would pass even for a wrong checkout, so it would not. The same file
gives `/OrganizationPage/docs/` a landing page.

The action treats any failure while entering the target folder as a first publish, so a failed
change of directory would send the upload to the last folder it reached. The same call already
created `staging/` on this account, so this is unlikely, but it would put the documents' landing
page over the site's. A final request for the published landing page makes a first publish that
went astray fail visibly.

### Refusing files the host would run

A refusal list fits better than an allow list
([`host-executable-files.md`](host-executable-files.md)). OWASP prefers allow lists, but for files
chosen by untrusted uploaders; the files here are committed to the repository, and the set of
names this stack maps to a handler is small and closed. An allow list would also need the same
inner-segment patterns to catch `report.php.md`, and it would fail the publish on `main` each time
a new static type appeared.

Apache-style `AddHandler` compares every dot-separated segment, while OpenLiteSpeed looks only at
the last one, and LiteSpeed Enterprise is closed source. The list assumes the worse of the two: it
matches case-insensitively and catches inner segments. `.htaccess` matters most, because cPanel
allows overrides and one such file can map any extension to a handler. The job fails and names
each file rather than dropping it, which is why the action's `exclude` input does not fit.

Two limits remain. No page of Spaceship's own documentation could be read, so its configuration is
inferred from cPanel and LiteSpeed defaults and the live `server: LiteSpeed` header; the list only
refuses more, so it is safe either way. A name check also cannot see a handler mapped onto an inert
extension at account level, which a one-time check of a served `.html` and `.md` file closes.
