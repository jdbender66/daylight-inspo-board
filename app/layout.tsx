import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daylight Inspo Board",
  description: "A collection of inspiration from the Daylight team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
