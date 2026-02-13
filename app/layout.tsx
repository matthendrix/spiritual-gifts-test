import "./globals.css";

export const metadata = {
  title: "Spiritual Gifts Test",
  description:
    "Take the Willow Church-based spiritual gift questionnaire and get a top gift recommendation in one clean, cinematic Next.js experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
