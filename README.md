# ivault-web

The public website for [iVault](https://ivaultkh.github.io/ivault-web/): landing page, privacy policy and support page. Plain HTML and CSS, no build step, served by GitHub Pages.

| Page | URL | Used for |
|---|---|---|
| Home | https://ivaultkh.github.io/ivault-web/ | Partner Center → Properties → Website |
| Privacy | https://ivaultkh.github.io/ivault-web/privacy/ | Partner Center → Properties → Privacy policy URL |
| Support | https://ivaultkh.github.io/ivault-web/support/ | Partner Center → Properties → Support contact info |

## Publish

Settings → Pages → Build and deployment → Source: **Deploy from a branch**, Branch: **main**, folder **/ (root)**. The site is live a minute after each push to `main`.

## Preview locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Keeping the privacy policy honest

The privacy page lists every service the app talks to. When iVault gains a new provider or network call, add a row to the table in `privacy/index.html` and change the "Last updated" date in the same commit.
