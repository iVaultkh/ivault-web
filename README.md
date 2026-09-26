<p align="center">
  <a href="https://ivaultkh.github.io/ivault-web/">
    <img src="assets/logo.svg" alt="iVault" width="96" height="96">
  </a>
</p>

<h1 align="center">iVault website</h1>

<p align="center">
  Convert once. Store anywhere. Stream everywhere.<br>
  The public site for the iVault desktop app: home page, privacy policy and help.
</p>

<p align="center">
  <a href="https://ivaultkh.github.io/ivault-web/"><strong>ivaultkh.github.io/ivault-web</strong></a>
  ·
  <a href="https://ivaultkh.github.io/ivault-web/privacy/">Privacy</a>
  ·
  <a href="https://ivaultkh.github.io/ivault-web/support/">Help</a>
</p>

<p align="center">
  <a href="https://github.com/iVaultkh/ivault-web/actions/workflows/pages/pages-build-deployment"><img alt="Pages" src="https://github.com/iVaultkh/ivault-web/actions/workflows/pages/pages-build-deployment/badge.svg"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-6e51f2"></a>
</p>

---

Plain HTML, CSS and a little JavaScript. No build step, no framework, no cookies, no analytics, and no third-party requests: fonts and icons are served from this repository.

## Pages

| Page | URL | Partner Center field |
|---|---|---|
| Home | https://ivaultkh.github.io/ivault-web/ | Properties → Website |
| Privacy | https://ivaultkh.github.io/ivault-web/privacy/ | Properties → Privacy policy URL |
| Help | https://ivaultkh.github.io/ivault-web/support/ | Properties → Support contact info |

Keep these URLs stable: the Microsoft Store listing points at them.

## Layout

```
index.html             home: queue window, the five job stages, storage
privacy/index.html     privacy policy (versioned, with a changelog)
support/index.html     help: 35 answers, search, deep links
favicon.ico            16/32/48 px
site.webmanifest       name, colours and home-screen icons
assets/
  site.css             every style; tokens copied from the app's shadcn/ui theme
  fonts.css, fonts/    IBM Plex Sans + Mono (text), Bricolage Grotesque (headlines)
  theme.js             light/dark toggle, remembered; section index highlighting
  intro.js             logo intro on the home page
  support.js           help search, open-on-link, Copy link buttons
  logo.svg             app icon (charcoal tile); logo-mark.svg for light backgrounds
  icons/               favicons, apple-touch-icon, 192/512 and maskable icons
  og-image.png         1200×630 link-preview card
  brands/              provider marks from Simple Icons
```

## Preview locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Pages use relative links, so they work both locally and under `/ivault-web/` on GitHub Pages.

## Deploy

Push to `main`. GitHub Pages (Settings → Pages → Deploy from a branch → `main`, `/ (root)`) publishes it about a minute later; the badge above shows the last build. `.nojekyll` makes Pages serve the files as they are.

## Editing guide

**Design.** Colours, radius and fonts match the iVault desktop app (`ivault/apps/desktop/src/assets/index.css`): zinc neutrals and one brand violet. Change tokens at the top of `assets/site.css`, never inline. The components (button, badge, card, alert, table, accordion) follow shadcn/ui.

**Copy.** English only. Every fact about the app (labels, messages, limits) must match the app's own screens. When the app changes a label or adds a message, update `support/index.html` in the same release.

**Privacy policy.** It lists every service the app talks to. When iVault gains a provider or a network call, or handles data differently:

1. Update `privacy/index.html` (the table and any section it affects).
2. Raise the **Version** in the header and add a line to **Changes to this policy**.
3. Ship it before, or with, the app version that changes.

**Help answers.** Each answer is a `<details id="…">` inside its topic's `<section>`. The `id` becomes the deep link (`/support/#telegram`), so don't rename existing ids. Search indexes the text automatically.

**Icons.** Regenerate the PNG icons and `og-image.png` from `assets/logo.svg` whenever the logo changes. Provider marks come from [Simple Icons](https://simpleicons.org); Amazon and Microsoft don't allow theirs, so S3 and OneDrive use generic icons.

## Credits

- Fonts: [IBM Plex](https://github.com/IBM/plex) and [Bricolage Grotesque](https://github.com/ateliertriay/bricolage), SIL Open Font License 1.1.
- UI icons: [Lucide](https://lucide.dev), ISC License.
- Brand marks: [Simple Icons](https://simpleicons.org), CC0. Trademarks belong to their owners and are shown only to say which services iVault works with.

## License

The site's code and text are [MIT](LICENSE). The iVault name and logo identify the app and aren't covered by that licence.
