# Daylight Inspo Board

A curated collection of inspiration pulled from the Daylight team's #inspo Slack channel.

## Running the app

```bash
npm run dev     # development (http://localhost:3000)
npm run build   # build for production
npm start       # serve production build
```

> **Note:** Run `npm run build` in a local directory (not on a network mount) to avoid FUSE filesystem issues. The included `.next` folder contains the latest build.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Fonts: Aeonik Pro + Feature Deck (from Claude Context)

## Adding new inspo

Edit `data/inspo.ts` and add a new entry to `inspoItems`. Supported types:
- `tweet` — paste the full X/Twitter URL
- `youtube` — paste just the video ID (the part after `?v=`)
