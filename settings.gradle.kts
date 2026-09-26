rootProject.name = "OrganizationPage"

pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        google()
    }
}

dependencyResolutionManagement {
    repositories {
        mavenCentral()
        google()
    }
}

enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

// shared: models, API contract and site content used by both sides (Kotlin Multiplatform: JVM + JS)
include(":shared")
// server: Ktor backend that exposes the JSON API and serves the compiled web bundle
include(":server")
// web: Compose HTML (Kotlin/JS) frontend
include(":web")
