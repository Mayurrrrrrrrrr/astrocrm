import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AstroCRM - Connect with Expert Astrologers",
    description: "Get personalized astrology consultations from verified experts. Chat, call, and get your Kundli made online.",
    keywords: "astrology, kundli, horoscope, vedic astrology, tarot, numerology",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background antialiased">
                {children}
            </body>
        </html>
    );
}
