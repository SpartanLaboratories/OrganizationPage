# How to write the `push` filter of `OrganizationPage Deploy` so that `docs/brand/` and `docs/dokka/` deploy and the rest of `docs/` does not

## 1. Question

How should the `on.push` trigger of `.github/workflows/deploy-spaceship.yml` (today `branches: [main]` plus `paths-ignore: 'docs/**'`) be written so that a push changing a file under `docs/brand/` or `docs/dokka/` starts the deployment, a push changing only other files under `docs/` starts nothing, and every change outside `docs/` (dot-named paths such as `.github/workflows/deploy-spaceship.yml`, `.gitignore` and `.dockerignore` included) still starts it?

Requirements the answer meets, stated as facts about the work:

- The site build reads `docs/brand/spartan-laboratories-logo.png` and the Dokka stylesheet under `docs/dokka/styles/`. These are the only parts of `docs/` the site build reads. The Dokka API reference ships inside the `site` artifact and goes through staging and approval.
- `publish-docs.yml` stays unchanged, with `paths: docs/**`. A push that changes both a site-feeding `docs/` folder and other files starts both workflows.
- `workflow_dispatch` on the deployment is unchanged. Staging, approval, the same-artifact rule and fail-closed behaviour are untouched; only the set of pushes that start the workflow changes.
- No tracked path under `docs/` is dot-named today (`git ls-files docs` shows only `DEPLOYMENT.md`, `index.html`, `dashboards/` and `plans/`); `docs/brand/` and `docs/dokka/` are not yet tracked on this branch. The tracked dot-named paths outside `docs/` are `.dockerignore`, `.gitignore` and the four files under `.github/`.

This file builds on `docs/plans/8-docs-only-deploy-skip/research/github-path-filters.md` (path-filter semantics, the two-dot diff, limits, silent absence of runs) and does not repeat it.

## 2. Bottom line

