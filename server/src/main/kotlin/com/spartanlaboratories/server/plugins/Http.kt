package com.spartanlaboratories.server.plugins

import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.application.log
import io.ktor.server.plugins.compression.Compression
import io.ktor.server.plugins.compression.deflate
import io.ktor.server.plugins.compression.gzip
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.plugins.defaultheaders.DefaultHeaders
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respond
import kotlinx.serialization.Serializable

@Serializable
data class ApiError(val message: String)

fun Application.configureHttp() {
    install(DefaultHeaders) {
        header("X-Content-Type-Options", "nosniff")
        header("Referrer-Policy", "strict-origin-when-cross-origin")
    }

    install(Compression) {
        gzip()
        deflate()
    }

    val corsOrigins = environment.config.propertyOrNull("site.corsOrigins")?.getString()
        ?.split(',')
        ?.map { it.trim() }
        ?.filter { it.isNotEmpty() }
        .orEmpty()
    if (corsOrigins.isNotEmpty()) {
        install(CORS) {
            allowMethod(HttpMethod.Get)
            allowHeader(HttpHeaders.ContentType)
            corsOrigins.forEach { origin ->
                val (scheme, host) = origin.split("://", limit = 2).let {
                    if (it.size == 2) it[0] to it[1] else "https" to it[0]
                }
                allowHost(host, schemes = listOf(scheme))
            }
        }
    }

    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.application.log.error("Unhandled error", cause)
            call.respond(HttpStatusCode.InternalServerError, ApiError("Internal server error"))
        }
    }
}
