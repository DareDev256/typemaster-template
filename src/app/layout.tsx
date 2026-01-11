import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TypeMaster AI",
  description: "Learn AI/ML engineering through typing games",
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
