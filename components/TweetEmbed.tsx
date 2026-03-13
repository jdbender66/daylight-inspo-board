"use client";

interface TweetEmbedProps {
  url: string;
  dark?: boolean;
}

/**
 * Renders a native Twitter blockquote that widget.js (loaded once in layout.tsx)
 * will automatically enhance in batch. No custom script loading, no IntersectionObserver —
 * Twitter's widget handles lazy loading natively.
 */
export default function TweetEmbed({ url, dark }: TweetEmbedProps) {
  return (
    <div
      style={{
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* eslint-disable-next-line react/no-danger */}
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
