# How GitHub Actions path filters decide which workflows a push to `main` starts

## 1. Question

How do GitHub Actions path filters (`paths`, `paths-ignore`) decide which workflows a push to `main` starts, and is a pair of workflows with complementary filters the right mechanism, compared with one workflow that inspects changed files inside a job and routes from there?

The work this serves, stated as facts about it:

- Everything under `docs/` is published to the live site on a push to `main`, with no staging and no approval, by a new, separate workflow triggered by `push` to `main` with `paths: docs/**`.
- The existing site deployment workflow `OrganizationPage Deploy` (`.github/workflows/deploy-spaceship.yml`) gets `paths-ignore: docs/**` on its `push` trigger and keeps its staging and required-reviewer path for everything else. Its `workflow_dispatch` trigger stays.
- The filter is `docs/**` only; root files such as `README.md` and `CHANGELOG.md` keep the full path.
- A push that changes both `docs/` and other files runs both workflows independently.
- `main` has no branch protection and no rulesets (checked: `gh api .../branches/main/protection` returns "Branch not protected"; `gh api .../rulesets` returns an empty list). Landings arrive as merge commits.
- Each publish uploads the whole `docs/` folder as it stands at its own commit.

## 2. Bottom line

- **Complementary filters partition every non-empty push exactly.** A push whose changed-file list is only `docs/**` starts the publish workflow and not the site deployment; a push with no file under `docs/` starts the site deployment and not the publish workflow; a mixed push starts both. A push with an empty changed-file list starts neither. The two filters cannot leave a gap or overlap by accident. Established consensus: GitHub's documentation of `paths` and `paths-ignore`.
- **The merge push on `main` is judged by a two-dot diff of the old and new tip of `main`**, so it sees everything the merged branch brought in, as a net tree difference (a file the branch changed and then changed back does not count). Established consensus: GitHub documentation.
- **Both workflows fail open on commit count and diff timeout, and diverge only above 3,000 changed files.** More than 1,000 commits in the push, or a diff that times out, makes the workflow "always" run, for `paths` and `paths-ignore` alike. Above 3,000 changed files a workflow is "not" run when the files its filter matches are not in the first 3,000 returned. The documented limit is 3,000 on github.com (older sources say 300). This repository's pushes are far below all three.
- **A filtered-out push leaves nothing behind on a branch with no required checks**: no run, no check, no skipped entry. The "Pending" state GitHub documents applies to a pull request that requires the skipped workflow's checks, which `main` here does not.
- **Concurrency**: with job-level `concurrency` and `cancel-in-progress: false`, the default queue holds one running and one pending job per group. A newer arrival cancels the older pending job and takes its place, so the newest pending publish survives. Because every publish uploads the whole folder at its own commit, a dropped intermediate publish loses nothing, provided the survivor is the newest commit. GitHub states that queue ordering is not guaranteed, which leaves a small stale-publish risk (section 5).
- **Two workflows with complementary filters is the right mechanism here.** The in-job routing alternative needs a runner and checkout just to decide, couples the docs path to the staging and required-reviewer pipeline's run, and gives no advantage on this repository's scale. Two items are not established by GitHub's text and are flagged in section 8: whether the push that adds the publish workflow starts it on that same push (documented only by inference and by this repository's own history for an unfiltered workflow), and whether `docs/**` matches dot-named paths.

## 3. Findings

### F1. A push starts a workflow only if its filter accepts the changed-file list; `paths` and `paths-ignore` are complements

Tier: established consensus. Applies to github.com docs as of 2026-11 (docs source `github/docs`, reusable `triggering-a-workflow-paths*`, content dated 2026-09-01 at commit `068546469ae7`).

