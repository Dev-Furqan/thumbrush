import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Thumbrush - YouTube Thumbnail Design Agency",
  description: "Thumbrush creates scroll-stopping thumbnails, posters, social media posts, logos, and brand visuals.",
  openGraph: {
    title: "Thumbrush - YouTube Thumbnail Design Agency",
    description: "Thumbrush creates scroll-stopping thumbnails, posters, social media posts, logos, and brand visuals.",
    url: "/",
    siteName: "Thumbrush",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thumbrush - YouTube Thumbnail Design Agency",
    description: "Thumbrush creates scroll-stopping thumbnails, posters, social media posts, logos, and brand visuals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
