package com.spartanlaboratories.web.components

import androidx.compose.runtime.Composable
import com.spartanlaboratories.shared.model.Contact
import com.spartanlaboratories.shared.model.FocusArea
import com.spartanlaboratories.shared.model.Organization
import com.spartanlaboratories.shared.model.Person
import com.spartanlaboratories.shared.model.Project
import com.spartanlaboratories.shared.model.Subsidiary
import com.spartanlaboratories.web.styles.AppStylesheet
import org.jetbrains.compose.web.dom.A
import org.jetbrains.compose.web.dom.Article
import org.jetbrains.compose.web.dom.Div
import org.jetbrains.compose.web.dom.H1
import org.jetbrains.compose.web.dom.H3
import org.jetbrains.compose.web.dom.Li
import org.jetbrains.compose.web.dom.P
import org.jetbrains.compose.web.dom.Section
import org.jetbrains.compose.web.dom.Span
import org.jetbrains.compose.web.dom.Text
import org.jetbrains.compose.web.dom.Ul

@Composable
fun Hero(organization: Organization) {
    Section({
        id("top")
        classes(AppStylesheet.hero)
    }) {
        Div({ classes(AppStylesheet.container) }) {
            P({ classes(AppStylesheet.eyebrow) }) { Text(organization.name) }
            H1({ classes(AppStylesheet.heroTitle) }) { Text(organization.tagline) }
            P({ classes(AppStylesheet.heroSummary) }) { Text(organization.summary) }
            Div({ classes(AppStylesheet.heroActions) }) {
                A("#${PageSection.Projects.id}", { classes(AppStylesheet.button, AppStylesheet.buttonPrimary) }) {
                    Text("See our work")
                }
                A("#${PageSection.Contact.id}", { classes(AppStylesheet.button, AppStylesheet.buttonSecondary) }) {
                    Text("Get in touch")
                }
            }
        }
    }
}

@Composable
fun About(organization: Organization) {
    PageSectionBlock(PageSection.About, "Our mission") {
        P({ classes(AppStylesheet.lead) }) { Text(organization.mission) }
    }
}

@Composable
fun FocusAreas(areas: List<FocusArea>) {
    PageSectionBlock(PageSection.Focus, "What we focus on") {
        Div({ classes(AppStylesheet.grid) }) {
            areas.forEach { area ->
                Article({ classes(AppStylesheet.card) }) {
                    H3({ classes(AppStylesheet.cardTitle) }) { Text(area.title) }
                    P({ classes(AppStylesheet.cardBody) }) { Text(area.description) }
                }
            }
        }
    }
}

@Composable
fun Projects(projects: List<Project>) {
    PageSectionBlock(PageSection.Projects, "Projects", intro = "Things we build and maintain.") {
        Div({ classes(AppStylesheet.grid) }) {
            projects.forEach { ProjectCard(it) }
        }
    }
}

@Composable
private fun ProjectCard(project: Project) {
    Article({ classes(AppStylesheet.card) }) {
        Div({ classes(AppStylesheet.cardHeader) }) {
            H3({ classes(AppStylesheet.cardTitle) }) { Text(project.name) }
            Span({ classes(AppStylesheet.status) }) { Text(project.status.label) }
        }
        P({ classes(AppStylesheet.cardBody) }) { Text(project.description) }
        if (project.tags.isNotEmpty()) {
            Ul({ classes(AppStylesheet.tags) }) {
                project.tags.forEach { tag -> Li({ classes(AppStylesheet.tag) }) { Text(tag) } }
            }
        }
        project.url?.let { url ->
            ExternalLink(url, AppStylesheet.cardLink) { Text("View project →") }
        }
    }
}

@Composable
fun Subsidiaries(subsidiaries: List<Subsidiary>) {
    PageSectionBlock(PageSection.Subsidiaries, "Subsidiaries") {
        Div({ classes(AppStylesheet.grid) }) {
            subsidiaries.forEach { subsidiary ->
                Article({ classes(AppStylesheet.card) }) {
                    H3({ classes(AppStylesheet.cardTitle) }) { Text(subsidiary.name) }
                    P({ classes(AppStylesheet.cardBody) }) { Text(subsidiary.description) }
                    ExternalLink(subsidiary.url, AppStylesheet.cardLink) { Text("Visit on GitHub →") }
                }
            }
        }
    }
}

@Composable
fun ContactSection(contact: Contact) {
    PageSectionBlock(
        PageSection.Contact,
        "Contact",
        intro = "Questions, ideas or contributions are welcome.",
    ) {
        if (contact.people.isNotEmpty()) {
            Div({ classes(AppStylesheet.grid) }) {
                contact.people.forEach { PersonCard(it) }
            }
        }
        Div({ classes(AppStylesheet.heroActions) }) {
            contact.email?.let { email ->
                A("mailto:$email", { classes(AppStylesheet.button, AppStylesheet.buttonPrimary) }) { Text(email) }
            }
            contact.links.forEach { link ->
                ExternalLink(link.url, AppStylesheet.button, AppStylesheet.buttonSecondary) { Text(link.label) }
            }
        }
    }
}

@Composable
private fun PersonCard(person: Person) {
    Article({ classes(AppStylesheet.card) }) {
        Div({ classes(AppStylesheet.cardHeader) }) {
            H3({ classes(AppStylesheet.cardTitle) }) { Text(person.name) }
            Span({ classes(AppStylesheet.status) }) { Text(person.role) }
        }
        person.email?.let { email ->
            A("mailto:$email", { classes(AppStylesheet.cardLink) }) { Text(email) }
        }
    }
}
