"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AstrologerDetail {
    id: number;
    user: {
        id: number;
        phone_number: string;
        first_name: string;
        last_name: string;
        profile_pic: string | null;
    };
    display_name: string;
    expertise: string[];
    languages: string[];
    experience_years: number;
    bio: string;
    chat_rate: string;
    call_rate: string;
    status: "online" | "busy" | "offline";
    rating: number;
    total_consultations: number;
    total_reviews: number;
    verification_status: string;
}

export default function AstrologerDetailPage() {
    const params = useParams();
    const id = params.id;

    const [astrologer, setAstrologer] = useState<AstrologerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchAstrologer();
        }
    }, [id]);

    const fetchAstrologer = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/accounts/astrologers/${id}/`
            );
            if (!response.ok) throw new Error("Not found");
            const data = await response.json();
            setAstrologer(data);
        } catch (err) {
            setError("Astrologer not found");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online": return "bg-green-500";
            case "busy": return "bg-yellow-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "online": return "Available Now";
            case "busy": return "In Consultation";
            default: return "Offline";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !astrologer) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">{error || "Astrologer not found"}</p>
                    <Link href="/astrologers" className="text-primary hover:underline">
                        ← Back to Astrologers
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-surface">
            {/* Header */}
            <header className="border-b border-glass-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <span className="text-xl text-white">✦</span>
                        </div>
                        <span className="text-xl font-bold text-white">AstroCRM</span>
                    </Link>
                    <Link href="/astrologers" className="text-gray-400 hover:text-white">
                        ← Back to Astrologers
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Profile Card */}
                    <div className="glass rounded-2xl p-8 mb-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-5xl font-bold shadow-glow">
                                        {astrologer.display_name?.charAt(0) || "A"}
                                    </div>
                                    <div className={`absolute -bottom-2 -right-2 px-3 py-1 ${getStatusColor(astrologer.status)} rounded-full text-white text-xs font-medium`}>
                                        {getStatusText(astrologer.status)}
                                    </div>
                                </div>

                                {/* Verified Badge */}
                                {astrologer.verification_status === "verified" && (
                                    <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Verified Astrologer</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {astrologer.display_name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={star <= Math.round(astrologer.rating) ? "text-gold" : "text-gray-600"}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-white font-medium">{astrologer.rating.toFixed(1)}</span>
                                    <span className="text-gray-400">
                                        ({astrologer.total_reviews.toLocaleString()} reviews)
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-surface rounded-xl">
                                        <p className="text-2xl font-bold text-primary">{astrologer.experience_years}</p>
                                        <p className="text-gray-400 text-sm">Years Exp.</p>
                                    </div>
                                    <div className="text-center p-4 bg-surface rounded-xl">
                                        <p className="text-2xl font-bold text-primary">{astrologer.total_consultations.toLocaleString()}</p>
                                        <p className="text-gray-400 text-sm">Consultations</p>
                                    </div>
                                    <div className="text-center p-4 bg-surface rounded-xl">
                                        <p className="text-2xl font-bold text-primary">{astrologer.total_reviews.toLocaleString()}</p>
                                        <p className="text-gray-400 text-sm">Reviews</p>
                                    </div>
                                </div>

                                {/* Expertise */}
                                <div className="mb-4">
                                    <p className="text-gray-400 text-sm mb-2">Expertise</p>
                                    <div className="flex flex-wrap gap-2">
                                        {astrologer.expertise?.map((exp) => (
                                            <span
                                                key={exp}
                                                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                            >
                                                {exp}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Languages */}
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Languages</p>
                                    <p className="text-white">{astrologer.languages?.join(", ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="glass rounded-2xl p-8 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                        <p className="text-gray-300 leading-relaxed">
                            {astrologer.bio || "No bio available."}
                        </p>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="glass rounded-2xl p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Consultation Options</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Chat Option */}
                            <div className="bg-surface rounded-xl p-6 border border-glass-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-2xl">💬</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">Chat Consultation</h3>
                                        <p className="text-gray-400 text-sm">Text-based chat</p>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-primary mb-4">
                                    ₹{astrologer.chat_rate}<span className="text-lg text-gray-400">/min</span>
                                </p>
                                <button
                                    className={`w-full py-3 rounded-xl font-medium transition-colors ${astrologer.status === "online"
                                            ? "bg-gradient-primary text-white btn-glow"
                                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                        }`}
                                    disabled={astrologer.status !== "online"}
                                >
                                    {astrologer.status === "online" ? "Start Chat" : "Currently Unavailable"}
                                </button>
                            </div>

                            {/* Call Option */}
                            <div className="bg-surface rounded-xl p-6 border border-glass-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                                        <span className="text-2xl">📞</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">Call Consultation</h3>
                                        <p className="text-gray-400 text-sm">Voice call</p>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-secondary mb-4">
                                    ₹{astrologer.call_rate}<span className="text-lg text-gray-400">/min</span>
                                </p>
                                <button
                                    className={`w-full py-3 rounded-xl font-medium transition-colors ${astrologer.status === "online"
                                            ? "bg-gradient-to-r from-secondary to-purple-600 text-white"
                                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                        }`}
                                    disabled={astrologer.status !== "online"}
                                >
                                    {astrologer.status === "online" ? "Start Call" : "Currently Unavailable"}
                                </button>
                            </div>
                        </div>

                        {/* Free Session Banner */}
                        <div className="mt-6 p-4 bg-gold/10 border border-gold/30 rounded-xl text-center">
                            <p className="text-gold font-medium">
                                🎁 First 5 minutes FREE for new users!
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
