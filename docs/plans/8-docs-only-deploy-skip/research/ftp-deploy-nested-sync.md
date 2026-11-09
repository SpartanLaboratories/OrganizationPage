# How `FTP-Deploy-Action@v4.4.0` syncs a folder nested inside another synced folder

## Question

How does `SamKirkland/FTP-Deploy-Action@v4.4.0` sync a folder that sits inside another folder the
same action also syncs, and is a default state file in each target folder therefore safe for
uploading `docs/` to `/spartanlaboratories.org/OrganizationPage/docs/`, or must the docs upload
rename its state file with `state-name`?

Facts the answer has to fit:

- The docs upload goes through the existing composite action `.github/actions/spaceship-deploy`,
  which wraps `SamKirkland/FTP-Deploy-Action@v4.4.0` and does not change.
- The target `/spartanlaboratories.org/OrganizationPage/docs/` is served at
  `https://spartanlaboratories.org/OrganizationPage/docs/`. It is inside the production folder;
  neither `OrganizationPage/` nor `docs/` exists there yet (both URLs returned 404 when checked on
  2026-11-09).
- The site deployment syncs its build output into the production folder (`SPACESHIP_REMOTE_DIR`,
  `/../../spartanlaboratories.org/`) with the same action; staging is a nested folder of production,
  `/spartanlaboratories.org/staging/`, deployed with the same action.
- The docs upload never sets `clean-remote` (so `dangerous-clean-slate` is false). Production
  deploys never set it; a manual staging run may, on the staging folder only.
- Observation to explain: `https://spartanlaboratories.org/.ftp-deploy-sync-state.json` is publicly
  readable and lists five files (build-info.json, favicon.svg, index.html, web.js, web.js.map) and
  nothing for `staging/`, while `https://spartanlaboratories.org/staging/` is still served after
  later production deploys.

## Bottom line

- **A default state file in each target folder is safe; `state-name` is not needed.** The state
  file is written into the action's `server-dir` (the working directory after `ensureDir`) as
  `.ftp-deploy-sync-state.json`, so production, staging and docs each get their own file. Nothing
  about the file's name or location refers to a parent or child folder. The staging folder already
  works this way: `https://spartanlaboratories.org/staging/.ftp-deploy-sync-state.json` returned 200
  with its own five-entry list, separate from the production one.
- **The state file records what the last upload sent, not what is on the server.** It is a JSON list
  (type, relative name, size, SHA-256) of the local files scanned at upload time. Deletion is only
  "in the previous state, absent locally now". A parent sync can therefore delete a nested folder's
  files only if the parent's own earlier state listed them, i.e. only if an earlier parent upload
  contained those paths. That is why the production state has no `staging/` entry and staging
  survives production deploys. The reverse also holds: a nested sync works with names relative to
  its own folder and cannot name anything outside it (clean-slate included, which clears only the
  working directory).
- **One real way a parent deletes a nested folder: put its path in the parent's artifact.** If the
  site build ever contained `staging/` or `OrganizationPage/` (as a folder) and a later build
  dropped it, the parent state would list that folder and the sync would remove it recursively,
  nested content included. Keep the site artifact free of those top-level names.
- **First publish needs no pre-created folders.** With no state file the library treats the server
  as empty (it uploads everything and deletes nothing) and creates every missing level of
  `server-dir` with `MKD` on the way (`OrganizationPage/`, then `docs/`). A dry run is not
  read-only: it still creates those folders.
- **Failure and empty-folder behaviour is the sharp edge, not nesting.** The state file is uploaded
  last, so a failed run leaves the previous state (or none) and a re-run recomputes against that.
  An empty local folder deletes every file the previous upload recorded. The composite action's
  `index.html` check rejects a folder with no `index.html`, but a folder holding only `index.html`
  passes; a committed `docs/index.html` keeps that (minimal) protection.
- **Path spelling:** both `server-dir` spellings work as written, and the state file's location is
  set by where `server-dir` resolves on the server, not by the string.

## Findings

