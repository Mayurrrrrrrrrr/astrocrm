"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

// Use Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function HoroscopePage() {
    const params = useParams();
    const sign = params.sign as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sign) {
            fetchHoroscope();
        }
    }, [sign]);

    const fetchHoroscope = async () => {
        try {
            const response = await fetch(`${API_URL}/kundli/horoscope/${sign}/`);
            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error(err);
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-surface p-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                <div className="glass rounded-3xl p-8 border border-glass-border relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white capitalize mb-2">{sign}</h1>
                        <p className="text-gray-400">{new Date().toDateString()}</p>
                    </div>

                    <div className="bg-surface/50 rounded-2xl p-6 mb-8 border border-white/5">
                        <p className="text-lg text-gray-200 leading-relaxed text-center italic">
                            "{data?.prediction}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-surface rounded-xl p-4 text-center">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Lucky Number</p>
                            <p className="text-3xl font-bold text-gold">{data?.lucky_number}</p>
                        </div>
                        <div className="bg-surface rounded-xl p-4 text-center">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Lucky Color</p>
                            <p className="text-2xl font-bold text-white">{data?.lucky_color}</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link href="/kundli" className="text-gray-400 hover:text-white transition-colors">
                            ← Back to all signs
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
