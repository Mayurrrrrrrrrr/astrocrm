"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 10) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/accounts/auth/send-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone_number: phoneNumber }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("OTP Sent!");
                // Redirect to OTP page
                window.location.href = `/auth/verify?phone=${data.phone_number}&dev=${data.otp || ""}`;
            } else {
                toast.error(data.error || "Failed to send OTP");
            }
        } catch (err) {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-surface flex items-center justify-center p-4">
            <Toaster position="top-center" />
            <div className="container max-w-5xl">
                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Left: Branding & Value Prop */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 text-center lg:text-left space-y-8"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-sm font-medium text-green-400">50+ Astrologers Online</span>
                        </div>

                        <div>
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                Connect with the <br />
                                <span className="gradient-text">Cosmic Wisdom</span>
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                                Join India's most trusted astrology platform. Get instant guidance on career, relationships, and health from verified experts.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FeatureCard icon="🔮" title="Live Consultations" desc="Chat or Call instantly" />
                            <FeatureCard icon="📜" title="Detailed Kundli" desc="Accurate Vedic charts" />
                            <FeatureCard icon="🔒" title="100% Private" desc="Secure conversations" />
                            <FeatureCard icon="✨" title="Daily Insights" desc="Personalized horoscope" />
                        </div>
                    </motion.div>

                    {/* Right: Login Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 w-full max-w-md"
                    >
                        <div className="glass rounded-3xl p-8 border border-glass-border shadow-2xl relative overflow-hidden">
                            {/* Glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                                <p className="text-gray-400">Enter your mobile number to continue</p>
                            </div>

                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">Phone Number</label>
                                    <div className="flex">
                                        <div className="bg-surface/50 border border-glass-border rounded-l-xl px-4 flex items-center border-r-0">
                                            <span className="text-white font-medium">🇮🇳 +91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                            placeholder="98765 43210"
                                            className="flex-1 glass-input rounded-r-xl px-4 py-4 text-white text-lg tracking-wider"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-primary text-white font-bold py-4 rounded-xl shadow-glow hover:scale-[1.02] transition-all disabled:opacity-70"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Sending OTP...
                                        </span>
                                    ) : (
                                        "Get OTP"
                                    )}
                                </button>
                            </form>

                            <p className="text-gray-500 text-xs text-center mt-6">
                                By continuing, you agree to our <Link href="#" className="text-primary hover:underline">Terms</Link> & <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="bg-surface/30 p-4 rounded-2xl border border-white/5 flex items-start gap-3 hover:bg-white/5 transition-colors">
            <div className="text-2xl">{icon}</div>
            <div>
                <h3 className="text-white font-bold text-sm">{title}</h3>
                <p className="text-gray-400 text-xs">{desc}</p>
            </div>
        </div>
    );
}
