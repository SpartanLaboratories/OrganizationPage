plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ktor)
    application
}

kotlin {
    jvmToolchain(21)
}

application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}

ktor {
    fatJar {
        archiveFileName.set("organization-page-server.jar")
    }
}

dependencies {
    implementation(projects.shared)

    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.config.yaml)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.default.headers)
    implementation(libs.ktor.server.compression)
    implementation(libs.ktor.server.status.pages)
    implementation(libs.ktor.server.cors)
    implementation(libs.logback.classic)

    testImplementation(kotlin("test"))
    testImplementation(libs.ktor.server.test.host)
}

// Bundle the production web build into the server's classpath under /static so a
// single jar serves both the API and the site.
val webDistribution = configurations.dependencyScope("webDistribution")
val webDistributionFiles = configurations.resolvable("webDistributionFiles") {
    extendsFrom(webDistribution.get())
    attributes {
        attribute(Usage.USAGE_ATTRIBUTE, objects.named("web-distribution"))
    }
}

dependencies {
    webDistribution(project(":web"))
}

tasks.processResources {
    from(webDistributionFiles) {
        into("static")
    }
}
