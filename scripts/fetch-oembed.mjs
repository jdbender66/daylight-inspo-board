/**
 * Pre-fetches Twitter oEmbed HTML for all tweet items at build time.
 * Run with: node scripts/fetch-oembed.mjs
 * Output: data/oembed-cache.json
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE_PATH = join(ROOT, "data", "oembed-cache.json");

// ─── Extract tweet URLs from inspo.ts ─────────────────────────────────────────
const inspoSrc = readFileSync(join(ROOT, "data", "inspo.ts"), "utf8");

// Pull out id + url for tweet items
const itemRegex =
  /\{\s*id:\s*"([^"]+)"[\s\S]*?type:\s*"tweet"[\s\S]*?url:\s*"([^"]+)"[\s\S]*?\}/g;

const tweets = [];
let match;
while ((match = itemRegex.exec(inspoSrc)) !== null) {
  tweets.push({ id: match[1], url: match[2] });
}

console.log(`Found ${tweets.length} tweet items to process.`);

// ─── Load existing cache ───────────────────────────────────────────────────────
let cache = {};
if (existsSync(CACHE_PATH)) {
  cache = JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  console.log(`Loaded ${Object.keys(cache).length} cached entries.`);
}

// ─── Fetch missing oEmbed entries ─────────────────────────────────────────────
const missing = tweets.filter((t) => !cache[t.id]);
console.log(`Fetching ${missing.length} new entries…`);

async function fetchOembed(id, url) {
  const endpoint = `https://publish.twitter.com/oembed?url=${encodeURIComponent(
    url
  )}&omit_script=1&dnt=true&theme=light`;
  try {
    const res = await fetch(endpoint, {
      headers: { "User-Agent": "DaylightInspoBoardBuilder/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.warn(`  ✗ ${id}: HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data.html || null;
  } catch (err) {
    console.warn(`  ✗ ${id}: ${err.message}`);
    return null;
  }
}

// Process in small batches to avoid rate limiting
const BATCH_SIZE = 5;
const DELAY_MS = 300;

for (let i = 0; i < missing.length; i += BATCH_SIZE) {
  const batch = missing.slice(i, i + BATCH_SIZE);
  const results = await Promise.all(batch.map((t) => fetchOembed(t.id, t.url)));
  results.forEach((html, idx) => {
    const { id } = batch[idx];
    if (html) {
      cache[id] = html;
      console.log(`  ✓ ${id}`);
    }
  });
  if (i + BATCH_SIZE < missing.length) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

// ─── Write cache ───────────────────────────────────────────────────────────────
writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
console.log(
  `\nDone! ${Object.keys(cache).length} entries written to data/oembed-cache.json`
);
