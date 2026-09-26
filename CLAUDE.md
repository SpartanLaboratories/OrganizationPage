# OrganizationPage

Website for the Spartan Laboratories organization. Kotlin multi-module Gradle build:
`shared` (KMP models + site copy), `server` (Ktor), `web` (Compose HTML, Kotlin/JS).
See README.md for layout and commands. `./gradlew build` compiles and tests everything.

## Deployment policy

Every change is deployed to a pre-production environment and checked there before it
reaches production. For this repository:

- Pushes to `main` deploy to **staging** automatically (`.github/workflows/deploy-spaceship.yml`).
- **Production** is only updated by the same workflow's `production` job, after a
  reviewer approves the `production` environment. It deploys the artifact that was
  staged, never a fresh build.
- Do not add any path that changes production without passing through staging and that
  approval: no direct production deploys, no auto-approval, no skipping the reviewer
  check in the `production` job.
- Staging and production must deploy through the same mechanism
  (`.github/actions/spaceship-deploy`) so staging tests the real deploy path.
