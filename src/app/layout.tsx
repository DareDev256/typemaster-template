import type { Metadata } from "next";
import "./globals.css";
import { config } from "@/data/curriculum";

export const metadata: Metadata = {
  title: config.siteName,
  description: config.description,
  keywords: [config.siteName, "typing game", "learn by typing"],
  openGraph: {
    title: config.siteName,
    description: config.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-arcade-black antialiased">
        <div className="crt-overlay" />
        {children}
      </body>
    </html>
  );
}
