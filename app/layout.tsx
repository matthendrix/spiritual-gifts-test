import "./globals.css";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Spiritual Gifts Test",
  description:
    "Discover your top spiritual gifts with this 161-statement questionnaire based on the Willow Church resource.",
  openGraph: {
    title: "Spiritual Gifts Test",
    description:
      "Discover your top spiritual gifts with this 161-statement questionnaire.",
    type: "website",
    siteName: "Spiritual Gifts Test",
  },
  twitter: {
    card: "summary",
    title: "Spiritual Gifts Test",
    description:
      "Discover your top spiritual gifts with this 161-statement questionnaire.",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