All code citations are at `FTP-Deploy-Action` tag `v4.4.0` (commit `110f9186c050f71550953127052e77650219c287`)
and `SamKirkland/ftp-deploy` tag `v1.2.5` (commit `7b6446d1e7d5f815973bca53814e4d4338018d5e`). The action's
`package.json` depends on `"@samkirkland/ftp-deploy": "^1.2.5"` and its `package-lock.json` pins
`1.2.5`, which `dist/index.js` bundles together with `basic-ftp` 5.0.5. The library source files were
compared against the bundle by the strings they log and the code paths named below.

### 1. Where the state file lives, when it is read and written, what it records

Evidence tier: established by source (`ftp-deploy` v1.2.5 `src/deploy.ts`, `src/syncProvider.ts`,
`src/types.ts`, `src/localFiles.ts`).

- **Name and place.** `state-name` defaults to `.ftp-deploy-sync-state.json` (`getDefaultSettings`
  in `src/utilities.ts`; the action passes `state-name` only when the input is set, and the
  composite action does not set it). It is a path relative to the server working directory, which
  `getServerFiles` sets to `server-dir` by calling `ensureDir` first. So the file sits at
  `<server-dir>/.ftp-deploy-sync-state.json`. The string `server-dir + state-name` appears only in
  log messages; the actual transfers use the bare `state-name` relative to the working directory.
- **Read.** At the start, `getServerFiles` -> `downloadFileList` downloads it to a temporary local
  file (`.ftp-deploy-sync-server-state-buffer-file---delete.json` in the process working
  directory) and parses it as JSON.
- **Written.** The library first writes the local scan to `<local-dir><state-name>` on the runner
  (`createLocalState`; this puts `.ftp-deploy-sync-state.json` into the checked-out `docs/` for the
  docs upload, in the runner workspace only). After every upload, replace and delete has finished,
  `FTPSyncProvider.syncLocalToServer` uploads that file as the final step. In a dry run neither the
  upload of the state nor any file change happens.
- **Content.** The `IFileList` type: `description`, `version` ("1.0.0"), `generatedTime` (the
  time of the local scan, in milliseconds) and `data`, a list of `{type: "file", name, size, hash}`
  and `{type: "folder", name, size: undefined}`. `hash` is SHA-256 (`getLocalFiles` calls
  `fileHash(..., "sha256")`). Names are relative to `local-dir`, use `/`, and carry no parent
  prefix. The live production state is exactly this shape. It is a public file; it exposes file
  names and hashes, which for `docs/` are already public content.

### 2. How deletion is determined; what a parent or child sync can touch

Evidence tier: established by source (`src/HashDiff.ts`, `src/syncProvider.ts`, `src/deploy.ts`).

- `HashDiff.getDiffs(localFiles, serverFiles)` walks two sorted lists in step: the local scan and the
  **state file's `data`** (it is called `serverFiles`, but it is the downloaded state, not a
  listing of the server; the library never lists the remote directory except under clean-slate).
  A name only in local goes to `upload`; a name only in the state goes to `delete`; names in both
  go to `replace` (hash differs) or `same`. A folder deleted from the state is removed with
  `client.removeDir`, which empties it recursively and then removes it. Files and folders under a
  deleted folder are dropped from the delete list as redundant (the parent's removal covers them).
- Consequently a sync deletes only paths that an earlier sync of the **same `server-dir`**
  recorded. Files that were put there by other means, including another action run on a nested
  folder, are never in the list. This is how the community uses the action for remote-only content:
  in a public question about keeping a WordPress `/blog` folder next to a deployed static site, the
  answer from an experienced user was that the old files are deleted "but only, if it was part of
  the previous deployment" (`FTP-Deploy-Action` issue 519; one user's account, consistent with the
  code).
- **Parent -> nested.** Only if the parent's state lists `staging/...` or `OrganizationPage/...`
  paths. It does not (observed), and the parent's artifact does not contain them. Nested-folder
  files are therefore invisible to the parent sync. The one route in is the pitfall above: a
  top-level *folder* named like the nested folder appearing in the artifact and later disappearing.
