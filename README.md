# Devfolio: HubSpot CMS React theme

A dark, developer-focused portfolio theme for HubSpot CMS, built with **React + TypeScript**, styled with **Tailwind CSS**, and deployed as a **HubSpot project** (platform `2025.2`).

## What it shows off

| Area | Where |
| --- | --- |
| React modules (server-rendered) | `components/modules/*` |
| Islands (selective hydration: `load` / `visible` / `idle`) | `components/islands/*` |
| ⌘K command palette, mobile nav | `islands/HeaderNav.tsx` |
| Post list (file-listing style) | `modules/PostList` |
| Git-log timeline (site log / career) | `modules/Timeline` |
| Typing terminal hero | `islands/TerminalTyper.tsx` |
| Filterable project grid with spotlight cards | `islands/ProjectExplorer.tsx` |
| Server-side syntax highlighter (zero client JS for tokenizing) | `shared/highlight.ts` |
| Native HubSpot form → CRM | `modules/ContactSection` |
| Theme fields → CSS variables → Tailwind colors | `fields.json`, `layouts/base.hubl.html`, `tailwind.config.js` |
| HubL layouts, global partials, drag-and-drop areas | `templates/*` |
| Blog listing + post templates with Tailwind Typography | `templates/blog-*.hubl.html` |

## Structure

```
devfolio/
├─ hsproject.json                  # project config (platformVersion 2025.2)
└─ src/theme/
   ├─ theme-hsmeta.json            # declares the theme component
   └─ devfolio-theme/
      ├─ theme.json · fields.json  # theme settings (colors, effects)
      ├─ tailwind.config.js · postcss.config.mjs
      ├─ styles/tailwind.css
      ├─ components/
      │  ├─ modules/   SiteHeader, TerminalHero, TechMarquee, StatsCounter,
      │  │             ProjectGrid, PostList, Timeline, CodeShowcase, ContactSection, SiteFooter
      │  ├─ islands/   HeaderNav, TerminalTyper, CountUp, ProjectExplorer, CodeTabs, CopyButton
      │  └─ shared/    ui.tsx, fields.tsx, highlight.ts
      └─ templates/
         ├─ layouts/base.hubl.html
         ├─ partials/  header + footer (global partials)
         ├─ home.hubl.html  page.hubl.html  blog-listing.hubl.html  blog-post.hubl.html
```

## Run it

```bash
cd ~/HubSpot/devfolio
npm install            # also installs the theme's own deps (postinstall)

npm run start          # local dev server → http://hslocal.net:3333
                       # other port: PORT=4000 npm run start
npm run typecheck      # TypeScript check
npm run deploy         # = hs project upload (builds + deploys to your sandbox)
hs project open        # see builds & deploys in HubSpot
```

Then in HubSpot: **Content → Website Pages → Create** → pick the **Devfolio** theme → **Devfolio - Home** template.
For the contact module, create a HubSpot form (Marketing → Forms) and pick it in the module's settings. To mirror estebanpayret.com, add: Name, Email, Company, Project type (Technical leadership · Architecture review · Team coaching & mentoring · Hands-on development · Something else), Budget (Under $5k · $5k–$15k · $15k–$50k · $50k+ · Not sure yet), Timeline (ASAP · Within a month · 1–3 months · Flexible) and Message.

## Versioning & releases

The version lives in **one place**: `package.json`. `scripts/sync-version.mjs` copies it to `theme.json` (what HubSpot shows), the theme's `package.json`, and `components/shared/version.ts` (rendered in the footer).

```bash
# 1. note your changes under "Unreleased" in CHANGELOG.md, then commit
# 2. cut a release: bumps the version, syncs files, commits "chore(release): vX.Y.Z", tags vX.Y.Z, deploys
npm run release:patch   # fixes            1.0.0 → 1.0.1
npm run release:minor   # new features     1.0.0 → 1.1.0
npm run release:major   # breaking changes 1.0.0 → 2.0.0

npm run version:check   # verify every file matches (also runs automatically before deploy)
```

Use **major** whenever you rename or remove a module field: pages built on the old field lose that content.

## Customising

* **Colors / radius / background effects:** Theme editor (Settings → Website → Themes → Devfolio). Every Tailwind color (`bg-accent`, `text-muted`, `border-line`…) reads from these.
* **Content:** every section is a drag-and-drop module with editable fields and sensible defaults.
* **New module:** copy a folder in `components/modules`, wrap the output in `<Section>` from `shared/ui.tsx` so Tailwind loads, and add it to a `dnd_area`.
