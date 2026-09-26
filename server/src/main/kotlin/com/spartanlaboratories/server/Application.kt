package com.spartanlaboratories.server

import com.spartanlaboratories.server.plugins.configureHttp
import com.spartanlaboratories.server.plugins.configureMonitoring
import com.spartanlaboratories.server.plugins.configureSerialization
import com.spartanlaboratories.server.routes.configureRouting
import io.ktor.server.application.Application
import io.ktor.server.netty.EngineMain

fun main(args: Array<String>) = EngineMain.main(args)

fun Application.module() {
    configureMonitoring()
    configureSerialization()
    configureHttp()
    configureRouting()
}
