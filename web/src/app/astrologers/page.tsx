"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added router
import toast from "react-hot-toast";

// --- Types ---
interface Astrologer {
    id: number;
    display_name: string;
    expertise: string[];
    languages: string[];
    experience_years: number;
    chat_rate: string;
    status: "online" | "busy" | "offline";
    rating: number;
    total_consultations: number;
}

const EXPERTISE_OPTIONS = ["All", "Vedic", "Tarot", "Numerology", "Palmistry", "Vastu", "Love"];
const LANGUAGE_OPTIONS = ["All", "English", "Hindi", "Tamil", "Marathi", "Gujarati"];

// --- Components ---

// 1. Beautiful Skeleton Loader Component
const AstrologerSkeleton = () => (
    <div className="glass rounded-2xl p-6 animate-pulse border border-white/5">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/10"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
            </div>
        </div>
        <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-white/10 rounded-full"></div>
            <div className="h-6 w-16 bg-white/10 rounded-full"></div>
        </div>
        <div className="h-10 bg-white/10 rounded-xl mt-4"></div>
    </div>
);

export default function AstrologersPage() {
    const router = useRouter(); // Initialize router
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedExpertise, setSelectedExpertise] = useState("All");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [sortBy, setSortBy] = useState("-rating");

    // Use Environment Variable for API URL (Best Practice)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    useEffect(() => {
        // Debounce fetching to prevent API spam when changing filters rapidly
        const timer = setTimeout(() => {
            fetchAstrologers();
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedExpertise, selectedLanguage, sortBy]);

    const fetchAstrologers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedExpertise !== "All") params.append("expertise", selectedExpertise);
            if (selectedLanguage !== "All") params.append("language", selectedLanguage);
            params.append("order", sortBy);

            const response = await fetch(`${API_URL}/accounts/astrologers/?${params.toString()}`);

            if (!response.ok) throw new Error("Server error");

            const data = await response.json();
            setAstrologers(data.results || []);
        } catch (err) {
            toast.error("Could not load astrologers. Is the backend running?");
            // Use dummy data for display if backend fails (Development fallback)
            setAstrologers([]);
        } finally {
            setLoading(false);
        }
    };

    // --- New Chat Handler ---
    const handleChat = async (astrologerId: number, chatRate: number) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            toast.error("Please login to start a chat");
            router.push("/auth/login");
            return;
        }

        const toastId = toast.loading("Starting secure session...");

        try {
            const response = await fetch(`${API_URL}/consultations/start/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    astrologer_id: astrologerId,
                    type: "chat"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error?.includes("Insufficient balance")) {
                    toast.error(`Insufficient balance. Required: ₹${chatRate * 5}`, { id: toastId });
                    // router.push("/wallet"); // TODO: Add wallet page
                } else {
                    toast.error(data.error || "Failed to start chat", { id: toastId });
                }
                return;
            }

            toast.success("Session started!", { id: toastId });
            router.push(`/chat/${data.id}`);

        } catch (err) {
            console.error(err);
            toast.error("Network error", { id: toastId });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-surface">
            <main className="container mx-auto px-4 py-8">
                {/* Hero Title */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Find Your <span className="gradient-text">Guide</span>
                    </motion.h1>
                    <p className="text-gray-400">Connect with 500+ verified experts instantly</p>
                </div>

                {/* Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-4 mb-8 flex flex-wrap gap-4 items-center justify-between"
                >
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <select
                            value={selectedExpertise}
                            onChange={(e) => setSelectedExpertise(e.target.value)}
                            className="bg-background-secondary text-white px-4 py-2 rounded-xl border border-glass-border outline-none focus:border-primary transition-colors"
                        >
                            {EXPERTISE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>

                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="bg-background-secondary text-white px-4 py-2 rounded-xl border border-glass-border outline-none focus:border-primary transition-colors"
                        >
                            {LANGUAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    <div className="text-sm text-gray-400">
                        Showing {astrologers.length} results
                    </div>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Show 6 Skeletons while loading
                        [...Array(6)].map((_, i) => <AstrologerSkeleton key={i} />)
                    ) : (
                        <AnimatePresence>
                            {astrologers.map((astrologer, index) => (
                                <motion.div
                                    key={astrologer.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/astrologers/${astrologer.id}`} className="block h-full">
                                        <div className="glass h-full rounded-2xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1 group relative overflow-hidden">
                                            {/* Hover Gradient Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="relative z-10">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-14 h-14 rounded-full bg-surface border border-glass-border flex items-center justify-center text-xl">
                                                            {astrologer.display_name[0]}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                                                                {astrologer.display_name}
                                                            </h3>
                                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                                <span className="text-yellow-400">★</span>
                                                                <span>{astrologer.rating}</span>
                                                                <span>•</span>
                                                                <span>{astrologer.experience_years} yrs exp</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`w-3 h-3 rounded-full ${astrologer.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-500'}`} />
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {astrologer.expertise.slice(0, 3).map(exp => (
                                                        <span key={exp} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                                                            {exp}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <p className="text-white font-semibold">
                                                        ₹{astrologer.chat_rate}<span className="text-gray-500 text-sm font-normal">/min</span>
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Prevent Link navigation
                                                            handleChat(Number(astrologer.id), Number(astrologer.chat_rate));
                                                        }}
                                                        disabled={astrologer.status !== 'online'}
                                                        className={`px-4 py-2 font-bold rounded-xl text-sm transition-colors ${astrologer.status === 'online'
                                                            ? 'bg-white text-background hover:bg-primary hover:text-white'
                                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {astrologer.status === 'online' ? 'Chat' : 'Offline'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {!loading && astrologers.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No astrologers found matching your criteria.
                    </div>
                )}
            </main>
        </div>
    );
}