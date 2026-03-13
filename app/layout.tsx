import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daylight Inspo Board",
  description: "A visual compilation of all the posts shared in the Daylight Slack #inspo channel",
  openGraph: {
    title: "Daylight Inspo Board",
    description: "A visual compilation of all the posts shared in the Daylight Slack #inspo channel",
    images: [{ url: "/socialshare.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daylight Inspo Board",
    description: "A visual compilation of all the posts shared in the Daylight Slack #inspo channel",
    images: ["/socialshare.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Load Twitter widget.js eagerly so it's ready the moment content renders */}
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  );
}
