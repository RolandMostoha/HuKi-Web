# AGENTS.md

This file provides guidance to coding agents (Claude Code, etc.) when working with code in this repository.

## What this is

HuKi-Web is the promotional/showcase static website for **HuKi**, an Android hiking-map app for Hungary ([huki.hu](https://huki.hu/)). It exists for promotion, Google Search App Indexing, deeplinking, and hosting the FAQ / About / Privacy Policy. There is no build system, framework, or package manager — plain HTML, CSS, and vanilla JS (jQuery-based) served as static files. The Android app lives in a separate repo: [RolandMostoha/HuKi-Android](https://github.com/RolandMostoha/HuKi-Android).

## Running locally

There is no build step. Serve the repo root over HTTP (do **not** open `index.html` via `file://` — the i18n/EN loaders use `fetch()` and require a real origin):

```bash
python3 -m http.server 8000   # then open http://localhost:8000/
```

## Deployment

Pushing to `main` triggers `.github/workflows/github_workflow_deploy.yaml`, which runs `aws s3 sync ./ <bucket> --delete` to deploy the whole repo root to the S3 bucket behind CloudFront. There is no staging environment — a push to `main` is a production release.

Release steps (from README):
1. Bump the CSS cache-busting versions in **every** HTML file, e.g. `style.css?v=v1.6` (this is manual and easy to forget — `index.html`, `en/index.html`, `privacy-policy/index.html`, and `en/privacy-policy/index.html` all reference the CSS).
2. Update `<lastmod>` in `sitemap.xml`.
3. Commit, create an annotated tag (e.g. `v1.6`), push to `main`.
4. After deploy, invalidate CloudFront with path `/*` in the AWS Console.

## Internationalization architecture (the key thing to understand)

Hungarian (`hu`) is the default/source language; English lives under `/en/`. There is **only one real landing page** — the root `index.html`. Understanding how EN is derived from it is essential before editing anything visible on the page.

- **`index.html`** is authored in Hungarian, but every translatable node is tagged with `data-i18n*` attributes (`data-i18n` for text, `data-i18n-src`, `data-i18n-alt`, `data-i18n-content`). The hardcoded Hungarian text is the fallback shown before JS runs.
- **`assets/js/i18n.js`** runs on every page. It picks the language from the URL (`/en/` → `en`, else `hu`), fetches `lang/<lang>.json`, and swaps the tagged attributes/text in place. On a first visit it also redirects Hungarian-default visitors with an English browser to `/en/`, and persists choice in `localStorage['lang']`.
- **`en/index.html`** is a near-empty stub. `assets/js/en_loader.js` fetches the root `index.html`, rewrites relative asset paths (prepends `../`), flips the language switcher link and canonical URL, then `document.write`s it — so the EN page never duplicates the landing markup. `i18n.js` (referenced inside the fetched HTML) then applies the `en` translations.
- **`lang/hu.json` and `lang/en.json`** hold the translations, keyed by the `data-i18n*` attribute values.

Consequences when editing:
- To change landing-page content/structure, edit **`index.html` only** — never touch `en/index.html` for content.
- Any new user-visible string needs a `data-i18n*` attribute plus a matching key added to **both** `lang/hu.json` and `lang/en.json`.
- The Privacy Policy pages (`privacy-policy/` and `en/privacy-policy/`) are separate standalone HTML files and are **not** driven by the i18n loaders — they are maintained as two independent language versions.

## Layout conventions

- Vendored libraries and the theme's original template code live in `assets/js/` (`jquery.min.js`, `plugin.js`, `main_script.js` — the last is third-party "Pushpo" template JS). Project-authored logic is `i18n.js` and `en_loader.js`.
- SEO/deeplink files live at the repo root or well-known locations: `sitemap.xml`, `robots.txt`, `site.webmanifest`, `.well-known/assetlinks.json` (Android App Links / deeplink verification). Keep these consistent with any URL/domain changes.
- Canonical domain is `https://huki.hu` (non-www); `hreflang` alternates point `hu` → `/` and `en` → `/en/`.
