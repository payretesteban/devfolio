# Changelog

All notable changes to the Devfolio theme are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/):

- **MAJOR**: breaking changes for editors (renamed/removed module fields, removed templates or modules; existing pages may lose content).
- **MINOR**: new modules, templates, fields or theme settings (backwards compatible).
- **PATCH**: fixes and styling tweaks.

## [Unreleased]

### Added
- Built-in `<EP/>` favicon (`assets/favicon.svg`, inlined as an SVG data URI). The brand kit favicon (Settings → Branding) still takes precedence. Fixes the `/favicon.ico` 404.

## [1.2.1] - 2026-10-08

### Fixed
- Contact form (new HubSpot form editor / v4) themed through its `--hsf-*` variables: labels, inputs, intro text and button now meet WCAG AA contrast on the dark background; the empty form-title heading is hidden.
- Code showcase: the scrollable code panel is keyboard-focusable, tabs follow the WAI-ARIA tabs pattern (arrow keys, `aria-controls`/`aria-labelledby`).

## [1.2.0] - 2026-10-08

### Added
- **Booking modal**: "Book a Free Consultation" (hero) and "Book a free 30-min call" (contact) open the calendar in a modal instead of leaving the page. Cal.com links use Cal's official embed, loaded only on first click and themed with the accent color; HubSpot Meetings and Calendly links open in the theme's own accessible `<dialog>`. Toggle per button with **Open in a modal**. Without JavaScript the buttons still work as normal links.
- Releases now move the "Unreleased" notes in this file into a dated version section automatically.

## [1.1.0] - 2026-10-08

### Added
- Theme setting **Primary accent for text** (`accent_text`, default `#A48BFF`), exposed to Tailwind as `text-accent-text`, for small accent-colored text.

### Fixed
- Color contrast (WCAG AA 4.5:1) for syntax-highlighted keywords and comments, code line numbers, the "featured" post badge, marquee markers and gradient text. Verified with axe-core: 0 contrast violations.

## [1.0.0] - 2026-10-07

### Added
- CMS React theme project (`platformVersion` 2025.2) with React + TypeScript modules and Tailwind CSS.
- Modules: Site header (⌘K command palette), Terminal hero, Tech marquee, Stats counter, Project grid ("The Lab"), Post list, Git-log timeline, Code showcase, Contact (HubSpot form), Site footer.
- Islands with selective hydration (`load` / `visible` / `idle`).
- Theme settings for colors, radius and background effects, mapped to Tailwind via CSS variables.
- Templates: Home (drag-and-drop), Flexible page, Blog listing, Blog post (Tailwind Typography).
- Initial content based on estebanpayret.com.
- Versioning: single source of truth in `package.json`, synced to `theme.json` and shown in the footer.

### Fixed
- Field names that HubSpot reserves (`label`) renamed to `text`.
- Choice field using `buttons` display without a preset switched to `radio`.
- Contact form picker now lists forms from the new form editor (v4).
