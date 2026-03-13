"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el?: HTMLElement) => void;
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options?: object
        ) => Promise<HTMLElement | undefined>;
      };
    };
  }
}

interface TweetEmbedProps {
  url: string;
}

function extractTweetId(url: string): string {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : "";
}

let scriptLoading = false;
let scriptLoaded = false;
const pendingCallbacks: (() => void)[] = [];

function loadTwitterScript(cb: () => void) {
  if (scriptLoaded) { cb(); return; }
  pendingCallbacks.push(cb);
  if (scriptLoading) return;
  scriptLoading = true;
  const script = document.createElement("script");
  script.src = "https://platform.twitter.com/widgets.js";
  script.async = true;
  script.charset = "utf-8";
  script.onload = () => {
    scriptLoaded = true;
    pendingCallbacks.forEach((fn) => fn());
    pendingCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

export default function TweetEmbed({ url }: TweetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tweetId = extractTweetId(url);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Step 1: observe when card enters viewport
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // start loading 200px before visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Step 2: once visible, load the tweet
  useEffect(() => {
    if (!visible || !containerRef.current || !tweetId) return;

    loadTwitterScript(() => {
      if (!containerRef.current || !window.twttr?.widgets) return;
      containerRef.current.innerHTML = "";
      window.twttr.widgets
        .createTweet(tweetId, containerRef.current, {
          theme: "light",
          align: "center",
          dnt: true,
          cards: "visible",
        })
        .then((el) => {
          if (el) setLoaded(true);
        })
        .catch(() => {});
    });
  }, [visible, tweetId]);

  return (
    <div ref={wrapperRef} className="w-full">
      {/* Placeholder shown until tweet loads */}
      {!loaded && (
        <div
          style={{
            minHeight: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "3px solid #ddd5c5",
              borderTopColor: "#F05A28",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full flex justify-center"
        style={{ display: loaded ? "flex" : "none" }}
      />
    </div>
  );
}
