package com.spartanlaboratories.shared.content

import com.spartanlaboratories.shared.model.Contact
import com.spartanlaboratories.shared.model.FocusArea
import com.spartanlaboratories.shared.model.Link
import com.spartanlaboratories.shared.model.Organization
import com.spartanlaboratories.shared.model.Person
import com.spartanlaboratories.shared.model.Project
import com.spartanlaboratories.shared.model.ProjectStatus
import com.spartanlaboratories.shared.model.Subsidiary

/**
 * The single source of truth for the site's copy.
 *
 * The server serves this from `/api/organization`, and the web client bundles it
 * too so the page still renders when it is hosted as static files with no backend.
 * Edit the text here; both sides pick it up on the next build.
 */
object OrganizationContent {
    const val GITHUB_URL = "https://github.com/SpartanLaboratories"
    const val SPARTAN_GAMING_GITHUB_URL = "https://github.com/SpartanLabsGaming"

    val organization = Organization(
        name = "Spartan Laboratories",
        tagline = "Disciplined engineering for software that lasts.",
        summary = "Spartan Laboratories is an independent software organization that designs, " +
            "builds and maintains focused, dependable tools.",
        mission = "We favour small, well-understood systems over sprawling ones. Every project " +
            "we ship should be simple to run, straightforward to maintain and honest about " +
            "what it does.",
        focusAreas = listOf(
            FocusArea(
                title = "Kotlin everywhere",
                description = "One language from server to browser, with shared models so the " +
                    "contract between them is checked by the compiler.",
            ),
            FocusArea(
                title = "Automated delivery",
                description = "Every change is built, tested and deployed by pipelines rather " +
                    "than by hand.",
            ),
            FocusArea(
                title = "Open source",
                description = "We work in the open on GitHub and welcome issues and " +
                    "contributions.",
            ),
        ),
        projects = listOf(
            Project(
                name = "OrganizationPage",
                description = "This website: a Ktor backend and a Compose HTML frontend, " +
                    "sharing one Kotlin Multiplatform module.",
                tags = listOf("Kotlin", "Ktor", "Compose HTML"),
                url = "$GITHUB_URL/OrganizationPage",
                status = ProjectStatus.Active,
            ),
            Project(
                name = "WebTools",
                description = "Kotlin/JVM libraries for internet I/O: a multi-client UDP " +
                    "connection layer with NAT traversal, URL scraping, and headless-browser " +
                    "screenshots, published as three independent artifacts.",
                tags = listOf("Kotlin", "UDP", "Scraping", "Selenium"),
                url = "$GITHUB_URL/WebTools",
                status = ProjectStatus.Active,
            ),
        ),
        subsidiaries = listOf(
            Subsidiary(
                name = "Spartan Gaming",
                description = "Our games studio, building games and the servers, tools and " +
                    "graphics behind them.",
                url = SPARTAN_GAMING_GITHUB_URL,
            ),
        ),
        contact = Contact(
            people = listOf(
                Person(
                    name = "Spartak Singh",
                    role = "Owner",
                    email = "spartak@spartanlaboratories.org",
                ),
            ),
            links = listOf(
                Link(label = "GitHub", url = GITHUB_URL),
            ),
        ),
    )
}
