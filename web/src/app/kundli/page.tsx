"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const signs = [
    { name: "Aries", icon: "♈", dates: "Mar 21 - Apr 19" },
    { name: "Taurus", icon: "♉", dates: "Apr 20 - May 20" },
    { name: "Gemini", icon: "♊", dates: "May 21 - Jun 20" },
    { name: "Cancer", icon: "♋", dates: "Jun 21 - Jul 22" },
    { name: "Leo", icon: "♌", dates: "Jul 23 - Aug 22" },
    { name: "Virgo", icon: "♍", dates: "Aug 23 - Sep 22" },
    { name: "Libra", icon: "♎", dates: "Sep 23 - Oct 22" },
    { name: "Scorpio", icon: "♏", dates: "Oct 23 - Nov 21" },
    { name: "Sagittarius", icon: "♐", dates: "Nov 22 - Dec 21" },
    { name: "Capricorn", icon: "♑", dates: "Dec 22 - Jan 19" },
    { name: "Aquarius", icon: "♒", dates: "Jan 20 - Feb 18" },
    { name: "Pisces", icon: "♓", dates: "Feb 19 - Mar 20" },
];

export default function KundliPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-surface">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6"
                >
                    Unlock Your Cosmic Blueprint
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
                >
                    Generate your detailed Janam Kundli instantly. Discover your strengths, challenges, and destiny written in the stars.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/kundli/create" className="px-8 py-4 bg-gradient-primary text-white text-lg font-bold rounded-2xl btn-glow hover:scale-105 transition-transform inline-block">
                        Generate Free Kundli
                    </Link>
                </motion.div>
            </div>

            {/* Daily Horoscope */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Daily Horoscope</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {signs.map((sign, index) => (
                        <Link href={`/kundli/horoscope/${sign.name}`} key={sign.name}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass p-6 rounded-2xl text-center hover:bg-white/5 transition-colors cursor-pointer border border-glass-border group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{sign.icon}</div>
                                <h3 className="text-white font-bold text-lg mb-1">{sign.name}</h3>
                                <p className="text-gray-500 text-xs">{sign.dates}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
