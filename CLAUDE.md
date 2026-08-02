# Project instructions

## Recompile the JSX on every change

`index.html` loads `app.js`, which is **generated** from `app.src.jsx`. Editing
`app.src.jsx` alone changes nothing that ships. After every edit, run:

```
npx @babel/cli@7 --presets @babel/preset-react app.src.jsx > app.js
```

and commit both files. Never hand-edit `app.js`.

## Service worker cache — bump it on every shipped change

The app is a PWA with a service worker (`sw.js`) that serves the cached app shell
first. If you change `index.html`, `app.js`, or any other shell asset but leave
`sw.js` untouched, clients keep seeing the **old** version even after the deploy
succeeds — a hard refresh often won't fix it on mobile/installed PWAs.

So: any time a shell asset changes, **bump `VERSION` in `sw.js`** (e.g. `eb-v1`
→ `eb-v2`) in the same change. That forces the worker to re-install, precache the
fresh shell, and purge the old cache.

## Ship changes end-to-end

`main` is what GitHub Pages deploys, so nothing is live until it's on `main`.
Take changes all the way: push the feature branch, open a PR and squash-merge it,
then confirm the "pages build and deployment" workflow ran to `success` for the
merge commit before calling it done. Report the status plainly.

The live site: https://djessemann.github.io/exquisite-biome-tribute/

## Design constraints

This app is deliberately **unstyled** — Arial, white background, black 1px boxes,
no web fonts, no animation, no imagery. Don't add visual polish unless asked.

The one exception is the red used for hearts and diamonds. That is **mechanical,
not decorative**: the "distinctive feature" table is selected by card *color*,
not suit. Keep red suits red, and keep the red/black table label on the feature
prompt so the mechanic never depends on color alone.

## Rules text

The prompt tables are Caro Asercion's text, transcribed verbatim. Where the
original addresses a table of players ("discuss with your fellow players", "take
turns"), the wording is minimally adapted for solo play — nothing else is
rewritten. Don't paraphrase the tables.
