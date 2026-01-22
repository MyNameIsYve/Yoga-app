import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoga Session App",
  description: "Guided yoga sessions with pose images, cues, and countdown timers",
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