- **Nested -> outside.** Every operation uses names relative to the working directory (`uploadFrom`,
  `remove`, `ensureDir` of relative folders followed by `cdup`), and local names come from scanning
  `local-dir`, so none can start with `..`. The one absolute path is `removeFolder`, which builds
  `"/" + serverPath + folderPath` from the same relative name. `dangerous-clean-slate` runs
  `client.clearWorkingDir()` on the working directory only; it descends into subfolders but never
  goes above `server-dir`.
- A name that is a file locally and a folder in the state (or the reverse) is matched and then
  ignored: neither uploaded nor deleted (`HashDiff`, "paths are a match" branch handles only
  file/file). Not relevant here, but it means a type change is not detected.

### 3. First publish with no state file; creating missing parents

Evidence tier: established by source (`getServerFiles` in `src/deploy.ts`; `basic-ftp` `ensureDir`
and `_openDir` in the bundled `dist/index.js`).

- `getServerFiles` runs `ensureDir(server-dir)` and then tries to download the state. On any error it
  catches, logs "No file exists on the server ... this must be your first publish", and returns an
  empty list: everything is uploaded, nothing is deleted.
- `ensureDir(path)` goes to `/` when the path starts with `/`, then for each non-empty segment
  sends `MKD <name>` (an FTP error reply is ignored) and `CWD <name>`. This creates every missing
  level, so `/spartanlaboratories.org/OrganizationPage/docs/` is created in full on the first
  run. `/../../spartanlaboratories.org/` becomes `MKD ..` (error ignored), `CWD ..` twice, then the
  site folder; this is what production already does.
- **`ensureDir` is not guarded by `dry-run`.** A dry run creates the folders and uploads nothing.
- **Hazard (reading of the code, not reproduced).** The whole of `getServerFiles`, `ensureDir`
  included, sits in one `try`/`catch` that treats every failure as "first publish". If `MKD` of a
  new level failed and `CWD` into it then failed, the error would be swallowed, the working
  directory would stay at the last level that worked (for example the production folder), and the
  later relative uploads, state file included, would land there. The same `ensureDir` already
  created `staging/` on this account, which argues the hazard is theoretical here.
- Any other error in that block has the same effect: an unparseable state file (for example one cut
  short while uploading) is also treated as a first publish, which uploads all and deletes nothing.

### 4. Which local files are left out

