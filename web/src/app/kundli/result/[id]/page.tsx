"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Use Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function KundliResultPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchKundli();
        }
    }, [id]);

    const fetchKundli = async () => {
        try {
            const response = await fetch(`${API_URL}/kundli/${id}/`);
            if (!response.ok) throw new Error("Failed to load");
            const result = await response.json();
            setData(result);
        } catch (err) {
            toast.error("Could not load Kundli");
            router.push("/kundli");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-surface p-4 lg:p-12">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            Janma Kundli for <span className="gradient-text">{data.details.name}</span>
                        </h1>
                        <p className="text-gray-400 text-sm">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => window.print()} className="px-5 py-2 glass rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                            🖨️ Print / PDF
                        </button>
                        <button className="px-5 py-2 glass rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                            Share
                        </button>
                        <button onClick={() => router.push('/kundli/create')} className="px-5 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-glow hover:scale-105 transition-transform">
                            New Kundli
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Chart Visualization */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-5"
                    >
                        <div className="glass rounded-3xl p-1 border border-glass-border shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
                            <div className="p-6 bg-surface/40">
                                <h2 className="text-lg font-bold text-white mb-6 text-center tracking-wide uppercase text-xs text-gray-400">Lagna Chart (D1)</h2>
                                <div
                                    className="w-full aspect-square max-w-sm mx-auto bg-[#0D0B1E] rounded-xl p-2 border border-gold/20 shadow-inner"
                                    dangerouslySetInnerHTML={{ __html: data.svg }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Details & Planets */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Birth Details Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass rounded-3xl p-6 border border-glass-border"
                        >
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-secondary rounded-full"></span>
                                Birth Details
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <DetailItem label="Date" value={data.details.date_of_birth} />
                                <DetailItem label="Time" value={data.details.time_of_birth} />
                                <DetailItem label="Gender" value={data.details.gender} />
                                <DetailItem label="Location" value={data.details.place_of_birth} />
                            </div>
                        </motion.div>

                        {/* Planetary Positions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass rounded-3xl p-6 border border-glass-border"
                        >
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Planetary Positions
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {data.planets?.map((p: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + (i * 0.05) }}
                                        className="px-4 py-2 bg-surface border border-glass-border rounded-xl text-sm font-medium text-gray-200 flex items-center gap-2 hover:border-primary/50 transition-colors"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                                        {p}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* AI Insight Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
                        >
                            <h3 className="text-primary font-bold mb-2">✨ AI Insight</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Your Ascendant indicates a strong personality with a focus on leadership.
                                The Sun in the 5th house suggests creative intelligence and a playful nature.
                                (Unlock Premium for detailed life predictions)
                            </p>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}

const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-surface/50 p-3 rounded-xl border border-white/5">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-white font-medium truncate">{value}</p>
    </div>
);
