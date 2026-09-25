package com.spartanlaboratories.web.styles

import org.jetbrains.compose.web.css.*

private object Palette {
    val background = Color("#0b1120")
    val surface = Color("#111a2e")
    val border = Color("#1f2a44")
    val text = Color("#e2e8f0")
    val muted = Color("#94a3b8")
    val accent = Color("#f59e0b")
    val accentText = Color("#1a1204")
}

object AppStylesheet : StyleSheet() {
    init {
        "*, *::before, *::after" style {
            property("box-sizing", "border-box")
        }
        "html" style {
            property("scroll-behavior", "smooth")
            // Keeps anchored sections clear of the sticky header.
            property("scroll-padding-top", "72px")
        }
        "body" style {
            margin(0.px)
            backgroundColor(Palette.background)
            color(Palette.text)
            fontFamily("Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif")
            lineHeight("1.6")
            property("-webkit-font-smoothing", "antialiased")
        }
        "a" style {
            color(Palette.accent)
        }
        "a:focus-visible" style {
            property("outline", "2px solid ${Palette.accent}")
            property("outline-offset", "3px")
        }
        "@media (prefers-reduced-motion: reduce)" {
            "html" style { property("scroll-behavior", "auto") }
        }
    }

    val container by style {
        maxWidth(1080.px)
        property("margin", "0 auto")
        padding(0.px, 24.px)
        media(mediaMaxWidth(640.px)) {
            self style { padding(0.px, 16.px) }
        }
    }

    val header by style {
        position(Position.Sticky)
        top(0.px)
        property("z-index", 10)
        backgroundColor(rgba(11, 17, 32, 0.85))
        property("backdrop-filter", "blur(8px)")
        property("border-bottom", "1px solid ${Palette.border}")
    }

    val headerInner by style {
        display(DisplayStyle.Flex)
        alignItems(AlignItems.Center)
        justifyContent(JustifyContent.SpaceBetween)
        gap(16.px)
        height(64.px)
    }

    val brand by style {
        display(DisplayStyle.Flex)
        alignItems(AlignItems.Center)
        gap(10.px)
        color(Palette.text)
        fontWeight(700)
        property("text-decoration", "none")
        whiteSpace("nowrap")
    }

    val brandMark by style {
        display(DisplayStyle.InlineFlex)
        alignItems(AlignItems.Center)
        justifyContent(JustifyContent.Center)
        width(32.px)
        height(32.px)
        borderRadius(8.px)
        backgroundColor(Palette.accent)
        color(Palette.accentText)
        fontWeight(800)
    }

    val nav by style {
        display(DisplayStyle.Flex)
        gap(20.px)
        property("overflow-x", "auto")
        media(mediaMaxWidth(640.px)) {
            self style { gap(14.px) }
        }
    }

    val navLink by style {
        color(Palette.muted)
        fontSize(15.px)
        property("text-decoration", "none")
        self + hover style { color(Palette.text) }
    }

    val hero by style {
        padding(112.px, 0.px, 88.px)
        property(
            "background",
            "radial-gradient(1000px 420px at 15% -10%, rgba(245, 158, 11, 0.16), transparent 60%)",
        )
        media(mediaMaxWidth(640.px)) {
            self style { padding(72.px, 0.px, 56.px) }
        }
    }

    val eyebrow by style {
        margin(0.px, 0.px, 12.px)
        color(Palette.accent)
        fontWeight(600)
        fontSize(14.px)
        letterSpacing(0.12.em)
        property("text-transform", "uppercase")
    }

    val heroTitle by style {
        margin(0.px)
        maxWidth(22.em)
        fontSize(52.px)
        lineHeight("1.1")
        letterSpacing((-0.02).em)
        media(mediaMaxWidth(640.px)) {
            self style { fontSize(36.px) }
        }
    }

    val heroSummary by style {
        margin(20.px, 0.px, 0.px)
        maxWidth(40.em)
        fontSize(19.px)
        color(Palette.muted)
    }

    val heroActions by style {
        display(DisplayStyle.Flex)
        flexWrap(FlexWrap.Wrap)
        gap(12.px)
        marginTop(32.px)
    }

    /** Base button shape; combine with [buttonPrimary] or [buttonSecondary]. */
    val button by style {
        display(DisplayStyle.InlineBlock)
        padding(12.px, 20.px)
        borderRadius(10.px)
        fontWeight(600)
        property("text-decoration", "none")
        property("transition", "background-color 120ms ease, border-color 120ms ease")
    }

    val buttonPrimary by style {
        backgroundColor(Palette.accent)
        color(Palette.accentText)
        property("border", "1px solid ${Palette.accent}")
        self + hover style { backgroundColor(Color("#fbbf24")) }
    }

    val buttonSecondary by style {
        color(Palette.text)
        property("border", "1px solid ${Palette.border}")
        self + hover style { property("border-color", Palette.muted.toString()) }
    }

    val section by style {
        padding(72.px, 0.px)
        property("border-top", "1px solid ${Palette.border}")
        media(mediaMaxWidth(640.px)) {
            self style { padding(48.px, 0.px) }
        }
    }

    val sectionTitle by style {
        margin(0.px, 0.px, 12.px)
        fontSize(32.px)
        letterSpacing((-0.01).em)
    }

    val sectionIntro by style {
        margin(0.px, 0.px, 28.px)
        color(Palette.muted)
    }

    val lead by style {
        margin(0.px)
        maxWidth(42.em)
        fontSize(20.px)
        color(Palette.muted)
    }

    val grid by style {
        display(DisplayStyle.Grid)
        gridTemplateColumns("repeat(auto-fill, minmax(280px, 1fr))")
        gap(20.px)
        marginTop(24.px)
    }

    val card by style {
        display(DisplayStyle.Flex)
        flexDirection(FlexDirection.Column)
        gap(12.px)
        padding(24.px)
        borderRadius(14.px)
        backgroundColor(Palette.surface)
        property("border", "1px solid ${Palette.border}")
    }

    val cardHeader by style {
        display(DisplayStyle.Flex)
        alignItems(AlignItems.Center)
        justifyContent(JustifyContent.SpaceBetween)
        gap(12.px)
    }

    val cardTitle by style {
        margin(0.px)
        fontSize(20.px)
    }

    val cardBody by style {
        margin(0.px)
        color(Palette.muted)
        flexGrow(1)
    }

    val cardLink by style {
        fontWeight(600)
        property("text-decoration", "none")
        self + hover style { property("text-decoration", "underline") }
    }

    val status by style {
        padding(2.px, 10.px)
        borderRadius(999.px)
        fontSize(12.px)
        fontWeight(600)
        whiteSpace("nowrap")
        color(Palette.accent)
        property("border", "1px solid rgba(245, 158, 11, 0.4)")
    }

    val tags by style {
        display(DisplayStyle.Flex)
        flexWrap(FlexWrap.Wrap)
        gap(8.px)
        margin(0.px)
        padding(0.px)
        property("list-style", "none")
    }

    val tag by style {
        padding(2.px, 10.px)
        borderRadius(6.px)
        fontSize(13.px)
        color(Palette.muted)
        backgroundColor(Palette.background)
    }

    val footer by style {
        padding(32.px, 0.px)
        fontSize(14.px)
        color(Palette.muted)
        property("border-top", "1px solid ${Palette.border}")
    }
}
