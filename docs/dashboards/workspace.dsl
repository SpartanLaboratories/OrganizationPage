// OrganizationPage — C4 model as code (Structurizr DSL): the repository's systems and how they interact. Source of truth for docs/dashboards/index.html.
// As-is at OrganizationPage build/issue-8-no-deploy-docs-only dbfa430 (2026-11-09), the three Gradle modules at 0.1.0. Code is authoritative on any conflict.
workspace "OrganizationPage" "The Spartan Laboratories website and the deployment system that puts it live." {

    !identifiers hierarchical

    model {
        visitor    = person "Visitor" "Reads the organization's site in a browser."
        maintainer = person "Maintainer" "Pushes changes, checks the staging site in a browser and approves production."
        github     = softwareSystem "GitHub" "Runs the workflows and holds the production environment's required reviewers." "External"
        spaceship  = softwareSystem "Spaceship hosting" "Shared web hosting reached over FTPS: the production, staging and documents folders." "External"

        repo = softwareSystem "OrganizationPage" "The Spartan Laboratories website: three Gradle modules and the workflows that deploy them." {
            shared = container "shared" "Data models, API routes, JSON configuration and the site copy." "Kotlin Multiplatform (JVM + JS) · 0.1.0"
            server = container "server" "The JSON API under /api and the compiled frontend, as one runnable jar." "Ktor on Netty, Kotlin/JVM · 0.1.0"
            web    = container "web" "The browser UI, built to a static site of index.html and web.js." "Compose HTML, Kotlin/JS · 0.1.0"
            deploy = container "deployment" "The site path through staging and approval to production, and the docs/ path straight to the documents folder." "GitHub Actions workflows and a composite action"
        }

        visitor -> repo.web "Reads the site in a browser"
        maintainer -> repo.deploy "Pushes, checks staging, approves production"
        repo.web -> repo.shared "Renders its models and bundled copy"
        repo.server -> repo.shared "Serves its models and copy"
        repo.server -> repo.web "Embeds its production bundle under /static"
        repo.web -> repo.server "Fetches /api/organization when served by it"
        repo.deploy -> repo.web "Builds and uploads its production bundle"
        repo.deploy -> repo.server "Runs its tests; CI builds its jar"
        repo.deploy -> repo.shared "Runs its tests"
        repo.deploy -> github "Runs on Actions; reads the production environment's protection rules"
        repo.deploy -> spaceship "Uploads staging, production and docs/ over FTPS"
    }

    views {
        systemContext repo "Context" "OrganizationPage and who touches it, as built at build/issue-8-no-deploy-docs-only dbfa430." {
            include *
            autoLayout lr
        }
        container repo "Containers" "The systems in the repository, as built at build/issue-8-no-deploy-docs-only dbfa430." {
            include *
            autoLayout lr
        }
        dynamic repo "SitePush" "A push to main that changes the site, from build to production, as built at build/issue-8-no-deploy-docs-only dbfa430." {
            maintainer -> repo.deploy "push to main, outside docs/"
            repo.deploy -> repo.web "jsBrowserDistribution, then the site artifact"
            repo.deploy -> spaceship "upload to the staging folder"
            maintainer -> repo.deploy "approve the production environment"
            repo.deploy -> github "read the environment's protection rules"
            repo.deploy -> spaceship "upload the same artifact to production"
            autoLayout lr
        }
        styles {
            element "Person"          { shape person  background #08427b color #ffffff }
            element "Software System" { background #1168bd color #ffffff }
            element "External"        { background #999999 color #ffffff }
            element "Container"       { background #438dd5 color #ffffff }
            element "Component"       { background #85bbf0 color #000000 }
            element "Internal"        { background #c6dcf5 color #000000 }
            element "Standalone"      { background #eeeeee color #000000 border dotted }
            element "Planned"         { background #ffffff color #666666 border dashed opacity 60 }
        }
    }
}
