import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
    title: "AstroCRM - Connect with Expert Astrologers",
    description: "Personalized astrology consultations from verified experts.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background antialiased text-foreground">
                {/* 1. Global Notification Toaster */}
                <Toaster position="top-center" toastOptions={{
                    style: { background: '#1A1730', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                }} />

                {/* 2. Persistent Navigation Bar */}
                <header className="border-b border-glass-border backdrop-blur-xl bg-background/80 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow transition-transform group-hover:scale-105 group-hover:rotate-6">
                                <span className="text-xl text-white">✦</span>
                            </div>
                            <span className="text-xl font-bold gradient-text">AstroCRM</span>
                        </Link>
                        <nav className="flex items-center gap-6">
                            <Link href="/astrologers" className="text-gray-300 hover:text-white font-medium transition-colors hidden sm:block">
                                Browse Astrologers
                            </Link>
                            <Link href="/auth/login" className="px-5 py-2 glass rounded-xl text-white text-sm font-semibold hover:bg-white/10 transition-all border border-white/10">
                                Login
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* 3. Page Content */}
                {children}
            </body>
        </html>
    );
}