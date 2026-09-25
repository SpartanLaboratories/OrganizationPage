package com.spartanlaboratories.server

import com.spartanlaboratories.shared.api.ApiJson
import com.spartanlaboratories.shared.api.ApiRoutes
import com.spartanlaboratories.shared.content.OrganizationContent
import com.spartanlaboratories.shared.model.Health
import com.spartanlaboratories.shared.model.Organization
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.ApplicationTestBuilder
import io.ktor.server.testing.testApplication
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ApplicationTest {
    private fun testApp(block: suspend ApplicationTestBuilder.() -> Unit) = testApplication {
        application { module() }
        block()
    }

    @Test
    fun healthReportsOk() = testApp {
        val response = client.get(ApiRoutes.HEALTH)
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("ok", ApiJson.decodeFromString(Health.serializer(), response.bodyAsText()).status)
    }

    @Test
    fun organizationMatchesSharedContent() = testApp {
        val response = client.get(ApiRoutes.ORGANIZATION)
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.contentType()!!.match(ContentType.Application.Json))
        val organization = ApiJson.decodeFromString(Organization.serializer(), response.bodyAsText())
        assertEquals(OrganizationContent.organization, organization)
    }

    @Test
    fun unknownApiPathIsNotFound() = testApp {
        assertEquals(HttpStatusCode.NotFound, client.get("${ApiRoutes.BASE}/does-not-exist").status)
    }

    @Test
    fun servesWebFrontend() = testApp {
        val response = client.get("/")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("id=\"root\""))
    }
}