- `paths`: "If at least one path matches a pattern in the `paths` filter, the workflow runs."
- `paths-ignore`: "When all the path names match patterns in `paths-ignore`, the workflow will not run. If any path names do not match patterns in `paths-ignore`, even if some path names match the patterns, the workflow will run."
- "If there are no files changed, the workflow will not run."
- GitHub's own example for `paths-ignore: 'docs/**'`: "A workflow with the following path filter will only run on `push` events that include at least one file outside the `docs` directory at the root of the repository."
- `branches` and `paths` combine with AND: "If you define both `branches`/`branches-ignore` and `paths`/`paths-ignore`, the workflow will only run when both filters are satisfied." The publish workflow therefore needs `branches: [main]` beside `paths`. The site deployment already has `branches: [main]`.
- The two filters cannot be mixed in one workflow for one event ("You cannot use `paths` and `paths-ignore` to filter the same event in a single workflow"), which is no obstacle: they sit in two different workflows.
- Path filters apply to `push` and `pull_request` only. `workflow_dispatch` is unaffected, so the manual staging button on the site deployment keeps working. Path filters are "not evaluated for pushes of tags".

Consequence for the three push shapes:

| Changed files in the push | `paths: docs/**` (publish) | `paths-ignore: docs/**` (site deployment) |
|---|---|---|
| only under `docs/` | runs | does not run (all paths match the ignore list) |
| none under `docs/` | does not run | runs |
| both | runs | runs (at least one path outside `docs/`) |
| nothing changed | does not run | does not run |

Editing the publish workflow file itself (`.github/workflows/...`) is a non-`docs/` change, so it runs the site deployment and does not by itself run the publish workflow, unless the file is listed in its `paths`.

### F2. For a push, the changed files are a two-dot diff of the push's base and head SHAs

Tier: established consensus. Source: [workflow syntax, "Git diff comparisons"](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax). Same docs commit as F1.

- "GitHub generates the list of changed files using two-dot diffs for pushes and three-dot diffs for pull requests."
- "**Pushes to existing branches:** A two-dot diff compares the head and base SHAs directly with each other."
- "**Pull requests:** Three-dot diffs are a comparison between the most recent version of the topic branch and the commit where the topic branch was last synced with the base branch."

When a pull request lands on `main` as a merge commit, GitHub records a `push` event to `main`, and that event uses the push rule (two-dot), not the pull-request rule (three-dot). The base is the previous tip of `main` and the head is the merge commit, so the file list is every path whose content differs between the two trees, which is everything the branch changed relative to `main` as it stood. The three-dot rule only matters for the `pull_request` event (this repository's `OrganizationPage CI` workflow).

Two properties follow: a multi-commit push (or a multi-commit branch landing) is judged once, on the net difference; and a branch that touches `docs/` and then reverts it before landing does not start the publish workflow. The second property is an inference from "compares the head and base SHAs directly", not a stated sentence.

### F3. Documented limits

Tier: established consensus. Same source and docs commit as F2. The feature flag `actions-paths-filter-limit` in `github/docs` (`data/features/actions-paths-filter-limit.yml`, title "Workflow path filters evaluate up to 3,000 changed files") lists `fpt: '*'`, `ghec: '*'`, `ghes: '>=3.22'`, so github.com uses 3,000, and the source text renders "300" only for older GitHub Enterprise Server versions.

- "If a push contains more than 1,000 commits, the workflow will **always** run."
- "If generating the diff times out, the workflow will **always** run."
- "If the generated diff contains more than 3,000 files and the files the workflow filter matches are not in the first 3,000 returned by the filter, the workflow will **not** run."

The first two sentences say "the workflow", with no distinction between `paths` and `paths-ignore`: both fail open, so for a push of more than 1,000 commits or a timed-out diff, both the publish workflow and the site deployment run. For the publish workflow that is harmless (it uploads the whole folder). For the site deployment it stages and then waits for a reviewer.

The third sentence is written once, for "the workflow filter", and does not say how it reads for `paths-ignore`. For `paths: docs/**`, it means that if more than 3,000 files change and no `docs/` file is among the first 3,000 returned, the publish workflow is not run (fail closed: docs do not go live from that push). For `paths-ignore` the documentation does not spell out the direction; see Gaps. GitHub's remedy: "you might need to make your filters more specific, or change how you work with pushes and pull requests to generate simpler diffs".

### F4. Pattern matching for `docs/**`

Tier: established consensus for depth; no source for dot-named paths (see Gaps). Source: [workflow syntax, "Filter pattern cheat sheet"](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#filter-pattern-cheat-sheet).

- "Path patterns must match the whole path, and start from the repository's root."
- `**`: "Matches zero or more of any character." `*` "does not match the `/` character."
- Table row for `docs/**`: "Any files in the `docs` directory and its subdirectories at the root of the repository", with example matches `docs/README.md` and `docs/mona/octocat.txt`. By contrast `docs/*` is "All files within the root of the `docs` directory only".
- So `docs/**` matches every depth under the `docs/` at the repository root, and does not match `site/docs/x`. (`'**/docs/**'` is the any-depth `docs` variant.)
- YAML: a pattern that starts with `*`, `[` or `!` must be quoted. `docs/**` starts with `d` and is valid unquoted; quoting it (`'docs/**'`) is harmless and matches GitHub's examples.

The cheat sheet states no exception for names starting with a dot. Its own examples use a literal dot directory (`'.github/workflows/**'`) in a path filter elsewhere in the documentation. Whether `**` expands into dot-named children such as `docs/.nojekyll` is not stated. The third-party action `dorny/paths-filter` documents that it sets picomatch's `dot` option to true on purpose, which shows that dot handling is an explicit choice in a glob engine and not something to assume. This repository has no tracked dot-named file under `docs/` today (`git ls-files docs` shows none).

### F5. What a filtered push leaves behind

Tier: established consensus for the pull-request case; common practice for the push case. Sources: [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax); [Mergify, "Path filters are not a CI gate"](https://mergify.com/blog/path-filters-are-not-a-ci-gate), 2026-06-26.

- GitHub: "If a workflow is skipped due to path filtering, branch filtering, or a commit message, then checks associated with that workflow will remain in a "Pending" state. A pull request that requires those checks to be successful will be blocked from merging."
- Mergify: path filtering "skips the whole workflow, so no job is ever created" and "no status, skipped or otherwise, is ever reported".
- Observed in this repository: the merge commit `21c23eb` on `main` (PR 6) has runs and check runs only from `OrganizationPage Deploy` (`gh run list --commit 21c23eb1bec01d613759edd62b8aa0106cee9ed6` lists one run; the commit's check runs are `build`, `staging`, `production`). `OrganizationPage CI` has `push: branches-ignore: [main]` and left no run and no check on that commit. That is a branch filter, not a path filter, but GitHub treats the two together in the sentence quoted above.

So on `main`, with no required checks, a filtered push shows no run for the filtered workflow in the Actions list, no pending check and no failure. The absence is silent: an operator looking at the Actions list for a docs-only push sees only the publish run, and for a code-only push sees only the site deployment run. The "Pending" state matters only for a pull request that requires a skipped workflow's check, which cannot occur on a branch with no required checks.

### F6. The first landing: does the push that adds the publish workflow start it?

Tier: partly established (mechanism), partly inferred (the combination), see Gaps.

- "Runs your workflow when you push a commit or tag... This includes workflows that are not merged into the default branch." ([events that trigger workflows, `push`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push)). For `push`, `GITHUB_SHA` is the "Tip commit pushed to the ref"; unlike `schedule` and a few others, a `push` run is not bound to the default branch's copy of the workflow.
- Observed in this repository: the merge commit `deebbcd` (PR 1) is the push that first put `.github/workflows/deploy-spaceship.yml` on `main` (its first parent has no `.github/workflows` tree), and `OrganizationPage Deploy` run `36047975302` (event `push`, branch `main`, head `deebbcd`) ran on that same push. That workflow had a `branches` filter and no `paths` filter, so this is evidence for "a workflow introduced by a push runs on that push", not for a path filter evaluated on a newly added file.
- No GitHub sentence states that a newly added workflow's `paths` filter is evaluated against the very push that adds it. By the documented mechanics it would be: the changed-file list of the landing (F2) contains `docs/` files and the new workflow file, so `docs/**` matches. This is an inference.

The landing commit that adds the publish workflow also changes `docs/`, so if the inference holds, the first publish happens at that landing; if it does not, the first publish happens at the next push that changes `docs/`, or on a manual dispatch if the workflow also has `workflow_dispatch`.

### F7. Concurrency with `cancel-in-progress: false`

Tier: established consensus. Sources: [workflow syntax, `jobs.<job_id>.concurrency`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idconcurrency) and [the concurrency concept page](https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency); docs source reusable `data/reusables/actions/actions-group-concurrency.md`, github.com variant (`actions-nga` branch). Fetched 2026-11-09.

- "This means that there can be at most one running job or workflow in a concurrency group at any time. When a concurrent job or workflow is queued, if another job or workflow using the same concurrency group in the repository is in progress, the queued job or workflow will be `pending`. By default, any existing `pending` job or workflow in the same concurrency group will be canceled and the new queued job or workflow will take its place."
- `cancel-in-progress` only affects the running job: "To also cancel any currently running job or workflow in the same concurrency group, specify `cancel-in-progress: true`." With `false` (the default) the running publish is never cancelled.
- Result when publishes outrun the upload: the running one finishes; exactly one stays pending; every extra arrival cancels the older pending one. If publishes P1 (running), P2, P3, P4 arrive in that order, P2 and P3 end cancelled, P1 finishes, then P4 runs. The oldest pending is cancelled and the newest survives.
- Opt-in alternative, the `queue` property: "`single` (default): At most one job or workflow run can be `pending` in the concurrency group... `max`: Up to 100 jobs or workflow runs can be `pending` in the concurrency group. When the queue is full, any additional jobs or workflow runs are canceled." "The combination of `queue: max` and `cancel-in-progress: true` is not allowed and will result in a workflow validation error." `queue` is new, appears on the github.com page as of 2026-11, and is behind a feature flag in the docs source; its presence is a current-docs fact that this research did not test.
- Ordering: "Jobs or workflow runs in the same concurrency group are processed in first-in-first-out (FIFO) order according to the time each one started waiting on the concurrency group, not the time each workflow was dispatched. Since the actual start time of a job or run may vary, ordering is not guaranteed."
- Group names are shared across workflows: "concurrency group names must be unique across workflows to avoid canceling in-progress jobs or runs from other workflows. Otherwise, any previously in-progress or pending job will be canceled, regardless of the workflow." The publish job's group must therefore not reuse the site deployment's `deploy-production` or `deploy-staging` names. (This sentence is in the how-to page's "only cancel in-progress jobs or runs for the current workflow" example.)

## 4. How comparable projects do it

- **Dokka** (`Kotlin/dokka`, [`gh-pages-deploy-dev-docs.yml` at `784d74ac3e67`](https://github.com/Kotlin/dokka/blob/784d74ac3e672f07efefaf5c6000c1e325def724/.github/workflows/gh-pages-deploy-dev-docs.yml)): a separate docs workflow triggered by `push` to `master` with `paths: ['docs-developer/**']`, plus `workflow_dispatch` and `release: published`. The same repository keeps its code workflows separate (`tests-thorough.yml`, `check-api.yml`). This is the shape in the work: a dedicated docs workflow with a `paths` include. It does not add a complementary `paths-ignore` to the code workflows, and it keeps a manual trigger.
- **OkHttp** (`square/okhttp`, `.github/workflows/docs.yml` and `build.yml` on current default branch, tip `91ec7788ef3e` at time of reading): the same docs-versus-code split is done differently, with no path filter at all: both run on every push to `main` and route with job-level `if:` (`github.ref == 'refs/heads/main' || contains(github.event.pull_request.labels.*.name, 'documentation')`). This is the "inspect inside the workflow and route" family. It costs a run (and for `docs.yml` a runner) for every push, and it is chosen there because the workflows also validate docs on pull requests.
- **`dorny/paths-filter`** (v4.0.3, 2026-08-05): the common action for in-job routing. It exposes per-filter outputs for `if:` conditions. README: "Changes are detected against the most recent commit on the same branch before the push", and its `dot` option is on. Mergify's article above names it as the in-job tool and recommends native `on.push.paths` for whole-workflow gating.
- GitHub's own documented convention for the complement: `paths-ignore: 'docs/**'` is the sample used for "run only when a file outside `docs` changed".

Where two workflows with complementary filters hold up: nothing is required of branch protection (none exists here), the filter is evaluated by GitHub before any runner is allocated, a docs-only push never consumes a build run, and the Actions list shows one run per concern. Where it does not hold up: wherever a required status check depends on the filtered workflow (F5), and where the in-job file list must also drive finer routing than a yes/no per workflow.

## 5. Pitfalls and regrets

- **Silent skips.** A filtered-out workflow produces no run and no message. Anyone expecting a "skipped" entry in the Actions list will not find one (F5). Mitigation is documentation of the split, not code.
- **Required checks and filters.** The best-documented regret in this area: a required check owned by a path-filtered workflow stays "Pending" and blocks merges (GitHub's text in F5; Mergify, Pants and GitHub's troubleshooting page describe the same trap). It does not apply while `main` has no branch protection or rulesets. If protection is added later, neither workflow's jobs may be made required checks without a pass-through counterpart.
- **Stale publish under queue replacement.** With the default queue, a pending publish is replaced by whichever job *started waiting* last, and GitHub says ordering is not guaranteed (F7). If an older commit's run starts waiting after a newer one's, the older run replaces the newer pending run and uploads older `docs/` as the last word. The window is narrow (two landings seconds apart). Options: a step that publishes the tip of `main` instead of `github.sha` (conflicts with "as it stands at its own commit"); `queue: max`, which removes replacement but not ordering uncertainty; or accepting the narrow risk, because the next `docs/` push repairs it. A guard that skips a run whose `github.sha` is not the tip of `main` is not safe on its own, since the replaced newer run is gone.
- **Concurrency group collisions across workflows.** A group name shared with the site deployment cancels pending runs across workflows (F7).
- **`paths` on the publish workflow excludes edits to the publish workflow itself.** Changing its file does not republish unless the file is added to `paths` or a manual trigger exists.
- **First-landing uncertainty (F6).** Do not rely on the landing push to publish the existing `docs/` content; a manual trigger or the next `docs/` push covers the case where it did not.
- **Fail-open on large pushes.** A push of more than 1,000 commits, or a timed-out diff, runs both workflows regardless of content (F3). Harmless here: the publish uploads the whole folder, and the site deployment waits for a reviewer.
- **Above 3,000 changed files**, a `paths` workflow can be skipped even though it should run. Not a realistic risk for this repository; GitHub's remedy is simpler pushes.
- **Dot-named files under `docs/`**: unestablished (F4). If the publish must react to a change that touches only a dot-named file, the behaviour of `docs/**` is unconfirmed.
- **In-job routing costs and couples.** Routing inside one workflow means every push to `main` starts a run, checks out the repository and computes a diff before any decision, and the docs publish would live in the run that carries the staging and required-reviewer jobs (run name, failure state and re-run all shared). The separate-workflow shape keeps the production path's contract (artifact staged once, no rebuild, fail-closed approval) untouched.

## 6. Recommendation for this repository

Use two workflows with complementary native filters:

- New publish workflow: `on.push` with `branches: [main]` and `paths: ['docs/**']`; a job-level `concurrency` group of its own (distinct name, `cancel-in-progress: false`), so that overlapping publishes keep one running and the newest one pending.
- `OrganizationPage Deploy`: add `paths-ignore: ['docs/**']` beside the existing `branches: [main]` under `on.push`. Leave `workflow_dispatch` as it is.

Reasoning: the filters partition every non-empty push exactly (F1), the merge push is judged on the whole branch's net change (F2), every documented limit fails in a direction that is harmless here (F3), and nothing in the Actions list or the checks of `main` depends on a filtered workflow reporting (F5). Routing in a job would add a runner, a checkout and a diff step to every push, and would put an unreviewed publish into the run that holds the reviewer gate.

Three small additions that the findings support, none of which change the filters: give the publish workflow a `workflow_dispatch` trigger as a backstop for the first landing (F6), for the fail-closed >3,000-file case (F3) and for the stale-publish case; consider listing the publish workflow's own path in its `paths`; and do not treat the landing push as the first publish until it has been seen to run.

## 7. Load-bearing claims

1. **A `paths` workflow runs when at least one changed path matches.** "If at least one path matches a pattern in the `paths` filter, the workflow runs." Source: [github/docs, reusable `triggering-a-workflow-paths2`](https://github.com/github/docs/blob/068546469ae7f079368d12f969991a045121c4a0/data/reusables/actions/workflows/triggering-a-workflow-paths2.md), rendered at [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax); docs commit `068546469ae7`, 2026-09-01; fetched 2026-11-09.
2. **A `paths-ignore` workflow does not run only when every changed path is ignored.** "When all the path names match patterns in `paths-ignore`, the workflow will not run. If any path names do not match patterns in `paths-ignore`, even if some path names match the patterns, the workflow will run." Source: reusable `triggering-a-workflow-paths3`, same page and version as claim 1.
3. **No changed files, no run.** "If there are no files changed, the workflow will not run." Source: reusable `triggering-a-workflow-paths5`, same page and version.
4. **`branches` and `paths` combine with AND.** "If you define both `branches`/`branches-ignore` and `paths`/`paths-ignore`, the workflow will only run when both filters are satisfied." Source: reusable `triggering-a-workflow-paths1`, same page and version.
5. **One workflow cannot use both filters for one event.** "You cannot use both the `paths` and `paths-ignore` filters for the same event in a workflow." Source: reusable `triggering-a-workflow-paths1`, same page and version.
6. **Pushes use a two-dot diff of head and base.** "GitHub generates the list of changed files using two-dot diffs for pushes and three-dot diffs for pull requests" and "**Pushes to existing branches:** A two-dot diff compares the head and base SHAs directly with each other." Source: reusable `triggering-a-workflow-paths5`, same page and version.
7. **Limits and their direction.** "If a push contains more than 1,000 commits, the workflow will **always** run. If generating the diff times out, the workflow will **always** run. If the generated diff contains more than 3,000 files and the files the workflow filter matches are not in the first 3,000 returned by the filter, the workflow will **not** run." Source: same reusable and page; the 3,000 figure applies to github.com per [`data/features/actions-paths-filter-limit.yml`](https://github.com/github/docs/blob/main/data/features/actions-paths-filter-limit.yml): "versions: fpt: '*'  ghec: '*'  ghes: '>=3.22'". Same date.
8. **`docs/**` matches the root `docs/` directory at any depth.** "`docs/**` | Any files in the `docs` directory and its subdirectories at the root of the repository." and "Path patterns must match the whole path, and start from the repository's root." and "`**`: Matches zero or more of any character." Source: [workflow syntax, "Filter pattern cheat sheet"](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#filter-pattern-cheat-sheet); docs source `content/actions/reference/workflows-and-actions/workflow-syntax.md` at docs commit `c67a9362ec63` (2026-10-01); fetched 2026-11-09.
9. **Filtered workflows leave checks pending, which blocks only a pull request that requires them.** "If a workflow is skipped due to path filtering, [branch filtering](/actions/reference/workflows-and-actions/workflow-syntax#onpull_requestpull_request_targetbranchesbranches-ignore), or a [commit message](/actions/how-tos/manage-workflow-runs/skip-workflow-runs), then checks associated with that workflow will remain in a "Pending" state. A pull request that requires those checks to be successful will be blocked from merging." Source: reusable `triggering-a-workflow-paths2`, same page and version as claim 1.
10. **A path-filtered workflow reports no status at all.** "it skips the whole workflow, so no job is ever created" and "no status, skipped or otherwise, is ever reported". Source: [Mergify, "Path filters are not a CI gate"](https://mergify.com/blog/path-filters-are-not-a-ci-gate), 2026-06-26. One vendor's description, consistent with claim 9.
11. **A `push` runs workflows from any branch, at the pushed tip commit.** "Runs your workflow when you push a commit or tag, or when you create a repository from a template. This includes workflows that are not merged into the default branch." and the `GITHUB_SHA` column: "Tip commit pushed to the ref." Source: [events that trigger workflows, `push`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push); docs source at the repository's current content, fetched 2026-11-09.
12. **Default concurrency keeps one pending job and replaces it.** "This means that there can be at most one running job or workflow in a concurrency group at any time. When a concurrent job or workflow is queued, if another job or workflow using the same concurrency group in the repository is in progress, the queued job or workflow will be `pending`. By default, any existing `pending` job or workflow in the same concurrency group will be canceled and the new queued job or workflow will take its place." Source: [workflow syntax, `concurrency`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idconcurrency), docs source `data/reusables/actions/actions-group-concurrency.md`; fetched 2026-11-09.
13. **`cancel-in-progress` only concerns the running job.** "To also cancel any currently running job or workflow in the same concurrency group, specify `cancel-in-progress: true`." Same source and date as claim 12.
14. **The `queue` option and the ordering caveat.** "`max`: Up to 100 jobs or workflow runs can be `pending` in the concurrency group. When the queue is full, any additional jobs or workflow runs are canceled." and "Since the actual start time of a job or run may vary, ordering is not guaranteed." and "The combination of `queue: max` and `cancel-in-progress: true` is not allowed and will result in a workflow validation error." Same source and date as claim 12.
15. **Concurrency group names are shared across workflows in a repository.** "concurrency group names must be unique across workflows to avoid canceling in-progress jobs or runs from other workflows. Otherwise, any previously in-progress or pending job will be canceled, regardless of the workflow." Source: [control workflow concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency), docs source file last changed 2026-03-13; fetched 2026-11-09.
16. **Dokka runs a dedicated docs workflow on a `paths` include.** Quote of the file at the pinned commit: "push:\n    branches:\n      - master\n    paths:\n      - 'docs-developer/**'". Source: [Kotlin/dokka `gh-pages-deploy-dev-docs.yml` at `784d74ac3e67`](https://github.com/Kotlin/dokka/blob/784d74ac3e672f07efefaf5c6000c1e325def724/.github/workflows/gh-pages-deploy-dev-docs.yml), file last changed 2024-09-10.
17. **`dorny/paths-filter` sets picomatch `dot` on deliberately and diffs against the commit before the push.** "Picomatch [dot](https://github.com/micromatch/picomatch#options) option is set to true. Globbing will also match paths where file or folder name starts with a dot." and "Changes are detected against the most recent commit on the same branch before the push". Source: [dorny/paths-filter README](https://github.com/dorny/paths-filter/blob/v4.0.3/README.md), tag v4.0.3 (2026-08-05).

Claims about the repository (the existing workflows, `main` having no protection or rulesets, the run history of `deebbcd` and `21c23eb`) were read directly from the repository and the GitHub API and are not listed above.

## 8. Gaps

- **Item 3 is not settled by GitHub's text.** No sentence says that a workflow added by a push has its `paths` filter evaluated on that same push. Evidence is the documented push mechanics (claim 11), the changed-file rule (claim 6), and this repository's own history for an unfiltered workflow (`deebbcd`). A definitive answer needs a test push (for example a throwaway branch with a `paths` workflow added together with a matching file), which this research did not run because it may not mutate the repository or trigger runs.
- **Dot-named paths under `docs/`**: GitHub's pattern documentation neither confirms nor excludes matching of names that start with a dot under `**`. Not tested. Today `docs/` has no tracked dot-named file; a future `docs/.nojekyll`-style file would be affected.
- **`paths-ignore` above 3,000 changed files**: the documented sentence is worded for "the files the workflow filter matches" and does not spell out the `paths-ignore` direction. Not established; irrelevant at this repository's scale.
- **Two-dot diff of a merge commit with a net-zero `docs/` change** (changed and reverted within one branch): inferred from "compares the head and base SHAs directly", not stated.
- **The `queue` property** appears on the live github.com page as of 2026-11-09 but sits behind a feature flag in the docs source, and was not tested. The default (`single`) behaviour is the longer-documented one.
- **Stale-publish race** (section 5): the mechanism follows from the quoted ordering caveat; its likelihood was not measured.
- The "Actions list shows no entry" statement for a path-filtered push rests on GitHub's wording about checks, one vendor article, and a branch-filter observation in this repository; no path-filtered push was observed directly in this repository (none exists in its history).
