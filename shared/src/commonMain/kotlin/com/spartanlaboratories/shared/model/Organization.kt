package com.spartanlaboratories.shared.model

import kotlinx.serialization.Serializable

/**
 * Everything the public site needs to render the organization page.
 *
 * The server exposes this as JSON and the web client renders it, so both sides
 * agree on the shape at compile time.
 */
@Serializable
data class Organization(
    val name: String,
    val tagline: String,
    val summary: String,
    val mission: String,
    val focusAreas: List<FocusArea>,
    val projects: List<Project>,
    val subsidiaries: List<Subsidiary> = emptyList(),
    val contact: Contact,
)

@Serializable
data class FocusArea(
    val title: String,
    val description: String,
)

@Serializable
data class Project(
    val name: String,
    val description: String,
    val tags: List<String> = emptyList(),
    val url: String? = null,
    val status: ProjectStatus = ProjectStatus.Active,
)

@Serializable
enum class ProjectStatus(val label: String) {
    Active("Active"),
    InDevelopment("In development"),
    Archived("Archived"),
}

/** A company owned by the organization, with its own presence. */
@Serializable
data class Subsidiary(
    val name: String,
    val description: String,
    val url: String,
)

@Serializable
data class Contact(
    val email: String? = null,
    val people: List<Person> = emptyList(),
    val links: List<Link> = emptyList(),
)

/** Someone visitors can reach directly, shown in the contact section. */
@Serializable
data class Person(
    val name: String,
    val role: String,
    val email: String? = null,
)

@Serializable
data class Link(
    val label: String,
    val url: String,
)
