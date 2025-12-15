"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Use Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function CreateKundliPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        date_of_birth: "",
        time_of_birth: "",
        place_of_birth: "",
        gender: "Male"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        try {
            const response = await fetch(`${API_URL}/kundli/generate/`, {
                method: "POST",
                headers,
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(JSON.stringify(data));
                return;
            }

            if (data.details && data.details.id) {
                router.push(`/kundli/result/${data.details.id}`);
            } else {
                toast.error("Something went wrong");
            }

        } catch (err) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-surface py-12 px-4 flex items-center justify-center">
            <div className="container max-w-5xl">
                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Left Side: Context / Value Prop */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 text-center lg:text-left space-y-6"
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Discover Your <br />
                            <span className="gradient-text">Cosmic Destiny</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Generate your precise Vedic Birth Chart (Kundli) in seconds.
                            Understand the planetary positions at the time of your birth and their influence on your life path.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <div className="px-4 py-2 glass rounded-full text-sm font-medium text-primary">✨ Accurate Calculations</div>
                            <div className="px-4 py-2 glass rounded-full text-sm font-medium text-secondary">📜 Vedic Tradition</div>
                            <div className="px-4 py-2 glass rounded-full text-sm font-medium text-gold">🔒 Private & Secure</div>
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 w-full max-w-lg"
                    >
                        <div className="glass rounded-3xl p-8 border border-glass-border shadow-2xl relative overflow-hidden">
                            {/* Decorative Glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        type="text"
                                        required
                                        className="w-full glass-input rounded-xl px-4 py-3 text-white"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Birth Date</label>
                                        <input
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleChange}
                                            type="date"
                                            required
                                            className="w-full glass-input rounded-xl px-4 py-3 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Birth Time</label>
                                        <input
                                            name="time_of_birth"
                                            value={formData.time_of_birth}
                                            onChange={handleChange}
                                            type="time"
                                            required
                                            className="w-full glass-input rounded-xl px-4 py-3 text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Birth Place</label>
                                    <input
                                        name="place_of_birth"
                                        value={formData.place_of_birth}
                                        onChange={handleChange}
                                        type="text"
                                        required
                                        className="w-full glass-input rounded-xl px-4 py-3 text-white"
                                        placeholder="City, State, Country"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Gender</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Male', 'Female', 'Other'].map((g) => (
                                            <label key={g} className="cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={g}
                                                    checked={formData.gender === g}
                                                    onChange={handleChange}
                                                    className="hidden"
                                                />
                                                <div className={`text-center py-2.5 rounded-xl border transition-all text-sm font-semibold ${formData.gender === g
                                                        ? 'bg-gradient-primary border-transparent text-white shadow-lg transform scale-105'
                                                        : 'bg-surface border-glass-border text-gray-400 hover:bg-white/5'
                                                    }`}>
                                                    {g}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 mt-2"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                            Calculating...
                                        </span>
                                    ) : "Reveal My Kundli"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
