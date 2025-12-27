import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Using Space Grotesk for display as well
const cabinet = spaceGrotesk;

export const metadata: Metadata = {
  title: "BasePulse | On-Chain Social for Base",
  description: "The first SocialFi platform native to Base. Create, engage, and earn on the decentralized social layer.",
  keywords: ["Base", "SocialFi", "Web3", "Farcaster", "NFT", "Social", "Blockchain"],
  authors: [{ name: "BasePulse Team" }],
  openGraph: {
    title: "BasePulse | On-Chain Social for Base",
    description: "The first SocialFi platform native to Base. Create, engage, and earn on the decentralized social layer.",
    type: "website",
    locale: "en_US",
    siteName: "BasePulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "BasePulse | On-Chain Social for Base",
    description: "The first SocialFi platform native to Base. Create, engage, and earn on the decentralized social layer.",
  },
  other: {
    // Farcaster Frame metadata
    "fc:frame": "vNext",
    "fc:frame:image": `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
    "fc:frame:button:1": "🚀 Launch App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": process.env.NEXT_PUBLIC_APP_URL || "https://basepulse.xyz",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F0F23",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-pulse-darker text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

