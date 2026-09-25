package com.spartanlaboratories.web.data

import com.spartanlaboratories.shared.api.ApiJson
import com.spartanlaboratories.shared.api.ApiRoutes
import com.spartanlaboratories.shared.content.OrganizationContent
import com.spartanlaboratories.shared.model.Organization
import kotlinx.browser.window
import kotlinx.coroutines.await

/**
 * Supplies the organization content to the UI.
 *
 * The content compiled into the bundle is shown immediately, so the page works when
 * it is deployed as plain static files. When the Ktor server is hosting the page,
 * [refresh] replaces it with the live copy from the API.
 */
object OrganizationRepository {
    val bundled: Organization get() = OrganizationContent.organization

    /** Returns the server's copy, or `null` when no API is reachable (static hosting). */
    suspend fun refresh(): Organization? = try {
        val response = window.fetch(ApiRoutes.ORGANIZATION).await()
        if (response.ok) {
            ApiJson.decodeFromString(Organization.serializer(), response.text().await())
        } else {
            null
        }
    } catch (e: Throwable) {
        null
    }
}
