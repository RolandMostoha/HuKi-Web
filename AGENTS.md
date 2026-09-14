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

Pushing to `main` triggers `.github/workflows/github_workflow_deploy.yaml`, which runs `aws s3 sync ./ <bucket> --delete` to deploy the whole repo root to PROD (the S3 bucket behind CloudFront). The workflow then re-uploads the two app link association files in `.well-known/` as `application/json`.

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

Hungarian (`hu`) is the default/source language; English lives under `/en/`. **Every page is a fully hardcoded, standalone HTML file in its own language** — there is no translation layer, no JSON string table, and no client-side rendering. The URL is the language selector.

- **`index.html`** — Hungarian landing page.
- **`en/index.html`** — English landing page: a full copy with English copy, canonical `https://huki.hu/en/`, and a `🇭🇺 HU` switcher. CSS/JS/images use `../`; favicons and the manifest stay root-absolute (`/…`), matching the root page.
- The Privacy Policy pages (`privacy-policy/` and `en/privacy-policy/`) follow the same convention.

Consequences when editing:
- **Any landing-page content or structure change must be applied to BOTH `index.html` and `en/index.html`.** Nothing enforces this — the two files drifting apart is the one real failure mode of this setup.
- Watch the per-language differences when copying a change across: relative paths (`assets/` vs `../assets/`), `<html lang>`, `<title>`, meta description, Open Graph / Twitter tags, `rel="canonical"`, the JSON-LD block, the store badge images (`google_play_badge_hu.png` / `app_store_badge_hu.svg` vs their `en` counterparts), and the language switcher link.
- `hreflang` alternates and the canonical of each page must keep pointing at the pair `/` ↔ `/en/`.

### Language preference

An inline `<script>` in the `<head>` of the two landing pages stores the visitor's language in `localStorage.lang`, and the root redirects to `en/` when the stored value is `en`. The Privacy Policy pages don't participate — they are reached by an explicit link and always serve their own language.

Three details are load-bearing:
- **Only an explicit switch records a preference.** Both switchers carry `?lang=` (`en/?lang=en` and `../?lang=hu`), and each page stores the value only when that param is present. Merely landing on `/en/` from a shared link must not convert a Hungarian visitor to English.
- **The redirect fires at most once per tab** (`sessionStorage.langRedirected`). Without the guard, pressing Back from `/en/` hits the root, which `location.replace`s straight back to `/en/` — an inescapable loop, since `replace` overwrites the history entry.
- **No `navigator.language` sniffing.** Crawlers have no `localStorage`, so Googlebot always gets the Hungarian root page — this is what keeps `/index.html` and the `www` variants out of Search Console's "Page with redirect" bucket.

## Layout conventions

- All of `assets/js/` is vendored / theme code (`jquery.min.js`, `plugin.js`, `main_script.js` — the last is third-party "Pushpo" template JS). There is no project-authored JS file; the only project JS is the inline language-preference snippet in each page's `<head>`.
- SEO/deeplink files live at the repo root or well-known locations: `sitemap.xml`, `robots.txt`, `site.webmanifest`, `.well-known/assetlinks.json` (Android App Links / deeplink verification). Keep these consistent with any URL/domain changes.
- Canonical domain is `https://huki.hu` (non-www); `hreflang` alternates point `hu` → `/` and `en` → `/en/`.
