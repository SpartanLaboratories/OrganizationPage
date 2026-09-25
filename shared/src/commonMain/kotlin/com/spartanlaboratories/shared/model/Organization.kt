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

@Serializable
data class Contact(
    val email: String? = null,
    val links: List<Link> = emptyList(),
)

@Serializable
data class Link(
    val label: String,
    val url: String,
)
