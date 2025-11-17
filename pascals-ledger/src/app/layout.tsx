import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pascal's Ledger - Cryptographic Identity Verification",
  description: "Future-proof your identity with cryptographic hashing for ancestor simulation. Generate BLAKE3, SHA-256, and quantum-resistant signatures with environmental entropy.",
  keywords: ["cryptographic hashing", "identity verification", "ancestor simulation", "BLAKE3", "SHA-256", "quantum-resistant"],
  authors: [{ name: "Pascal's Ledger" }],
  manifest: "/manifest.json",
  themeColor: "#1e40af",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
