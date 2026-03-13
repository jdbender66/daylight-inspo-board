"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => Promise<HTMLElement[]>;
      };
    };
  }
}

interface TweetEmbedProps {
  url: string;
  dark?: boolean;
}

/**
 * Renders a blockquote that Twitter's widget.js enhances into a full embed.
 * Calls twttr.widgets.load(container) after mount so React-rendered blockquotes
 * get processed even after widget.js has already run its initial scan.
 */
export default function TweetEmbed({ url, dark }: TweetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    function tryLoad() {
      if (cancelled) return;
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(container);
      } else {
        // widget.js not ready yet — poll until it is
        const t = setTimeout(tryLoad, 150);
        return () => clearTimeout(t);
      }
    }

    tryLoad();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div ref={containerRef} style={{ minHeight: 120 }}>
      <blockquote
        className="twitter-tweet"
        data-dnt="true"
        data-theme={dark ? "dark" : "light"}
        style={{ margin: "0 auto" }}
      >
        <a href={url}>View tweet →</a>
      </blockquote>
    </div>
  );
}
