import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Counsel | Firm Operations",
  description: "A focused workspace for managing legal practice operations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
