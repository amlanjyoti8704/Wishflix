import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wish — Your Personal Streaming Universe",
  description:
    "A cinematic streaming platform for your personal content, memories, and favorite moments. Beautifully curated, endlessly immersive.",
  keywords: ["streaming", "personal", "memories", "cinematic", "wish"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
