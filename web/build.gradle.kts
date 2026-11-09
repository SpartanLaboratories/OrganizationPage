import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig

plugins {
    alias(libs.plugins.dokka)
    alias(libs.plugins.kotlin.multiplatform)
    alias(libs.plugins.compose.compiler)
}

kotlin {
    js {
        browser {
            commonWebpackConfig {
                outputFileName = "web.js"
                // `./gradlew :web:jsBrowserDevelopmentRun` serves on :3000 and forwards
                // API calls to a server started with `./gradlew :server:run`.
                devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
                    port = 3000
                    proxy = mutableListOf(
                        KotlinWebpackConfig.DevServer.Proxy(
                            context = mutableListOf("/api"),
                            target = "http://localhost:8080",
                        ),
                    )
                }
            }
        }
        binaries.executable()
    }

    sourceSets {
        jsMain.dependencies {
            implementation(projects.shared)
            implementation(libs.compose.html.core)
            // html-core doesn't expose the runtime (@Composable, remember, ...) to compilation.
            implementation(libs.compose.runtime)
            implementation(libs.kotlinx.coroutines.core)
        }
    }
}

// The static site produced by `jsBrowserDistribution`. This is what gets uploaded to
// Spaceship, and what the server module embeds and serves.
val productionDistribution = layout.buildDirectory.dir("dist/js/productionExecutable")

configurations.consumable("webDistribution") {
    attributes {
        attribute(Usage.USAGE_ATTRIBUTE, objects.named("web-distribution"))
    }
    outgoing.artifact(productionDistribution) {
        type = ArtifactTypeDefinition.DIRECTORY_TYPE
        builtBy(tasks.named("jsBrowserDistribution"))
    }
}

// The API reference built at the root, placed in the distribution under docs/api so the site
// artifact, the server jar and the Docker image all serve it at /docs/api/.
val apiReferenceDep = configurations.dependencyScope("apiReference")
val apiReferenceFiles = configurations.resolvable("apiReferenceFiles") {
    extendsFrom(apiReferenceDep.get())
    attributes { attribute(Usage.USAGE_ATTRIBUTE, objects.named("api-reference")) }
}
dependencies { apiReferenceDep(project(":")) }
tasks.named<Sync>("jsBrowserDistribution") {
    from(apiReferenceFiles) { into("docs/api") }
}
// The organization logo: the header mark and the favicon, at the distribution root.
tasks.named<ProcessResources>("jsProcessResources") {
    from(rootDir.resolve("docs/brand/spartan-laboratories-logo.png"))
}
