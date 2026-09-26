package com.spartanlaboratories.shared

import com.spartanlaboratories.shared.api.ApiJson
import com.spartanlaboratories.shared.content.OrganizationContent
import com.spartanlaboratories.shared.model.Organization
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class OrganizationContentTest {
    private val organization = OrganizationContent.organization

    @Test
    fun contentRoundTripsThroughJson() {
        val json = ApiJson.encodeToString(Organization.serializer(), organization)
        assertEquals(organization, ApiJson.decodeFromString(Organization.serializer(), json))
    }

    @Test
    fun requiredCopyIsPresent() {
        assertTrue(organization.name.isNotBlank())
        assertTrue(organization.tagline.isNotBlank())
        assertTrue(organization.focusAreas.isNotEmpty())
        assertTrue(organization.focusAreas.all { it.title.isNotBlank() && it.description.isNotBlank() })
    }

    @Test
    fun contactPeopleAreComplete() {
        val people = organization.contact.people
        assertTrue(people.all { it.name.isNotBlank() && it.role.isNotBlank() })
        val emails = people.mapNotNull { it.email } + listOfNotNull(organization.contact.email)
        assertTrue(emails.all { Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$").matches(it) }, "Malformed email in $emails")
    }

    @Test
    fun allLinksAreHttps() {
        val urls = organization.projects.mapNotNull { it.url } +
            organization.subsidiaries.map { it.url } +
            organization.contact.links.map { it.url }
        assertTrue(urls.all { it.startsWith("https://") }, "Non-HTTPS link in $urls")
    }
}
