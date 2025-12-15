"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-surface relative overflow-hidden">
            {/* Animated background stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-accent"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 8 + 4}px`,
                        }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        ✦
                    </motion.div>
                ))}
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20 relative">
                {/* Nav */}
                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-20"
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                            <span className="text-2xl text-white">✦</span>
                        </motion.div>
                        <span className="text-2xl font-bold gradient-text">AstroCRM</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/astrologers"
                            className="hidden sm:inline-block text-gray-300 hover:text-white transition-colors"
                        >
                            Astrologers
                        </Link>
                        <Link
                            href="/auth/login"
                            className="px-6 py-2.5 glass text-white rounded-full font-medium hover:border-primary/50 transition-all"
                        >
                            Login
                        </Link>
                    </div>
                </motion.nav>

                {/* Hero Content */}
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Connect with{" "}
                            <span className="gradient-text inline-block">
                                <motion.span
                                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    style={{
                                        backgroundSize: "200% auto",
                                    }}
                                >
                                    Expert Astrologers
                                </motion.span>
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
                    >
                        Get personalized consultations from verified Vedic astrologers.
                        <br className="hidden md:block" />
                        Chat, call, or get your Kundli made online.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            href="/auth/login"
                            className="group relative px-8 py-4 bg-gradient-primary text-white font-semibold rounded-xl btn-glow transition-all hover:scale-105"
                        >
                            <span className="relative z-10">Start Free Consultation</span>
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"
                            />
                        </Link>
                        <Link
                            href="/astrologers"
                            className="px-8 py-4 glass text-white font-semibold rounded-xl hover:border-primary/50 transition-all hover:scale-105"
                        >
                            Browse Astrologers
                        </Link>
                    </motion.div>

                    {/* Trust Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>100% Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>24/7 Support</span>
                        </div>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24"
                >
                    {[
                        { value: "500+", label: "Expert Astrologers", icon: "👨‍🏫" },
                        { value: "50K+", label: "Happy Customers", icon: "😊" },
                        { value: "4.8★", label: "App Rating", icon: "⭐" },
                        { value: "24/7", label: "Availability", icon: "🕐" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="glass rounded-2xl p-6 text-center group cursor-pointer"
                        >
                            <div className="text-4xl mb-2 transition-transform group-hover:scale-110">
                                {stat.icon}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                                {stat.value}
                            </div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features */}
                <div className="mt-40">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
                    >
                        Why Choose{" "}
                        <span className="gradient-text">AstroCRM</span>?
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🌟",
                                title: "Verified Astrologers",
                                desc: "All our astrologers undergo rigorous video KYC verification for your safety",
                                color: "from-yellow-500 to-orange-500",
                            },
                            {
                                icon: "💬",
                                title: "Instant Chat",
                                desc: "Connect with available astrologers in seconds and get immediate guidance",
                                color: "from-blue-500 to-cyan-500",
                            },
                            {
                                icon: "📊",
                                title: "Free Kundli",
                                desc: "Get your detailed birth chart generated instantly with accurate predictions",
                                color: "from-purple-500 to-pink-500",
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="glass rounded-2xl p-8 text-center group cursor-pointer relative overflow-hidden"
                            >
                                {/* Gradient background on hover */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                                />

                                <div className="relative z-10">
                                    <motion.div
                                        className="text-6xl mb-6 inline-block"
                                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
                >
                    {/* Decorative gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-50" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers. Get your first 5 minutes FREE!
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-block px-10 py-5 bg-gradient-primary text-white text-lg font-bold rounded-xl btn-glow transition-all hover:scale-105"
                        >
                            Talk to an Astrologer Now
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="border-t border-glass-border mt-20 py-12 relative"
            >
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-white font-semibold mb-4">AstroCRM</h3>
                            <p className="text-gray-400 text-sm">
                                Your trusted platform for authentic astrological guidance.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Services</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/astrologers" className="hover:text-primary">Chat with Astrologers</Link></li>
                                <li><Link href="/astrologers" className="hover:text-primary">Call Consultation</Link></li>
                                <li><Link href="/" className="hover:text-primary">Free Kundli</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/" className="hover:text-primary">About Us</Link></li>
                                <li><Link href="/" className="hover:text-primary">Contact</Link></li>
                                <li><Link href="/" className="hover:text-primary">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                                <li><Link href="/" className="hover:text-primary">Refund Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-gray-500 text-sm pt-8 border-t border-glass-border">
                        © 2024 AstroCRM. All rights reserved.
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}
