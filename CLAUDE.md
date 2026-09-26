# OrganizationPage

Website for the Spartan Laboratories organization. Kotlin multi-module Gradle build:
`shared` (KMP models + site copy), `server` (Ktor), `web` (Compose HTML, Kotlin/JS).
See README.md for layout and commands. `./gradlew build` compiles and tests everything.
Site text lives in `shared/src/commonMain/kotlin/com/spartanlaboratories/shared/content/OrganizationContent.kt`.

## Deployment policy (this project)

These rules apply to OrganizationPage only. They are a prototype that may later be
adopted by other projects, but they are not organization-wide policy.

1. Every change goes to a pre-production (staging) environment first and is viewed
   there in a browser before it reaches production.
2. Production changes only after a person explicitly approves it. Never add automatic,
   direct, or auto-approved production deploys, and never skip or weaken an approval check.
3. Production receives the exact build artifact that was staged. Never rebuild for
   production.
4. Staging and production deploy through the same mechanism, so staging exercises the
   real deploy path.
5. The production path fails closed: if the approval gate is missing or can't be
   verified, it refuses to deploy.
6. Staging is kept out of search results and is visibly marked as staging.
7. Any branch may be staged for review; only `main` can reach production.
8. Workflows are named after the project ("OrganizationPage Deploy", "OrganizationPage CI").
9. Deploying to a live server is outward-facing: get the owner's go-ahead before
   triggering a deploy, and have them check the staged result before shipping.

How the workflow, approval gate, hosting folders, staging marking, secrets and rollback
implement these rules: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Read it before changing
anything under `.github/`.