- **Use `paths` with ordered patterns (option 1).** On `on.push`, keep `branches: [main]` and replace `paths-ignore` with `paths: ['**', '!docs/**', 'docs/brand/**', 'docs/dokka/**']`. GitHub documents that patterns are checked in order, that a negative pattern after a positive match excludes the path, and that a positive pattern after a negative match includes it again (established consensus: GitHub documentation, section 3, F1).
- **Dot-named paths are matched by `'**'`.** GitHub's documentation is silent on dots per path pattern, but two public repositories show it in their run history. In `pantavisor/pantavisor`, a single-commit push that changed only `.github/workflows/onpush-pvtest.yaml` started a workflow filtered by `paths: ['**', '!docs/**']`. In `lxml/lxml`, a push that changed only `.gitignore` started a workflow filtered by `'**'` followed by `'!.github/**'` and other patterns. A second pantavisor push, which only deleted `.gitlab-ci.yml` and a workflow file, also ran under `['**', '.github/configs/**']` (F3). Rated: strong observed behaviour in two repositories, not a specification. `.dockerignore` is not individually observed; it has the same shape as `.gitignore`.
- **Option 1 fails toward a missed run; option 2 fails toward an extra run.** A new folder under `docs/` deploys under option 2 (a run that stops at the production reviewer) and does not under option 1 (a published reference that is stale until the next deployment). Option 1 is preferred because `docs/` is committed to on nearly every change by generated boards and plans, so a deny-list there has to name every generated folder or each landing starts a reviewer-gated run, while a new site input under `docs/` also needs a build change outside `docs/`, and that change deploys by itself (F5).
- **`paths-ignore` with negative patterns is not documented and is not used.** GitHub's text pairs `!` with `paths` only ("If you only want to exclude paths, use `paths-ignore` instead"). One public repository writes `!` entries inside `paths-ignore`, but its effect could not be verified (F2).
- **Option 3 (leave `paths-ignore: docs/**` and start a deployment some other way) is rejected.** Every alternative trigger either starts a second deployment run for a push that also changes code, or needs a token that can start workflows, or moves the filter into a job that leaves runs in the Actions list (F6).
- **`workflow_dispatch` is unaffected by option 1, and both workflows start on a mixed push.** GitHub defines path filters under the push and pull-request events and nowhere else. A push that changes `docs/brand/` and `docs/plans/` starts both `OrganizationPage Deploy` (through `docs/brand/**`) and `OrganizationPage Docs Publish` (through `docs/**`).

## 3. Findings

### F1. `paths` takes ordered include and exclude patterns, and the last matching pattern decides

Tier: established consensus (GitHub documentation), plus one independent test write-up. Applies to github.com docs as of 2026-11-09 (docs source `github/docs`: `workflow-syntax.md` at `c67a9362ec63`, 2026-10-01; reusables `triggering-a-workflow-paths1` at `8c0c8abc960d`, 2026-07-09, and `triggering-a-workflow-paths4` at `4e34c693418f`, 2024-07-18). Rendered at [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax).

- Include and exclude in one filter: "If you want to both include and exclude path patterns for a single event, use the `paths` filter prefixed with the `!` character to indicate which paths should be excluded."
- Order: "A matching negative pattern (prefixed with `!`) after a positive match will exclude the path. A matching positive pattern after a negative match will include the path again."
- A negative-only list is not allowed: "If you define a path with the `!` character, you must also define at least one path without the `!` character."
- Cheat sheet row for sequential checking: "Patterns are checked sequentially. A pattern that negates a previous pattern will re-include file paths."
- A path that matches both a positive and a negative pattern is therefore decided by whichever of the two comes later in the list. For the proposed list, `docs/brand/logo.png` matches `**` (include), `!docs/**` (exclude) and `docs/brand/**` (include again): included. `docs/plans/x.md` matches `**` and `!docs/**` only: excluded. `.github/workflows/deploy-spaceship.yml` matches `**` only: included.
- A workflow runs when at least one changed path ends up included ("If at least one path matches a pattern in the `paths` filter, the workflow runs"; GitHub's own example: "a push changing only `sub-project/docs/readme.md` will not" run). A push that changes only excluded paths starts nothing.
- Test write-up (one source, `pull_request` trigger): [Zenn, "GitHub Actionsにおけるpaths(including/excluding)設定の試験結果", 2024-07-21/26](https://zenn.dev/coot/articles/5a9e530aa1f4e6) found that "the last matching entry takes effect", that reordering overlapping entries changes behaviour, that a negative entry applies to all earlier entries and not just the one above it, and that a negative-only list is ignored rather than a syntax error. It does not test dot-named paths.
- YAML: a pattern that starts with `*`, `[` or `!` must be quoted. `'**'` and `'!docs/**'` need quotes; `docs/brand/**` does not, and is quoted here to match the existing file.

### F2. `paths-ignore` and negative patterns

Tier: not documented; one in-the-wild use, effect unverified.

- GitHub's text states "You cannot use `paths` and `paths-ignore` to filter the same event in a single workflow" and routes include-plus-exclude needs to `paths` with `!`. The `paths-ignore` page shows positive patterns only (`'docs/**'`) and states: "When all the path names match patterns in `paths-ignore`, the workflow will not run." Nothing says `!` is accepted, rejected or meaningful in `paths-ignore`. The cheat sheet's definition of `!` ("At the start of a pattern makes it negate previous positive patterns") presumes positive patterns exist, which a `paths-ignore` list does not distinguish.
- `telegramdesktop/tdesktop` writes `'.github/**'` followed by `'!.github/workflows/mac.yml'` inside `paths-ignore` in `.github/workflows/mac.yml`. The effect could not be verified: workflow runs for the relevant commits are past the retention window (every checked commit from 2025 returns zero runs).
- Consequence: no design here depends on `!` inside `paths-ignore`. The hybrid "`paths-ignore: ['docs/**', '!docs/brand/**', '!docs/dokka/**']`" would be the shortest possible filter, and it is rejected for being unspecified behaviour in a filter that decides whether production deployments start.
- `actionlint` ([rhysd/actionlint](https://github.com/rhysd/actionlint) at `011a6d15e749`, 2026-04-19) validates glob syntax and the exclusivity of `paths` and `paths-ignore` (`checkExclusiveFilters` in `rule_events.go`; `ValidatePathGlob` in `glob.go`); it does not evaluate matches and so says nothing about dots or negation in `paths-ignore`.

### F3. `'**'` and dot-named paths

Tier: observed behaviour in two public repositories (strong for the cases observed), backed by a documentation sentence and the pattern model; the pattern model's consequence for nested dot-named folders is inference.

GitHub's text:

- "`**`: Matches zero or more of any character." In the paths table: "The `**` wildcard matches any character including slash (`/`). This is the default behavior when you don't use a `path` filter." A workflow with no `paths` filter runs for every push, including one that changes only dot-named files, so `'**'` is documented as equivalent to that.
- The cheat sheet defines `?` and `+` as "the preceding character" quantifiers, which is how a glob translated into a regular expression behaves (`*` becomes "anything but `/`", `**` becomes "anything"). No sentence treats names starting with a dot specially. This is consistent with `**` matching them, and is an inference, not a statement.

Observed behaviour. Each case was checked as a single-commit push (the push's `before` SHA, taken from the repository events feed, is the pushed commit's parent, or the parent had its own earlier run), so only the listed files could have decided the filter.

1. `pantavisor/pantavisor`, workflow `On push: Raspberry Pi ARMv8`, `.github/workflows/on-push.yaml`. At the pushed commit the filter was `branches: [master]`, `paths: ["**", "!docs/**"]` (`on-push.yaml` last changed at `c8f0bae7283729c0207ed6fd45ef07f2796ae72d`, 2026-10-05). Push `5701866b038e7d375e2db89ce9ff0d838355c228` (2026-11-06, `before` = `24aedc94bda0bd71047639bd7428ccd964889b14`) changed only `.github/workflows/onpush-pvtest.yaml`. The workflow ran: [run 42209301674](https://github.com/pantavisor/pantavisor/actions/runs/42209301674). This is a dot-named folder at the repository root, matched by `'**'` after `'!docs/**'`, in a filter shaped like the one proposed here.
2. `pantavisor/pantavisor`, same workflow when it was `.github/workflows/on-push-raspberrypi-armv8.yaml` with `paths: ['**', '.github/configs/**']`. Commit `f6093f9667825d5a7b02518dac6df774034de9d9` (2025-11-03) removed `.github/workflows/github-actions-gitlabci.yml` and `.gitlab-ci.yml`; its parent `fb04ecac` had its own run on 2025-10-29, so it was a one-commit push. The workflow ran: [run 19028196022](https://github.com/pantavisor/pantavisor/actions/runs/19028196022). Neither removed path matches `.github/configs/**`, so `'**'` matched a root-level dot-named file (`.gitlab-ci.yml`) and a dot-folder file. A deleted path counts as a changed path.
3. `lxml/lxml`, workflow `CI`, `.github/workflows/ci.yml` (last changed at `6cd012a3bd81e571bb7fcf0393596b60f3ad69cb`, 2026-11-07), `on.push.paths`: `'**'`, `'!.github/**'`, `'!benchmark/**'`, then `'.github/workflows/ci.yml'`, `'.github/workflows/cache_libs.yml'`, `'.github/workflows/compiled_python.yml'`. Push `ff4c8e09459554630c89a576e2219b705f11dda4` (2026-11-07, `before` = its parent `0cf4cec75e084fa35349d364f608dabda1c68891`) changed only `.gitignore`. The workflow ran: [run 42348509754](https://github.com/lxml/lxml/actions/runs/42348509754). This is a root-level dot-named file under `'**'`.
4. Same lxml filter, negative direction. Push `d11bce90cb3b280286a855a391d61024039c656a` (2026-11-07) changed only `.github/workflows/benchmarks.yml`: the `CI` workflow did not run (the commit's only run is `Benchmarks`). Pushes `8bf45cd5` and `401f2621` (2026-10-26), each changing only `.github/workflows/wheels.yml`, also started no `CI` run. A negative pattern whose own text begins with a dot (`!.github/**`) matches dot-folder content and removes it from a `'**'` match.
5. Mixed pushes. In the same pantavisor history, pushes that changed both `docs/` files and other files (for example `525dd96bfb8ec039bbc1baf475cb45264a759c73`, `docs/overview/*.md` plus `ctrl/ctrl_cmd.c`) started the workflow under `["**", "!docs/**"]`: one surviving path is enough.

What the observations do not cover (see Gaps): a dot-named folder nested below a non-dot folder (`a/.b/c`), and a dot-named file under `docs/` hit by `!docs/**`. The single-pattern model above predicts the same behaviour for both.

Evidence strength, ordered: the pantavisor run in case 1 (same filter shape, push event, same pattern pair) and the lxml run in case 3 (root dot file) are direct and strong; case 2 is direct but for a filter with a different second pattern; case 4 shows the negative side; the documentation sentence and the pattern model are supporting, not decisive. Third-party actions (for example `dorny/paths-filter`, which sets picomatch's `dot` option on) show that dot handling is a deliberate choice in other glob engines and say nothing about GitHub's own matcher.

### F4. Other things the filter does and does not change

Tier: established consensus (GitHub documentation; previous finding).

- `workflow_dispatch` carries no path filter. GitHub defines `paths` and `paths-ignore` under `on.<push|pull_request|pull_request_target>` ("When using the `push` and `pull_request` events, you can configure a workflow to run based on what file paths are changed"), and the section on `workflow_dispatch` never mentions them. That is a reading of where the filters are defined, not a sentence GitHub states. Replacing `paths-ignore` with `paths` leaves the manual button and the `clean_staging` input as they are.
- `branches` and `paths` combine with AND: "If you define both `branches`/`branches-ignore` and `paths`/`paths-ignore`, the workflow will only run when both filters are satisfied." `branches: [main]` is kept.
- Two workflows in one repository are evaluated independently against the same push, so a push that touches `docs/brand/` starts the deployment through its filter and `publish-docs.yml` through `docs/**`. The documents folder receives the committed brand files at once (the rule 10 exemption covers committed files under `docs/`), and the site artifact built by the deployment, including the Dokka reference, waits at staging and the production reviewer.
- The limits in the earlier finding (more than 1,000 commits or a timed-out diff always run; above 3,000 changed files a `paths` workflow may not run) are not changed by the choice of option. For this repository they are not reachable in practice.

### F5. Which way each option fails when a new folder appears under `docs/`

Tier: reasoning from F1 to F4 and from this repository's layout; no external source.

| Event | Option 1: `paths` allow-list | Option 2: `paths-ignore` deny-list | Option 3: other trigger |
|---|---|---|---|
| New folder under `docs/` that only holds documents or boards | No run. Correct. | Run at staging, waits at the production reviewer until the folder is added to the ignore list. Noise, not harm. | No run. Correct. |
| New folder under `docs/` the site build starts to read | A change to the Gradle build that reads it lies outside `docs/` and deploys. Later edits to the folder alone start no run: the published site is stale until the next deployment, a manual run, or an edit to the filter. | Runs. Correct without any edit. | Depends on the mechanism. |
| New generated board folder committed with each landing | No run. Correct. | A reviewer-gated run per landing until it is listed. | No run. Correct. |
| A new file directly in `docs/` that the site must read | No run (missed). | Not deployed if the loose files are ignored as `docs/*`; deployed if only the known loose files are named. | Depends. |
| Dot-named file under `docs/` outside `brand/` and `dokka/` | Excluded if `!docs/**` matches dot names (inferred). If it did not, an extra run. | Ignored only if `docs/*` or `docs/**` matches dot names (inferred); otherwise an extra run. | n/a |
| Dot-named file inside `docs/brand/` or `docs/dokka/` | Included if `docs/brand/**` matches dot names (inferred from F3). If it did not, a missed run. | Runs (not listed). | n/a |

The extra run of option 2 costs a staging upload and a pending production job that a person must reject or let sit. The missed run of option 1 is limited to edits made after a build change that already deployed, and is reachable by the manual trigger. Because this repository commits board and plan output under `docs/` on almost every landing, and new board locations are added over time, the deny-list is the option that needs recurring maintenance; the allow-list needs maintenance only when the site build starts reading another `docs/` folder. The two options agree on every path that exists today.

### F6. Option 3: leaving `paths-ignore: docs/**` and starting a deployment another way

Tier: reasoning, with two documentation sources for the constraints.

- **A second `push`-filtered caller workflow** (for example one with `paths: docs/brand/**, docs/dokka/**` that calls the deployment through `workflow_call`): a push that changes `docs/brand/` and a code file starts the main workflow and the caller, which are two deployments of the same commit, each stopping at the production reviewer. Avoiding it needs a filter on the main workflow that excludes the same paths, which is option 1 again with an extra file.
- **`workflow_run` on the documents publish**: the documents publish runs for every push under `docs/`, so the deployment would have to filter inside a job; the event runs "Last commit on default branch" (`GITHUB_SHA`) and not the commit that was pushed, which breaks the "build the artifact for the pushed commit" property unless the head SHA is threaded through; it also couples the production path's trigger to the exempt publish workflow.
- **`gh workflow run` or a dispatch from the documents publish job**: events created with the repository `GITHUB_TOKEN` do not start new runs, "with the following exceptions: `workflow_dispatch` and `repository_dispatch` events always create workflow runs". This would work technically, but it gives the exempt publish job (which deliberately declares no environment) a token able to start the production path, and it needs `actions: write` there. That is a wider grant on the one job that is outside approval.
- **Job-level routing** (a first job that computes changed files, and `if:` on the rest): every `docs/` push then starts a run, and the earlier finding already weighs this against native filters.
- Result: each variant adds a second moving part to the production path or a wider permission, in exchange for what option 1 achieves with four lines in an existing filter.

### F7. Idiomatic shape of the filter

Tier: common practice (repositories visible on GitHub, section 4).

- Include-everything-then-exclude-then-re-include is the common way to write "all except this folder, but not these subfolders": `'**'` first, `'!folder/**'` after, explicit re-includes last. Maintainers keep the comment near the list that explains the ordering.
- Quote every pattern starting with `!` or `*`.
- Keep the workflow's own path reachable: with `'**'` first, `.github/workflows/deploy-spaceship.yml` is included without a separate entry. (Repositories that exclude `.github/**` add the workflow file back explicitly; this one does not exclude it.)

## 4. How comparable projects do it

- **`lxml/lxml`**, `.github/workflows/ci.yml` at `6cd012a3bd81e571bb7fcf0393596b60f3ad69cb`: `on.push.paths` is `'**'`, `'!.github/**'`, `'!benchmark/**'`, followed by explicit re-includes of three workflow files. Repository events show it behaving as documented for dot paths (F3, cases 3 and 4).
- **`pantavisor/pantavisor`**, `.github/workflows/on-push.yaml` at `c8f0bae7283729c0207ed6fd45ef07f2796ae72d`: `branches: [master]` with `paths: ["**", "!docs/**"]`, the same shape as the proposal. Run history in F3, cases 1 and 5.
- **`libuv/libuv`**, `.github/workflows/CI-unix.yml`: `pull_request.paths`: `'**'`, `'!docs/**'`, `'!src/win/**'`, `'!.**'`, then `'.github/workflows/CI-unix.yml'`. The maintainers add a negative pattern for dot-names (`'!.**'`) and then re-include one dot-named workflow file, which shows they treat `'**'` as covering dot-names. Pull-request event, not tested here.
- **`systemd/systemd`**, `.github/workflows/mkosi.yml`: `push.paths`: `"**"`, then `"!docs/**"` and others, then `"!.**"` and `".github/**"`. Same family; not tested here.
- **`TanStack/table`**, `.github/workflows/pr.yml`: `pull_request.paths`: `'**'`, `'!docs/**'`, `'!media/**'`, `'!**/*.md'`, `'.changeset/**'`: a dot-named folder re-included after a negation.
- **GitHub's own documented example** for the same idea: `paths: ['sub-project/**', '!sub-project/docs/**']`.
- **This repository**: `deploy-spaceship.yml` uses `paths-ignore: 'docs/**'` and `publish-docs.yml` uses `paths: 'docs/**'` with `branches: [main]`, both with quoted patterns. Option 1 keeps the quoted-pattern and `branches: [main]` style; it changes the deployment from `paths-ignore` to `paths` because the filter now needs a re-include, which `paths-ignore` cannot express in documented behaviour.

## 5. Pitfalls and regrets

- **Order is the filter.** Moving `'docs/brand/**'` above `'!docs/**'` silently removes the re-include (the negative pattern then comes last and wins). Keep the order in a comment and in the documentation.
- **A negative-only list is silently ignored**, not rejected (Zenn test; GitHub: "you must also define at least one path without the `!` character"). `'**'` must stay first.
- **Silent absence.** A docs-only push shows no `OrganizationPage Deploy` run (earlier finding, F5). A forgotten re-include looks the same as a correct skip. Pushes touching only an unlisted `docs/` folder will not deploy, which is the intended behaviour and also the failure mode of option 1.
- **Dot-named files under `docs/` are the one untested corner.** Nothing is tracked there today. If one is added, the first push that touches only it is worth watching once, in either option.
- **Hybrid `paths-ignore` with `!` is attractive and unspecified.** It is the shortest filter and the one most likely to be written by someone who has not read F2.
- **A reference that is stale by omission is hard to see.** Option 1 needs the build-reads-this-folder fact written where the next author of a `docs/` input will look: the workflow comment and `docs/DEPLOYMENT.md`.
- **Reviewer noise under option 2.** Board folders under `docs/` change on nearly every landing; every unlisted one costs a gated run.

## 6. Recommendation for this repository

Use option 1. Replace `paths-ignore` under `on.push` in `.github/workflows/deploy-spaceship.yml` with an ordered `paths` list, keeping `branches` and `workflow_dispatch` as they are:

```yaml
on:
  push:
    branches:
      - main
    # Every push starts a run except one that changes only files under docs/, which
    # publish-docs.yml puts live on its own. The two folders under docs/ that the site
    # build reads, brand/ and dokka/, are put back so a change there deploys. Patterns
    # are checked in order and the last one that matches a path decides: keep '!docs/**'
    # after '**' and the two re-includes after '!docs/**'. If the site build starts
    # reading another folder under docs/, add it below.
    paths:
      - '**'
      - '!docs/**'
      - 'docs/brand/**'
      - 'docs/dokka/**'
  # Run manually from the Actions tab to stage any branch. Only main can reach production.
  workflow_dispatch:
    # inputs unchanged
```

Behaviour of this filter, by the evidence above:

| Changed files in the push | Starts `OrganizationPage Deploy` | Starts `OrganizationPage Docs Publish` |
|---|---|---|
| only `docs/brand/**` or `docs/dokka/**` | yes | yes |
| only `docs/plans/**`, `docs/dashboards/**`, `docs/index.html`, `docs/DEPLOYMENT.md`, or any other `docs/` path | no | yes |
| any path outside `docs/`, including `.github/**`, `.gitignore`, `.dockerignore` | yes | no (unless `docs/` also changes) |
| both a `docs/` path and a path outside `docs/` | yes | yes |
| manual run | yes (unchanged) | yes (unchanged) |

Reasoning: this is the form GitHub documents for "all of a tree except one folder, with parts put back", the same shape runs in public repositories with dot-named paths behaving as the table says, and it keeps the deployment's behaviour for everything outside `docs/` identical to today's `paths-ignore`. Option 2 is rejected because the denied set has to follow every board and plan folder that appears under `docs/`, and each miss costs a reviewer-gated run per landing. Option 3 is rejected because each variant either starts a second deployment run for mixed pushes or gives the approval-exempt publish job a token to start the production path.

Wording for `docs/DEPLOYMENT.md`, replacing the **Triggers** sentence:

> **Triggers:** a push to `main` that changes a file outside `docs/`, or a file under `docs/brand/` or `docs/dokka/`, runs staging, then production after approval; a push that changes only other files under `docs/` does not start this workflow. `docs/brand/` and `docs/dokka/` are the only parts of `docs/` the site build reads, so they are the only ones that deploy the site; the rest of `docs/` is published by the documents workflow alone. If the site build starts reading another folder under `docs/`, add it to the `paths` list in `deploy-spaceship.yml`: a change to that folder alone starts no deployment until it is listed. A manual run (Actions → OrganizationPage Deploy → Run workflow) …

and in the documents-workflow section, extend the mixed-push sentence: "A push that changes `docs/brand/` or `docs/dokka/` starts both workflows: the files go live in the documents folder at once, and the site, including the API reference, waits for staging and approval." Keep the existing paragraph on silent absence; add that a push touching only other `docs/` folders leaves no `OrganizationPage Deploy` run.

Two follow-ups for whoever lands the change: watch the first push that touches only `docs/brand/` or `docs/dokka/` and the first push that touches only another `docs/` path (one run of each, visible in the Actions list), because the first landing of the new filter cannot be exercised before it is on `main` (a manual run does not evaluate the filter); and keep `ci.yml` as it is (it has no path filter, so pull requests that change `docs/brand/` or `docs/dokka/` already build the site with those files).

## 7. Load-bearing claims

1. **Include and exclude in one `paths` filter, with `!`.** "If you want to both include and exclude path patterns for a single event, use the `paths` filter prefixed with the `!` character to indicate which paths should be excluded." Source: [workflow syntax, `on.<push|pull_request>.paths`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax); docs source `data/reusables/actions/workflows/triggering-a-workflow-paths1.md` at `8c0c8abc960d` (2026-07-09); fetched 2026-11-09.
2. **Order of patterns decides; a later positive pattern re-includes.** "The order that you define `paths` patterns matters: A matching negative pattern (prefixed with `!`) after a positive match will exclude the path. A matching positive pattern after a negative match will include the path again." Source: same page; `triggering-a-workflow-paths4.md` at `4e34c693418f`; fetched 2026-11-09.
3. **A `!` list needs a positive pattern.** "If you define a path with the `!` character, you must also define at least one path without the `!` character. If you only want to exclude paths, use `paths-ignore` instead." Source: same page and file as claim 2.
4. **GitHub's example of include-then-exclude.** "This example runs anytime the `push` event includes a file in the `sub-project` directory or its subdirectories, unless the file is in the `sub-project/docs` directory. For example, a push that changed `sub-project/index.js` or `sub-project/src/index.js` will trigger a workflow run, but a push changing only `sub-project/docs/readme.md` will not." Source: same page and file as claim 2.
5. **Sequential checking and re-include in the cheat sheet.** "Patterns are checked sequentially. A pattern that negates a previous pattern will re-include file paths." and "`!`: At the start of a pattern makes it negate previous positive patterns. It has no special meaning if not the first character." Source: [workflow syntax, Filter pattern cheat sheet](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#filter-pattern-cheat-sheet); `workflow-syntax.md` at `c67a9362ec63` (2026-10-01); fetched 2026-11-09.
6. **`'**'` is the no-filter default.** "The `**` wildcard matches any character including slash (`/`). This is the default behavior when you don't use a `path` filter." and "`**`: Matches zero or more of any character." Source: same page and file as claim 5.
7. **`?` and `+` are preceding-character quantifiers, and `!`, `*`, `[` need quotes.** "`?`: Matches zero or one of the preceding character." and "The characters `*`, `[`, and `!` are special characters in YAML. If you start a pattern with `*`, `[`, or `!`, you must enclose the pattern in quotes." Source: same page and file as claim 5.
8. **A workflow runs when at least one path matches; `paths-ignore` runs unless every path is ignored; `branches` and `paths` combine with AND; path filters apply to `push` and `pull_request`.** "If at least one path matches a pattern in the `paths` filter, the workflow runs." and "If any path names do not match patterns in `paths-ignore`, even if some path names match the patterns, the workflow will run." and "If you define both `branches`/`branches-ignore` and `paths`/`paths-ignore`, the workflow will only run when both filters are satisfied." and "When using the `push` and `pull_request` events, you can configure a workflow to run based on what file paths are changed." Source: same page; reusables `triggering-a-workflow-paths1` (`8c0c8abc960d`), `-paths2`, `-paths3`; fetched 2026-11-09. The first three sentences are also quoted in the earlier finding.
9. **`paths-ignore` is documented with positive patterns only.** "A workflow with the following path filter will only run on `push` events that include at least one file outside the `docs` directory at the root of the repository." followed by `paths-ignore: - 'docs/**'`. Source: reusable `triggering-a-workflow-paths3`, same page; fetched 2026-11-09. (Basis for "negation inside `paths-ignore` is undocumented".)
10. **Pantavisor's filter and run (dot-named folder under `'**'` with `'!docs/**'`).** Filter text at `c8f0bae7283729c0207ed6fd45ef07f2796ae72d` in `.github/workflows/on-push.yaml`: "push:\n    branches:\n      - master\n    paths:\n      - "**"\n      - "!docs/**"". The push `5701866b038e7d375e2db89ce9ff0d838355c228` changed only `.github/workflows/onpush-pvtest.yaml` (status modified) and started [run 42209301674](https://github.com/pantavisor/pantavisor/actions/runs/42209301674) of `.github/workflows/on-push.yaml`. Source: [pantavisor/pantavisor, commit 5701866b](https://github.com/pantavisor/pantavisor/commit/5701866b038e7d375e2db89ce9ff0d838355c228) and the run page; observed 2026-11-09.
11. **Pantavisor's earlier run (removed root dot file under `'**'`).** Filter text at `f6093f9667825d5a7b02518dac6df774034de9d9` in `.github/workflows/on-push-raspberrypi-armv8.yaml`: "paths:\n      - '**'\n      - '.github/configs/**'". The commit removed `.github/workflows/github-actions-gitlabci.yml` and `.gitlab-ci.yml` and started [run 19028196022](https://github.com/pantavisor/pantavisor/actions/runs/19028196022). Source: [pantavisor/pantavisor, commit f6093f96](https://github.com/pantavisor/pantavisor/commit/f6093f9667825d5a7b02518dac6df774034de9d9); observed 2026-11-09.
12. **lxml's filter and the `.gitignore` run.** Filter text at `6cd012a3bd81e571bb7fcf0393596b60f3ad69cb`, `.github/workflows/ci.yml`: "paths:\n      - '**'\n      - '!.github/**'\n      - '!benchmark/**'\n      - '.github/workflows/ci.yml'". The push `ff4c8e09459554630c89a576e2219b705f11dda4` changed only `.gitignore` and started [run 42348509754](https://github.com/lxml/lxml/actions/runs/42348509754) of `CI`. The push `d11bce90cb3b280286a855a391d61024039c656a`, changing only `.github/workflows/benchmarks.yml`, started only `Benchmarks`. Source: [lxml/lxml, commit ff4c8e09](https://github.com/lxml/lxml/commit/ff4c8e09459554630c89a576e2219b705f11dda4) and [commit d11bce90](https://github.com/lxml/lxml/commit/d11bce90cb3b280286a855a391d61024039c656a); observed 2026-11-09.
13. **Events created with the repository token do not start runs, except dispatch events.** "When you use the repository's `GITHUB_TOKEN` to perform tasks, events triggered by the `GITHUB_TOKEN` will not create a new workflow run, with the following exceptions: `workflow_dispatch` and `repository_dispatch` events always create workflow runs." Source: [Trigger a workflow](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow) (rendering of reusable `data/reusables/actions/actions-do-not-trigger-workflows.md` at `24a7a1dca982`, 2026-05-22); fetched 2026-11-09.
14. **`workflow_run` runs against the default branch's latest commit.** In the event's table the `GITHUB_SHA` column reads "Last commit on default branch" and the `GITHUB_REF` column reads "Default branch". Source: [events that trigger workflows, `workflow_run`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run); docs source `events-that-trigger-workflows.md` at `63859c481b21` (2026-09-21); fetched 2026-11-09.
15. **Test write-up of ordering and negative-only lists.** "positive pattern なしで negative pattern のみの指定ができない（構文エラーではなく無視される）。" (a negative-only `paths` list is ignored, not a syntax error). Source: [Zenn, coot, 2024-07-21, updated 2024-07-26](https://zenn.dev/coot/articles/5a9e530aa1f4e6) (as summarised by the page fetch); `pull_request` trigger. One author's experiments.

## 8. Gaps

- **Nested dot-named folders and dot-named files under `docs/` were not observed.** The observed cases are root-level dot-named files, a root-level dot-named folder with ordinary children, and deleted dot files. The pattern model predicts the same behaviour for `a/.b/c` and for `docs/.x` against `!docs/**`, but no run history showing it was found. Nothing tracked in this repository has either shape today. A throwaway-branch test (a `paths` workflow with this filter, then pushes that change `docs/.probe`, `docs/brand/.probe` and `docs/dokka/.probe` alone) would settle it; none has been run.
- **`paths-ignore` with `!` entries**: not documented, and the one in-the-wild use found (`telegramdesktop/tdesktop`, `mac.yml`) could not be verified because its runs have expired. A test would settle it; the recommendation does not depend on it.
- **`.dockerignore`** was not observed on its own; `.gitignore` (lxml) and `.gitlab-ci.yml` (pantavisor) are the same shape (a root-level dot-named file).
- **Re-include after a negation, for a dot-named path, in the wild**: the documentation states the rule and the lxml push `0cf4cec75e084fa35349d364f608dabda1c68891` (which changes `.github/workflows/benchmarks.yml`, `ci.yml` and `wheels.yml`) ran `CI`, but that push also edited `ci.yml` itself, so the filter version applied to it is not separately pinned. The recommended filter re-includes `docs/brand/**` and `docs/dokka/**`, which do not start with a dot.
- **The first push after the filter lands** cannot be tested in advance: a manual run does not evaluate `paths`. Whether the push that adds the filter is itself judged by the new or the old filter is documented only by inference (see the earlier finding, F6, for the equivalent question on a newly added workflow). The first push that touches only `docs/brand/` or `docs/dokka/` after landing is the one that confirms the live behaviour.
- **GitHub's matcher is closed source.** Everything in F3 is observed behaviour plus documentation. The runner (`actions/runner`) does not evaluate trigger filters; `actions/languageservices` and `actionlint` validate syntax only. Observed behaviour could change without a documentation change; the two-repository evidence is dated 2025-11 and 2026-11.
- **Limits above 3,000 changed files** for `paths` versus `paths-ignore` stay as in the earlier finding: the direction for `paths-ignore` is unstated, and neither is reachable here.
- **Whether `docs/dokka/**` could be narrowed to `docs/dokka/styles/**`** is not a question of fact. The build reads only the stylesheet today, and any file later added under `docs/dokka/` deploys with the wider pattern. Narrowing would also work with the same ordering rule.
