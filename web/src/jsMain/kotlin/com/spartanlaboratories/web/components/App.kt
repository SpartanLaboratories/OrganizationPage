package com.spartanlaboratories.web.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.spartanlaboratories.web.data.OrganizationRepository
import org.jetbrains.compose.web.dom.Main

@Composable
fun App() {
    var organization by remember { mutableStateOf(OrganizationRepository.bundled) }

    LaunchedEffect(Unit) {
        OrganizationRepository.refresh()?.let { organization = it }
    }

    SiteHeader(organization.name)
    Main {
        Hero(organization)
        About(organization)
        FocusAreas(organization.focusAreas)
        Projects(organization.projects)
        ContactSection(organization.contact)
    }
    SiteFooter(organization.name)
}
