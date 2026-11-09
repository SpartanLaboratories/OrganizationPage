plugins {
    alias(libs.plugins.kotlin.multiplatform) apply false
    alias(libs.plugins.kotlin.jvm) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.compose.compiler) apply false
    alias(libs.plugins.ktor) apply false
    alias(libs.plugins.dokka)
}

allprojects {
    group = "com.spartanlaboratories"
    version = "0.1.0"
}

// The API reference of all three modules, aggregated into one publication (build/dokka/html).
dependencies {
    dokka(project(":shared"))
    dokka(project(":server"))
    dokka(project(":web"))
}

dokka {
    moduleName.set("OrganizationPage")
}

// One place for what every Dokka configuration must carry, the root aggregate and each module alike:
// each module renders its own pages with its own configuration, and the root block styles only the
// aggregate index. The build has no convention plugin, so the hook lives here.
//  - failOnWarning: without it a broken KDoc link is only a warning and the build passes.
//  - reportUndocumented is left at its default (off): the existing declarations carry no KDoc yet.
allprojects {
    pluginManager.withPlugin("org.jetbrains.dokka") {
        extensions.configure<org.jetbrains.dokka.gradle.DokkaExtension> {
            dokkaPublications.configureEach { failOnWarning.set(true) }
            pluginsConfiguration.named<org.jetbrains.dokka.gradle.engine.plugins.DokkaHtmlPluginParameters>("html") {
                customStyleSheets.from(rootDir.resolve("docs/dokka/styles/dokka-styles.css"))
                // Dokka copies custom assets into images/; the stylesheet's logo token points there.
                customAssets.from(rootDir.resolve("docs/brand/spartan-laboratories-logo.png"))
                footerMessage.set("&copy; 2026 Spartan Laboratories")
            }
        }
    }
}

// Hands the aggregated reference to the web distribution, the same way web hands its distribution to server.
configurations.consumable("apiReferenceElements") {
    attributes { attribute(Usage.USAGE_ATTRIBUTE, objects.named("api-reference")) }
    outgoing.artifact(layout.buildDirectory.dir("dokka/html")) {
        type = ArtifactTypeDefinition.DIRECTORY_TYPE
        builtBy(tasks.named("dokkaGeneratePublicationHtml"))
    }
}
