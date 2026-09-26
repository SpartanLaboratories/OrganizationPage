package com.spartanlaboratories.web

import com.spartanlaboratories.web.components.App
import com.spartanlaboratories.web.styles.AppStylesheet
import org.jetbrains.compose.web.css.Style
import org.jetbrains.compose.web.renderComposable

fun main() {
    renderComposable(rootElementId = "root") {
        Style(AppStylesheet)
        App()
    }
}
