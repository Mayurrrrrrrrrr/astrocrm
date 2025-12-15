"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Astrologer {
    id: number;
    display_name: string;
    first_name: string;
    profile_pic: string | null;
    expertise: string[];
    languages: string[];
    experience_years: number;
    chat_rate: string;
    status: "online" | "busy" | "offline";
    rating: number;
    total_consultations: number;
}

const EXPERTISE_OPTIONS = [
    "All", "Vedic", "Tarot", "Numerology", "Palmistry", "Vastu",
    "Kundli", "Horoscope", "Lal Kitab", "Career", "Finance"
];

const LANGUAGE_OPTIONS = ["All", "Hindi", "English", "Tamil", "Bengali", "Marathi", "Gujarati"];

export default function AstrologersPage() {
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [selectedExpertise, setSelectedExpertise] = useState("All");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [onlineOnly, setOnlineOnly] = useState(false);
    const [sortBy, setSortBy] = useState("-rating");

    useEffect(() => {
        fetchAstrologers();
    }, [selectedExpertise, selectedLanguage, onlineOnly, sortBy]);

    const fetchAstrologers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedExpertise !== "All") params.append("expertise", selectedExpertise);
            if (selectedLanguage !== "All") params.append("language", selectedLanguage);
            if (onlineOnly) params.append("online", "true");
            params.append("order", sortBy);

            const response = await fetch(
                `http://localhost:8000/api/accounts/astrologers/?${params.toString()}`
            );
            const data = await response.json();
            setAstrologers(data.results || []);
        } catch (err) {
            setError("Failed to load astrologers");
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
            case "online": return "Online";
            case "busy": return "Busy";
            default: return "Offline";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-surface">
            {/* Header */}
            <header className="border-b border-glass-border backdrop-blur-xl bg-background/80 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                            <span className="text-2xl text-white">✦</span>
                        </motion.div>
                        <span className="text-2xl font-bold gradient-text">AstroCRM</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/astrologers" className="text-primary font-medium hidden sm:inline-block">
                            Astrologers
                        </Link>
                        <Link href="/auth/login" className="px-5 py-2.5 glass rounded-full text-white text-sm font-medium hover:border-primary/50 transition-all">
                            Login
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Find Your <span className="gradient-text">Perfect Astrologer</span>
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Connect with verified experts for personalized guidance
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-6 mb-10 shadow-xl"
                >
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Expertise Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-gray-400 text-sm mb-1 block">Expertise</label>
                            <select
                                value={selectedExpertise}
                                onChange={(e) => setSelectedExpertise(e.target.value)}
                                className="w-full bg-surface border border-glass-border rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                            >
                                {EXPERTISE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* Language Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-gray-400 text-sm mb-1 block">Language</label>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full bg-surface border border-glass-border rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                            >
                                {LANGUAGE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-gray-400 text-sm mb-1 block">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-surface border border-glass-border rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                            >
                                <option value="-rating">Highest Rated</option>
                                <option value="chat_rate">Price: Low to High</option>
                                <option value="-chat_rate">Price: High to Low</option>
                                <option value="-experience_years">Most Experienced</option>
                            </select>
                        </div>

                        {/* Online Only Toggle */}
                        <div className="flex items-center gap-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={onlineOnly}
                                    onChange={(e) => setOnlineOnly(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-surface border border-glass-border rounded-full peer peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </label>
                            <span className="text-gray-400 text-sm">Online Only</span>
                        </div>
                    </div>
                </motion.div>

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-400">
                        {astrologers.length} astrologer{astrologers.length !== 1 ? "s" : ""} found
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-20">
                        <p className="text-red-500">{error}</p>
                        <button onClick={fetchAstrologers} className="mt-4 text-primary hover:underline">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && astrologers.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg mb-2">No astrologers found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                    </div>
                )}

                {/* Astrologer Grid */}
                {!loading && !error && astrologers.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {astrologers.map((astrologer, index) => (
                            <motion.div
                                key={astrologer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/astrologers/${astrologer.id}`}>
                                    <div className="glass rounded-2xl p-6 hover:border-primary/50 transition-colors cursor-pointer group">
                                        {/* Profile Header */}
                                        <div className="flex items-start gap-4 mb-4">
                                            {/* Avatar */}
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                                                    {astrologer.display_name?.charAt(0) || "A"}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(astrologer.status)} rounded-full border-2 border-background`}></div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                                                    {astrologer.display_name}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {astrologer.experience_years} years experience
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-gold">★</span>
                                                    <span className="text-white font-medium">{astrologer.rating.toFixed(1)}</span>
                                                    <span className="text-gray-500 text-sm">
                                                        ({astrologer.total_consultations.toLocaleString()} consultations)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expertise Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {astrologer.expertise?.slice(0, 3).map((exp) => (
                                                <span
                                                    key={exp}
                                                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                                >
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Languages */}
                                        <p className="text-gray-500 text-sm mb-4">
                                            Speaks: {astrologer.languages?.join(", ")}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                                            <div>
                                                <p className="text-gray-400 text-xs">Chat rate</p>
                                                <p className="text-primary font-bold">₹{astrologer.chat_rate}/min</p>
                                            </div>
                                            <button
                                                className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${astrologer.status === "online"
                                                    ? "bg-gradient-primary text-white"
                                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                disabled={astrologer.status !== "online"}
                                            >
                                                {astrologer.status === "online" ? "Chat Now" : getStatusText(astrologer.status)}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