Evidence tier: established by source (`excludeDefaults` in `src/module.ts`; `applyExcludeFilter` in
`src/utilities.ts`; the action's `parse.ts`/`main.ts`).

- Default `exclude` (used when the `exclude` input is empty, as in the composite action):
  `["**/.git*", "**/.git*/**", "**/node_modules/**"]`, matched with `multimatch` options
  `{ matchBase: true, dot: true }`, against the path with a trailing `/` for folders.
- So at any depth: every file or folder whose name starts with `.git` (`.gitignore`, `.gitattributes`,
  `.gitkeep`, `.github`) and everything under it, and every `node_modules` folder with its content.
- Dot-named files are otherwise uploaded (`dot: true` is for the *match*; there is no general
  dotfile filter). `.nojekyll`, `.htaccess`, `.live/` and similar would be sent. The excluded
  `.git*` entries are left out of both the upload and the state, so they are also never deleted.
- The state file is not in the exclude list. It is created in `local-dir` after the scan, and
  `syncLocalToServer` skips an upload entry named like the state, so it is never listed in itself.

### 5. State after a partial failure; what a re-run does

Evidence tier: established by source (`syncLocalToServer` order); the consequence is also reported
by users (`FTP-Deploy-Action` issue 341, open).

- The order is: create folders, upload new files, replace changed files, delete old files, delete old
  folders, then upload the state file. An error anywhere stops before the state is written. The
  server therefore keeps the **previous** state (none, on a first publish).
- A re-run diffs the new local scan against that old state: files the failed run already uploaded
  are sent again (idempotent overwrite); deletions are repeated, and a delete of something already
  gone is tolerated (`removeFile` and `removeFolder` skip FTP error 550).
- Files the failed run uploaded but that no completed run recorded are unknown to every state. If
  such a file is removed from the repository before a successful run, it stays on the server
  forever. The same holds for files uploaded by a failed first publish.
- Updates are in place and not atomic, so visitors can see a mix of old and new files during an
  upload. A user's request to save progress during long first uploads (issue 341) is still open.

### 6. Empty or nearly empty local folder; the `index.html` check

Evidence tier: established by source (`HashDiff.getDiffs`) and by the repository's composite action.

- With zero local entries (for example a folder holding only `.git*` files, all excluded), every
  entry in the old state lands in `delete`: all recorded files are removed, folders recursively,
  and the state is rewritten as an empty list. Nothing in the library refuses an empty upload.
- The composite action's "Resolve FTP settings" step exits with an error when
  `"$IN_LOCAL_DIR/index.html"` is not a file, before the FTP step runs. That guards against a missing
  or wrongly-pathed directory (empty checkout, failed artifact download, wrong `local-dir`).
  It does not guard against a *partial* folder: a folder with only `index.html` passes and deletes
  everything else the previous upload recorded.
- For this upload the content comes from a git checkout, so a committed `docs/index.html` makes the
  check meaningful in the same way as for the site (the file exists whenever the checkout
  does). It also means a checkout that omits `docs/` fails closed. The workflow's existing jobs
  check out only `.github/actions` (sparse); the docs upload needs `docs/` in its checkout.
  `docs/` currently has no `index.html` in the repository (two tracked files).

### 7. Path spelling

Evidence tier: established by source (`getDefaultSettings`, `ensureDir`, `removeFolder`), plus the
repository's own working deployments.

- `getDefaultSettings` accepts any `server-dir` that ends in `/` (and any `local-dir` that ends in
  `/`), else throws "server-dir should be a folder (must end with /)". The composite action appends
  the slash itself.
- `ensureDir` treats a leading `/` as "go to the FTP root first"; otherwise paths are relative to the
  login folder. `..` segments are plain `MKD ..`/`CWD ..` commands. Both
  `/spartanlaboratories.org/OrganizationPage/docs/` and `/../../spartanlaboratories.org/` work as
  they are: the second is what production already uses, and the first form is what staging's default
  uses (`/spartanlaboratories.org/staging`, served at `/staging/`).
- The state file location follows the resolved folder, so two spellings of one folder share one state
  file. Nothing is keyed on the string.
- The only place the string is used raw is folder removal: `removeFolder` sends
  `"/" + serverPath + folderPath` to `removeDir`, which gives a leading `//` for an absolute
  `server-dir` (and `//../../spartanlaboratories.org/...` for production). The library's own test
  expects `/server-dir/path/folder/` for a relative `server-dir`. Whether Spaceship's FTP server
  accepts the `//` form has not been checked (see Gaps); it matters only when a folder is deleted.

## How comparable projects do it

- **Several sites or subfolders with this action.** The documented pattern is one `server-dir` per
  site with the default state file in each (README of `FTP-Deploy-Action` at `v4.4.0`: `server-dir`
  "Folder to upload to (on the server)"; `state-name` example `folder/.sync-state.json`,
  "Path and name of the state file"). `state-name` exists to move or rename the file, not to
  separate folders; the README does not suggest it for nested targets.
- **Remote-only folders next to a synced one** (issue 519, a SvelteKit site beside a WordPress
  `/blog`): users rely on the state-based delete leaving unlisted folders alone, and on `exclude`
  for local paths they want left out of the sync. Both are consistent with the source above.
- **`state-name` with a subfolder** (`FTP-Deploy-Action` issue 468, open): a `state-name` that points
  into a folder that does not yet exist fails, because the library writes the state to
  `<local-dir><state-name>` locally and uploads it relative to the working directory without
  creating the folder. Another reason to keep the default.
- This repository's own staging/production pair is the working example: two default state files
  (`/.ftp-deploy-sync-state.json` and `/staging/.ftp-deploy-sync-state.json`), each listing the same
  five names, confirmed live on 2026-11-09, with production deploys leaving `staging/` intact.

## Pitfalls & regrets

- **Artifact paths that equal or contain a nested folder** (`staging`, `OrganizationPage`) turn a
  later removal into a recursive delete of the nested folder. Keep nested folder names out of the
  site artifact and out of any `exclude`-less local tree.
- **A swallowed `ensureDir` failure** (section 3) would redirect uploads one level up. Low
  probability here; fail-open by design of the library.
- **Empty or partial local folder** deletes what the state lists; the `index.html` check only
  catches the fully-missing case.
- **Orphans after failed runs** (section 5) and after any run whose state is unreadable: the library
  uploads all and deletes nothing, so stale files stay until removed by hand.
- **Dry run creates folders** (section 3), so it is not a pure preview.
- **Concurrency.** Two overlapping runs on the same folder both read the old state and both write a
  new one; the last write wins. The existing workflow serialises each target with a `concurrency`
  group; a docs upload needs its own group (it shares no state file with production or staging, so
  it does not need to wait for them).
- **Tag vs branch.** The action repository has both a branch and a tag named `v4.4.0`
  (branch head `3a9c65a...`, tag `110f918...`, the squash merge of PR 526). Their trees are
  identical (`git diff` between them is empty), so `uses: ...@v4.4.0` behaves the same either way.
- The state file is publicly readable on any host that serves dot-files (it is at the production
  root today). For `docs/` it adds nothing that is not already published.

## Recommendation for this repo

Use the default state file for the docs upload: no `state-name`, `clean-remote` left at `"false"`,
`remote-dir` `/spartanlaboratories.org/OrganizationPage/docs/`, `local-dir` `docs/`. Three folders
(production, staging, docs) then keep three independent state files, each listing only what its own
upload sent, so a sync can never delete a path another folder's sync wrote. A renamed state file
would add nothing: the isolation comes from the file living in each folder, not from its name, and
`state-name` with a subfolder path has a known failure mode.

Conditions that make this safe, to state in the workflow and the deployment document:

1. The site artifact never contains a top-level `OrganizationPage` or `staging` entry.
2. Neither production nor docs publishes use clean-slate (production already never does).
3. The docs workflow checks out `docs/` (not only `.github/actions`), keeps a committed
   `docs/index.html`, and runs under its own `concurrency` group.
4. Treat the first run as the creation of `OrganizationPage/docs/`: it needs no pre-created
   folders, and a dry run beforehand creates them without uploading. Check that the log shows the
   "first publish" message followed by file uploads, not an error.

The obvious alternative, a renamed state file such as `.ftp-deploy-sync-state-docs.json` in the
production folder, is rejected: it would make the production folder's sync responsible for a second
state file and does nothing to stop a parent delete.

## Load-bearing claims

1. **The default state file name and its location in `server-dir`.**
   Quote: `/** @default ".ftp-deploy-sync-state.json" */` and
   `await retryRequest(this.logger, async () => await this.client.uploadFrom(this.localPath + this.stateName, this.stateName));`
   Links: [types.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/types.ts),
   [syncProvider.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/syncProvider.ts)
   (`FTPSyncProvider.syncLocalToServer`). Version: `@samkirkland/ftp-deploy` 1.2.5.

2. **The action v4.4.0 bundles `@samkirkland/ftp-deploy` 1.2.5.**
   Quote: `"node_modules/@samkirkland/ftp-deploy": {` / `"version": "1.2.5",`
   Link: [package-lock.json](https://github.com/SamKirkland/FTP-Deploy-Action/blob/v4.4.0/package-lock.json).
   Version: `FTP-Deploy-Action` v4.4.0. (The `main` of the action is `dist/index.js`, which contains the
   same library code.)

3. **The state is written last, after all file changes.**
   Quote: `// delete old folders` ... `this.logger.all(\`🎉 Sync complete. Saving current server state to "${this.serverPath + this.stateName}"\`);`
   Link: [syncProvider.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/syncProvider.ts)
   (`syncLocalToServer`). Version: 1.2.5.

4. **The state records the local scan, with SHA-256 and relative names.**
   Quote: `hash: await fileHash(args["local-dir"] + stat.path, "sha256")` and
   `const files = await readdir.async(args["local-dir"], { deep: true, stats: true, sep: "/", filter: (stat) => applyExcludeFilter(stat, args.exclude) });`
   Link: [localFiles.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/localFiles.ts)
   (`getLocalFiles`). Version: 1.2.5.

5. **Deletion is "in the state, not local".**
   Quote: `else if (fileNameCompare > 0) {` followed by `deleteList.push(serverFile);`
   Link: [HashDiff.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/HashDiff.ts)
   (`HashDiff.getDiffs`). Version: 1.2.5. The `serverFiles` argument is the downloaded state:
   `const serverFiles = await downloadFileList(client, logger, args["state-name"]);` in
   [deploy.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/deploy.ts) (`getServerFiles`).

6. **Folder deletion is recursive.**
   Quote: `* Remove a directory and all of its content.`
   Link: `Client.removeDir` in `basic-ftp` 5.0.5 as bundled in
   [dist/index.js](https://github.com/SamKirkland/FTP-Deploy-Action/blob/v4.4.0/dist/index.js)
   (upstream: `basic-ftp` `src/Client.ts`). Version: bundled with action v4.4.0.

7. **Clean-slate clears only the working directory.**
   Quote: `* Remove all files and directories in the working directory without removing` /
   `* the working directory itself.`
   Link: `Client.clearWorkingDir` in the same
   [dist/index.js](https://github.com/SamKirkland/FTP-Deploy-Action/blob/v4.4.0/dist/index.js).
   Version: bundled with action v4.4.0. The call is `await client.clearWorkingDir();` in `getServerFiles`
   ([deploy.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/deploy.ts)), after
   `await ensureDir(client, logger, timings, args["server-dir"]);`.

8. **First publish: no state means an empty server list; missing parent folders are created.**
   Quote: `logger.all(\`No file exists on the server "${args["server-dir"] + args["state-name"]}" - this must be your first publish! 🎉\`);` followed by `data: [],`;
   and, for `ensureDir`: `* Make sure a given remote path exists, creating all directories as necessary.` /
   `await this.sendIgnoringError("MKD " + dirName);`
   Links: [deploy.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/deploy.ts),
   `Client.ensureDir` and `Client._openDir` in
   [dist/index.js](https://github.com/SamKirkland/FTP-Deploy-Action/blob/v4.4.0/dist/index.js).
   Version: 1.2.5 / `basic-ftp` 5.0.5.

9. **`ensureDir` runs before the dry-run guard.**
   Quote: `await ensureDir(client, logger, timings, args["server-dir"]);` (first statement of the
   `try` in `getServerFiles`); the dry-run checks are `if (this.dryRun === false)` /
   `if (args["dry-run"] === false)` and appear only around remove, upload and clear calls.
   Link: [deploy.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/deploy.ts).
   Version: 1.2.5.

10. **Default excludes and match options.**
    Quote: `export const excludeDefaults = ["**/.git*", "**/.git*/**", "**/node_modules/**"];` and
    `multimatch(pathWithFolderSlash, excludeFilters, { matchBase: true, dot: true });`
    Links: [module.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/module.ts),
    [utilities.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/utilities.ts).
    Version: 1.2.5. The action passes `undefined` when the `exclude` input is empty
    (`optionalStringArray`: `if (rawValue.length === 0) { return undefined; }`,
    [parse.ts](https://github.com/SamKirkland/FTP-Deploy-Action/blob/v4.4.0/src/parse.ts)).

11. **`server-dir` must end in `/`.**
    Quote: `throw new Error("server-dir should be a folder (must end with /)");`
    Link: [utilities.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/utilities.ts)
    (`getDefaultSettings`). Version: 1.2.5.

12. **Folder removal builds an absolute path from the raw `server-dir`.**
    Quote: `const absoluteFolderPath = "/" + (this.serverPath.startsWith("./") ? this.serverPath.replace("./", "") : this.serverPath) + folderPath;`
    Link: [syncProvider.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/syncProvider.ts)
    (`FTPSyncProvider.removeFolder`). Version: 1.2.5.

13. **A missing file on delete is skipped, so re-runs after a partial delete are tolerated.**
    Quote: `this.logger.standard("File not found or you don't have access to the file - skipping...");`
    Link: [syncProvider.ts](https://github.com/SamKirkland/ftp-deploy/blob/v1.2.5/src/syncProvider.ts)
    (`FTPSyncProvider.removeFile`). Version: 1.2.5.

14. **Users observe that the state is not updated during a long or failed upload.**
    Quote: "FTP-Deploy-Action doesn't update `.ftp-deploy-sync-state.json` even after uploading thousands of files, after throwing `Error: The operation was canceled`"
    Link: [issue 341](https://github.com/SamKirkland/FTP-Deploy-Action/issues/341) (open). Date: read
    2026-11-09. Corroborates claim 3; the code is the primary evidence.

15. **Users rely on state-based deletion leaving unlisted remote folders alone.**
    Quote: "The action generated a state file that contains the previously uploaded files and it will compare it against newly uploaded files. Everything that has been changed will be uploaded and the old files will be deleted (but only, if it was part of the previous deployment)."
    Link: [issue 519](https://github.com/SamKirkland/FTP-Deploy-Action/issues/519) (open), a comment by
    one user. Date: read 2026-11-09. One user's account, consistent with claims 5 and 8.

16. **Live state files are separate per folder (observation, not a library claim).**
    Quote: production file begins `"description": "DO NOT DELETE THIS FILE. This file is used to keep track of which files have been synced in the most recent deployment.` and lists `build-info.json`, `favicon.svg`, `index.html`, `web.js`, `web.js.map`; the same names appear in `https://spartanlaboratories.org/staging/.ftp-deploy-sync-state.json` (HTTP 200).
    Links: <https://spartanlaboratories.org/.ftp-deploy-sync-state.json>,
    <https://spartanlaboratories.org/staging/.ftp-deploy-sync-state.json>. Date: 2026-11-09 (the
    state changes with each deploy).

## Gaps

- **Folder-entry names.** The library's unit tests use folder names with a trailing slash
  (`"path/folder/"`), and the optimisation that drops redundant deletes compares names with
  `startsWith`. If real folder records had no trailing slash, two sibling folders sharing a prefix
  (for example `doc` and `docs`) could cause a nested delete to be skipped. The live state has
  only files, so this could not be confirmed against real output. It would leave orphans, not delete
  extra files.
- **`//` in folder removal on Spaceship.** Whether the FTP server accepts `//spartanlaboratories.org/...`
  and `//../../spartanlaboratories.org/...` as absolute paths in `CWD` was not tested (no FTP
  connection was made). It matters only when a recorded folder disappears from an upload; no
  folder removal has been observed on production.
- **Jail semantics of `..`.** That `/../../spartanlaboratories.org/` and `/spartanlaboratories.org/`
  are the same folder is taken from the repository's deployment document and from staging being
  served from the nested path; the FTP server's chroot behaviour was not examined.
- **The swallowed-`ensureDir` hazard** (section 3) comes from reading the code. It was not
  reproduced and no published issue describing it was found.
- **Server directory listing and 404 behaviour.** Not established what URL status the empty
  `OrganizationPage/docs/` folder returns after the first (dry or real) run.
- **Library newer than 1.2.5.** Only the version the v4.4.0 lockfile pins was read; a newer
  `@samkirkland/ftp-deploy` (the action's range is `^1.2.5`) is irrelevant until the action's own
  tag is moved, which this repository does not do.
