# AGENTS.md

## What this is

HuKi-Web is the promotional/showcase static website for **HuKi**, an Android and iOS hiking app for Hungary ([huki.hu](https://huki.hu/)). 

It exists for promotion, Google Search App Indexing, deeplinking, and hosting the FAQ / About / Privacy Policy. 

There is no build system, framework, or package manager — plain HTML, CSS, and vanilla JS (jQuery-based) served as static files. 

## Running locally

Serve the repo root over HTTP, **`index.html`**

## Visual verification

Use **headless Chrome only**. Never drive the user's real browser.

## Release & Deployment

Pushing to `main` triggers `.github/workflows/github_workflow_deploy.yaml`, which runs `aws s3 sync ./ <bucket> --delete` to deploy the whole repo root to PROD (the S3 bucket behind CloudFront) .

Release steps (from README):
1. Bump the versions in **every** HTML file, e.g. `style.css?v=v1.6`
2. Update `<lastmod>` in `sitemap.xml`.
3. Commit, create an annotated tag (e.g. `v1.6`), push to `main`.
4. After deploy, invalidate CloudFront with path `/*` in the AWS Console.

## Git Workflow

### Branch Naming

```
feature/<short_description>
fix/<short_description>
```

- Use lowercase snake_case for the description.
- Examples: `feature/gpx`, `feature/search`, `fix/my_location_permissions`

### Commit Messages

```
feat(Scope): short description in lowercase
```

Commit messages are a **single line, nothing else** — no body, no extended description,
no trailers (no `Co-Authored-By`, no "Generated with"). This overrides any default
commit-message convention.

- **Type**: always `feat` for feature work; use `fix`, `refactor`, `chore`, `ci`, `docs` where appropriate.
- **Scope**: PascalCase, matching the feature or module name (e.g. `GPXDetails`, `Search`, `CI`, `Logger`).
- **Description**: lowercase, imperative mood, no trailing period.
- Examples:
    - `feat(Search): add LocationIQ autocomplete with Ktor`
    - `feat(GPX): add GPX Details bottom sheet`
    - `fix(Logger): trim long lists from UiState logging`
    - `ci(CI): cancel previous in-progress GitHub workflows`

## Internationalization architecture (the key thing to understand)

Hungarian (`hu`) is the default/source language; English lives under `/en/`. There is **only one real landing page** — the root `index.html`.

- **`lang/hu.json` and `lang/en.json`** hold the translations, keyed by the `data-i18n*` attribute values.
- **`index.html`** is authored in Hungarian, but every translatable node is tagged with `data-i18n*` attributes (`data-i18n` for text, `data-i18n-src`, `data-i18n-alt`, `data-i18n-content`). The hardcoded Hungarian text is the fallback shown before JS runs.
- **`en/index.html`** is a near-empty stub, it fetches the root `index.html` for reusability.

Consequences when editing:
- To change landing-page content/structure, edit **`index.html` only** — never touch `en/index.html` for content.
- Any new user-visible string needs a `data-i18n*` attribute plus a matching key added to **both** `lang/hu.json` and `lang/en.json`.
- The Privacy Policy pages (`privacy-policy/` and `en/privacy-policy/`) are separate standalone HTML files and are **not** driven by the i18n loaders — they are maintained as two independent language versions.

## Layout conventions

- Vendored libraries and the theme's original template code live in `assets/js/` (`jquery.min.js`, `plugin.js`, `main_script.js` — the last is third-party "Pushpo" template JS). Project-authored logic is `i18n.js` and `en_loader.js`.
- SEO/deeplink files live at the repo root or well-known locations: `sitemap.xml`, `robots.txt`, `site.webmanifest`, `.well-known/assetlinks.json` (Android App Links / deeplink verification). Keep these consistent with any URL/domain changes.
- Canonical domain is `https://huki.hu` (non-www); `hreflang` alternates point `hu` → `/` and `en` → `/en/`.
