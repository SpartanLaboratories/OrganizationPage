package com.spartanlaboratories.testing.integration.server

import com.spartanlaboratories.server.module
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

/**
 * Integration: the web distribution packaged on the server's classpath carries the API reference
 * at /docs/api/ and the organization logo, and no longer carries the old favicon; the home page and
 * the bundle reference the logo and the reference link.
 */
class ApiReferenceServingTest {
    private fun testApp(block: suspend ApplicationTestBuilder.() -> Unit) = testApplication {
        application { module() }
        block()
    }

    @Test
    fun referenceIndexIsServed() = testApp {
        val response = client.get("/docs/api/")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.contentType()!!.match(ContentType.Text.Html))
        assertTrue(response.bodyAsText().contains("styles/dokka-styles.css"))
    }

    @Test
    fun moduleIndexIsServed() = testApp {
        val response = client.get("/docs/api/shared/index.html")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.contentType()!!.match(ContentType.Text.Html))
        assertTrue(response.bodyAsText().contains("styles/dokka-styles.css"))
    }

    @Test
    fun themeStylesheetIsServed() = testApp {
        val response = client.get("/docs/api/styles/dokka-styles.css")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.contentType()!!.match(ContentType.Text.CSS))
    }

    @Test
    fun logoIsServedInsideTheReference() = testApp {
        val response = client.get("/docs/api/images/spartan-laboratories-logo.png")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.contentType()!!.match(ContentType.Image.PNG))
    }

    @Test
    fun logoIsServedAtTheSiteRoot() = testApp {
        val response = client.get("/spartan-laboratories-logo.png")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.contentType()!!.match(ContentType.Image.PNG))
    }

    @Test
    fun oldSvgFaviconIsNotServed() = testApp {
        assertEquals(HttpStatusCode.NotFound, client.get("/favicon.svg").status)
    }

    @Test
    fun navigationFragmentIsServed() = testApp {
        assertEquals(HttpStatusCode.OK, client.get("/docs/api/navigation.html").status)
    }

    @Test
    fun pageUnderADashPrefixedFolderIsServed() = testApp {
        val response = client.get("/docs/api/shared/com.spartanlaboratories.shared.model/-organization/index.html")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.contentType()!!.match(ContentType.Text.Html))
    }

    @Test
    fun unknownPathUnderTheReferenceIsNotFound() = testApp {
        assertEquals(HttpStatusCode.NotFound, client.get("/docs/api/no-such-page.html").status)
    }

    @Test
    fun theReferenceIsNotUnderTheJsonApi() = testApp {
        assertEquals(HttpStatusCode.NotFound, client.get("/api/docs").status)
    }

    @Test
    fun homePageUsesTheLogoAsFavicon() = testApp {
        val response = client.get("/")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("href=\"spartan-laboratories-logo.png\""))
    }

    @Test
    fun webBundleCarriesTheHeaderLogoAndTheReferenceLink() = testApp {
        val response = client.get("/web.js")
        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("\"spartan-laboratories-logo.png\""))
        assertTrue(body.contains("\"docs/api/\""))
    }
}
