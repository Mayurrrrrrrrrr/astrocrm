"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

// Auth Button Component
function AuthButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("accessToken"));
    }, []);

    return isLoggedIn ? (
        <Link
            href="/dashboard"
            className="px-6 py-2 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-glow-green transition-all hover:scale-105"
        >
            Dashboard
        </Link>
    ) : (
        <Link
            href="/auth/login"
            className="px-6 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-glow transition-all hover:scale-105"
        >
            Login
        </Link>
    );
}

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-surface relative overflow-hidden">
            {/* Animated background stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-accent"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 6 + 2}px`,
                        }}
                        animate={{
                            opacity: [0.1, 0.7, 0.1],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    >
                        ✦
                    </motion.div>
                ))}
            </div>

            {/* Navigation Bar */}
            <div className="container mx-auto px-4 py-6 relative z-50">
                <nav className="flex items-center justify-between glass px-6 py-4 rounded-2xl border border-glass-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                            <span className="text-xl text-white">✦</span>
                        </div>
                        <span className="text-xl font-bold text-white tracking-wide">AstroCRM</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/astrologers" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Astrologers
                        </Link>
                        <Link href="/services" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Services
                        </Link>
                        <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Blog
                        </Link>
                        <AuthButton />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </nav>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-24 left-4 right-4 glass rounded-2xl p-6 border border-glass-border md:hidden flex flex-col gap-4"
                        >
                            <Link href="/astrologers" className="text-white text-lg font-medium p-2">Astrologers</Link>
                            <Link href="/services" className="text-white text-lg font-medium p-2">Services</Link>
                            <AuthButton />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-10 pb-20 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-6">
                            ✨ #1 Trusted Astrology Platform
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Find Clarity with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                                Vedic Wisdom
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Connect instantly with verified astrologers via chat or call.
                        Get accurate predictions about your career, love life, and future.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <AuthButton />
                        <Link
                            href="/astrologers"
                            className="w-full sm:w-auto px-8 py-4 glass border border-glass-border text-white font-semibold rounded-xl hover:bg-white/5 transition-all"
                        >
                            View All Experts
                        </Link>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
                >
                    {[
                        { value: "500+", label: "Astrologers", icon: "🧙‍♂️" },
                        { value: "50k+", label: "Users", icon: "👥" },
                        { value: "4.9", label: "Rating", icon: "⭐" },
                        { value: "24/7", label: "Support", icon: "🎧" },
                    ].map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border border-glass-border text-center hover:bg-white/5 transition-colors">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}