import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tProkash Web",
  description: "Bangladesh Publishing Directory",
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
