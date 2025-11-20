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
  title: "TinyLink",
  description: "URL shortener app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 bg-white`}
      >
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">TinyLink</h1>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-100 p-4 text-center">
          <p>&copy; 2025 TinyLink. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
