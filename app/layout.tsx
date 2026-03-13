import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daylight Inspo Board",
  description: "Inspiration collected by the Daylight team",
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
