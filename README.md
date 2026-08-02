# Exquisite Biome

> Original game by **Caro Asercion** — [seaexcursion.itch.io](https://seaexcursion.itch.io),
> with art by **Si Sweetman** — [sifsweetman.com](https://sifsweetman.com).
> This is a fan-made digital tribute to the game. It contains none of the original art.

A mobile web app version of the solo journaling RPG. The app deals the cards and
keeps the journal; the prompt tables are the game's own.

**Live:** https://djessemann.github.io/exquisite-biome-tribute/

## How a game goes

Two biome cards frame the environment. Three creature cards are laid in a row —
the first describes the creature, the second gives it a distinctive feature, the
third sets its habits and personality. Answer the prompts, play out a scene, name
the species. Then the left-most card moves to the far right and the same three
cards, in their new order, describe a second creature, then a third. Finally,
one scene of all three coexisting.

## Building

No bundler. `index.html` holds all the CSS, React 18 is vendored locally as UMD
builds, and the app is one JSX file compiled to plain JS:

```
npx @babel/cli@7 --presets @babel/preset-react app.src.jsx > app.js
```

Edit `app.src.jsx`, never `app.js`. `app.js` is committed so GitHub Pages can
serve the site directly with no build step.

## Files

| | |
|---|---|
| `index.html` | markup shell + all CSS |
| `app.src.jsx` | the app — edit this |
| `app.js` | compiled output — generated, committed |
| `sw.js` | service worker (offline / PWA); bump `VERSION` on shell changes |
| `manifest.webmanifest` | PWA manifest |
| `vendor/` | React 18 UMD builds, vendored for offline use |
