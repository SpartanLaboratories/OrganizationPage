// Tests of the GitHub Actions workflows. This module holds only tests: they need none of the
// site's build, and they are the deployment workflows' regression guard.
plugins {
    alias(libs.plugins.kotlin.jvm)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    testImplementation(kotlin("test"))
}

// The tests read the workflows from the repository, so the workflows are test inputs: without
// this, Gradle would treat a changed workflow as up to date and skip them.
tasks.withType<Test>().configureEach {
    inputs.dir(rootDir.resolve(".github/workflows"))
        .withPathSensitivity(PathSensitivity.RELATIVE)
        .withPropertyName("workflows")
}

// One task per test level, by package; `test` runs them all.
fun registerLevelTest(name: String, level: String) = tasks.register<Test>(name) {
    description = "Runs the $level tests of the workflows."
    group = "verification"
    testClassesDirs = sourceSets.test.get().output.classesDirs
    classpath = sourceSets.test.get().runtimeClasspath
    filter { includeTestsMatching("com.spartanlaboratories.testing.$level.*") }
}

registerLevelTest("gatingTest", "gating")
registerLevelTest("integrationTest", "integration")
