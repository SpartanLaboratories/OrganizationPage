import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig

plugins {
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
