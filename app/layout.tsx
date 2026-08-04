import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orraah — Your data. Your rules",
  description: "Orraah turns your computer into a personal server — no cloud, no lockouts, no subscriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
