"use client";

import { useState, useMemo, useEffect } from "react";
import TweetEmbed from "@/components/TweetEmbed";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import DaylightLogo from "@/components/DaylightLogo";
import { categories, inspoItems, InspoItem } from "@/data/inspo";
import oembedCache from "@/data/oembed-cache.json";

const PAGE_SIZE = 18;

// Tells widget.js to process any new twitter-tweet blockquotes on the page
function enhanceTweets() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tw = (window as any).twttr;
  if (tw?.widgets) {
    tw.widgets.load();
  } else {
    const t = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).twttr?.widgets) {
        clearInterval(t);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).twttr.widgets.load();
      }
    }, 200);
  }
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [dark, setDark] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Apply dark class to <html> so CSS vars cascade everywhere
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Enhance tweets on first mount
  useEffect(() => { enhanceTweets(); }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return inspoItems;
    return inspoItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Reset pagination when category changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  function loadMore() {
    setVisibleCount((n) => n + PAGE_SIZE);
    // Give React a tick to render the new cards, then enhance them
    setTimeout(enhanceTweets, 100);
  }

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "var(--daylight-beige)", transition: "background-color 0.2s ease" }}
    >
      {/* ── Fixed Header ──────────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--daylight-beige)",
          borderBottom: "1px solid var(--daylight-border)",
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        {/* Logo row */}
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "18px 32px 12px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <DaylightLogo size={30} />
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontFamily: "'FeatureDeck', serif",
                fontSize: 22,
                color: "var(--daylight-dark)",
                letterSpacing: "0.01em",
                display: "block",
                transition: "color 0.2s ease",
              }}
            >
              Daylight Inspo Board
            </span>
            <span
              style={{
                fontFamily: "'Aeonik', sans-serif",
                fontSize: 13,
                fontStyle: "italic",
                color: "var(--daylight-dark)",
                opacity: 0.45,
                display: "block",
                marginTop: 3,
                transition: "color 0.2s ease",
              }}
            >
              A visual compilation of all the posts shared in the Daylight Slack #inspo channel
            </span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid var(--daylight-border)",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: "var(--daylight-mid)",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--daylight-border)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            {dark ? (
              // Sun icon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="6" y2="12"/>
                <line x1="18" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
              </svg>
            ) : (
              // Moon icon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Nav tabs */}
        <nav
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            gap: 4,
            overflowX: "auto",
            paddingBottom: 0,
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontFamily: "'Aeonik', sans-serif",
                  fontWeight: isActive ? 500 : 400,
                  fontSize: 14,
                  padding: "10px 18px",
                  borderRadius: "8px 8px 0 0",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  backgroundColor: isActive
                    ? "var(--daylight-orange)"
                    : "transparent",
                  color: isActive ? "#fff" : "var(--daylight-mid)",
                  borderBottom: isActive
                    ? "2px solid var(--daylight-orange)"
                    : "2px solid transparent",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "36px 32px 80px",
        }}
      >
        {/* Category heading */}
        <div style={{ marginBottom: 28 }}>
          <p
            style={{
              fontFamily: "'Aeonik', sans-serif",
              fontSize: 13,
              color: "var(--daylight-mid)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 0.2s ease",
            }}
          >
            {visibleCount < filteredItems.length
              ? `${visibleCount} of ${filteredItems.length} posts`
              : `${filteredItems.length} post${filteredItems.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Masonry-style grid */}
        <InspoGrid items={visibleItems} dark={dark} />

        {/* Load more */}
        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            <button
              onClick={loadMore}
              style={{
                fontFamily: "'Aeonik', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                padding: "12px 32px",
                borderRadius: 10,
                border: "1px solid var(--daylight-border)",
                backgroundColor: "var(--daylight-card)",
                color: "var(--daylight-dark)",
                cursor: "pointer",
                boxShadow: "3px 4px 0 var(--card-edge)",
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translate(-1px, -1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 5px 0 var(--card-edge)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 4px 0 var(--card-edge)";
              }}
            >
              Load more ({filteredItems.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function InspoGrid({ items, dark }: { items: InspoItem[]; dark: boolean }) {
  return (
    <div
      style={{
        columns: "3 380px",
        columnGap: 20,
      }}
    >
      {items.map((item) => (
        <InspoCard key={item.id} item={item} dark={dark} />
      ))}
    </div>
  );
}

function InspoCard({ item, dark }: { item: InspoItem; dark: boolean }) {
  return (
    <div className="inspo-card-wrapper">
      <div className="inspo-card-inner">
      {/* Small top padding prevents tweet iframe border from touching card border */}
      <div style={{ padding: item.type === "tweet" ? "6px 0 0" : item.type === "youtube" ? 12 : 0 }}>
        {item.type === "tweet" ? (
          <TweetEmbed
                  url={item.url}
                  oembedHtml={(oembedCache as Record<string, string>)[item.id]}
                  dark={dark}
                />
        ) : (
          <YouTubeEmbed videoId={item.url} />
        )}
      </div>

      {(item.note || item.sharedBy) && (
        <div
          style={{
            padding: "10px 16px 12px",
            borderTop: "1px solid var(--daylight-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 8,
            transition: "border-color 0.2s ease",
          }}
        >
          {item.note ? (
            <p
              style={{
                fontFamily: "'Aeonik', sans-serif",
                fontSize: 12,
                color: "var(--daylight-mid)",
                fontStyle: "italic",
                lineHeight: 1.4,
                flex: 1,
                transition: "color 0.2s ease",
              }}
            >
              {item.note}
            </p>
          ) : (
            <span />
          )}
          {item.sharedBy && (
            <span
              style={{
                fontFamily: "'Aeonik', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                color: "var(--daylight-orange)",
                backgroundColor: "rgba(240,90,40,0.08)",
                borderRadius: 20,
                padding: "3px 9px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {item.sharedBy}
            </span>
          )}
        </div>
      )}
      </div>{/* inspo-card-inner */}
    </div>{/* inspo-card-wrapper */}
  );
}
