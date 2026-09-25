package com.spartanlaboratories.web.components

import androidx.compose.runtime.Composable
import com.spartanlaboratories.web.styles.AppStylesheet
import org.jetbrains.compose.web.attributes.ATarget
import org.jetbrains.compose.web.attributes.target
import org.jetbrains.compose.web.dom.A
import org.jetbrains.compose.web.dom.Div
import org.jetbrains.compose.web.dom.Footer
import org.jetbrains.compose.web.dom.H2
import org.jetbrains.compose.web.dom.Header
import org.jetbrains.compose.web.dom.Nav
import org.jetbrains.compose.web.dom.P
import org.jetbrains.compose.web.dom.Section
import org.jetbrains.compose.web.dom.Span
import org.jetbrains.compose.web.dom.Text
import kotlin.js.Date

/** Anchor targets for the in-page navigation. */
enum class PageSection(val id: String, val label: String) {
    About("about", "About"),
    Focus("focus", "Focus"),
    Projects("projects", "Projects"),
    Contact("contact", "Contact"),
}

@Composable
fun SiteHeader(name: String) {
    Header({ classes(AppStylesheet.header) }) {
        Div({ classes(AppStylesheet.container, AppStylesheet.headerInner) }) {
            A("#top", { classes(AppStylesheet.brand) }) {
                Span({ classes(AppStylesheet.brandMark) }) { Text("S") }
                Text(name)
            }
            Nav({ classes(AppStylesheet.nav) }) {
                PageSection.entries.forEach { section ->
                    A("#${section.id}", { classes(AppStylesheet.navLink) }) { Text(section.label) }
                }
            }
        }
    }
}

@Composable
fun PageSectionBlock(
    section: PageSection,
    title: String,
    intro: String? = null,
    content: @Composable () -> Unit,
) {
    Section({
        id(section.id)
        classes(AppStylesheet.section)
    }) {
        Div({ classes(AppStylesheet.container) }) {
            H2({ classes(AppStylesheet.sectionTitle) }) { Text(title) }
            intro?.let { P({ classes(AppStylesheet.sectionIntro) }) { Text(it) } }
            content()
        }
    }
}

@Composable
fun ExternalLink(href: String, vararg classNames: String, content: @Composable () -> Unit) {
    A(href, {
        classes(*classNames)
        target(ATarget.Blank)
        attr("rel", "noopener noreferrer")
    }) { content() }
}

@Composable
fun SiteFooter(name: String) {
    Footer({ classes(AppStylesheet.footer) }) {
        Div({ classes(AppStylesheet.container) }) {
            Text("© ${Date().getFullYear()} $name. Built with Kotlin, Ktor and Compose HTML.")
        }
    }
}
