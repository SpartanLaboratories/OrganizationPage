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
