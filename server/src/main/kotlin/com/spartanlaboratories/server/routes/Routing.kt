package com.spartanlaboratories.server.routes

import com.spartanlaboratories.shared.api.ApiRoutes
import com.spartanlaboratories.shared.content.OrganizationContent
import com.spartanlaboratories.shared.model.Health
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.http.content.staticResources
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.routing.routing

fun Application.configureRouting() {
    routing {
        apiRoutes()
        // The compiled web frontend, copied into the jar by the build.
        staticResources("/", "static")
    }
}

private fun Route.apiRoutes() {
    get(ApiRoutes.HEALTH) {
        call.respond(Health(status = "ok", version = ServerInfo.version))
    }
    get(ApiRoutes.ORGANIZATION) {
        call.respond(OrganizationContent.organization)
    }
    // Unknown API paths get a JSON 404 instead of falling through to static files.
    route("${ApiRoutes.BASE}/{...}") {
        handle { call.respond(HttpStatusCode.NotFound) }
    }
}

private object ServerInfo {
    val version: String = ServerInfo::class.java.`package`?.implementationVersion ?: "dev"
}
