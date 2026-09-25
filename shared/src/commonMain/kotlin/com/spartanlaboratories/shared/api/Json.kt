package com.spartanlaboratories.shared.api

import kotlinx.serialization.json.Json

/** JSON configuration used on both sides of the wire. */
val ApiJson: Json = Json {
    ignoreUnknownKeys = true
    encodeDefaults = true
    explicitNulls = false
}
