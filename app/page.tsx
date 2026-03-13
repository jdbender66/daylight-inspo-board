"use client";

import { useState, useMemo } from "react";
import TweetEmbed from "@/components/TweetEmbed";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import DaylightLogo from "@/components/DaylightLogo";
import { categories, inspoItems, InspoItem } from "@/data/inspo";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return inspoItems;
    return inspoItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "var(--daylight-beige)" }}
    >
      {/* ── Fixed Header ──────────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--daylight-beige)",
          borderBottom: "1px solid var(--daylight-border)",
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
          <span
            style={{
              fontFamily: "'FeatureDeck', serif",
              fontSize: 22,
              color: "var(--daylight-dark)",
              letterSpacing: "0.01em",
            }}
          >
            Daylight Inspo Board
          </span>
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
            }}
          >
            {filteredItems.length} post{filteredItems.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Masonry-style grid */}
        <InspoGrid items={filteredItems} />
      </main>
    </div>
  );
}

function InspoGrid({ items }: { items: InspoItem[] }) {
  return (
    <div
      style={{
        columns: "3 380px",
        columnGap: 20,
      }}
    >
      {items.map((item) => (
        <InspoCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function InspoCard({ item }: { item: InspoItem }) {
  return (
    <div
      style={{
        breakInside: "avoid",
        marginBottom: 20,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#fff",
        border: "1px solid var(--daylight-border)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ padding: item.type === "youtube" ? 12 : 0 }}>
        {item.type === "tweet" ? (
          <TweetEmbed url={item.url} />
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
    </div>
  );
}
