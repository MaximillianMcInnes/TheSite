import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ✅ Recommended in Next 13/14+: put themeColor + colorScheme in viewport export
export const viewport: Viewport = {
  themeColor: "#05110b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "Legendary Valentine Quest",
    template: "%s · Legendary Valentine Quest",
  },
  description:
    "A retro Zelda-inspired 'Will you be my Valentine?' page with a mischievous NO button and a heroic YES.",
  applicationName: "Legendary Valentine Quest",
  metadataBase: new URL("https://example.com"), // <-- change to your real domain
  openGraph: {
    title: "Legendary Valentine Quest",
    description:
      "A retro Zelda-inspired Valentine page — press YES to accept the quest.",
    type: "website",
    url: "/",
    siteName: "Legendary Valentine Quest",
    images: [
      {
        url: "/og.png", // optional: add /public/og.png
        width: 1200,
        height: 630,
        alt: "Legendary Valentine Quest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legendary Valentine Quest",
    description:
      "Retro Zelda-inspired Valentine page — the NO button flees your cursor.",
    images: ["/og.png"], // optional
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" }, // optional: add /public/icon.png
    ],
    apple: [{ url: "/apple-touch-icon.png" }], // optional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#05110b] text-emerald-100`}
      >
        {children}
      </body>
    </html>
  );
}