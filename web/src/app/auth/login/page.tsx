"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 10) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8000/api/accounts/auth/send-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone_number: phoneNumber }),
            });

            const data = await response.json();
            if (response.ok) {
                // Redirect to OTP page
                window.location.href = `/auth/verify?phone=${data.phone_number}&dev=${data.otp || ""}`;
            } else {
                setError(data.error || "Failed to send OTP");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background-secondary to-surface p-4">
            {/* Decorative stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <span className="absolute top-20 left-10 text-accent text-lg animate-twinkle">✦</span>
                <span className="absolute top-40 right-20 text-secondary text-sm animate-twinkle" style={{ animationDelay: "1s" }}>✧</span>
                <span className="absolute bottom-40 left-1/4 text-primary text-xs animate-twinkle" style={{ animationDelay: "2s" }}>✦</span>
                <span className="absolute top-1/3 right-1/3 text-accent-light text-base animate-twinkle" style={{ animationDelay: "0.5s" }}>✧</span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow"
                    >
                        <span className="text-4xl text-white">✦</span>
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-2">AstroCRM</h1>
                    <p className="text-gray-400">Connect with Expert Astrologers</p>
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-white mb-1">Login / Sign Up</h2>
                    <p className="text-gray-400 text-sm mb-6">Enter your phone number to continue</p>

                    <form onSubmit={handleSendOTP}>
                        {/* Phone Input */}
                        <div className="flex mb-4">
                            <div className="bg-surface border border-glass-border rounded-l-xl px-4 flex items-center">
                                <span className="text-gray-400">+91</span>
                            </div>
                            <input
                                type="tel"
                                maxLength={10}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                placeholder="Phone Number"
                                className="flex-1 bg-surface border border-glass-border border-l-0 rounded-r-xl px-4 py-4 text-white text-lg tracking-wider outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-primary text-white font-semibold py-4 rounded-xl btn-glow transition-all disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending OTP...
                                </span>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </form>

                    {/* Terms */}
                    <p className="text-gray-500 text-xs text-center mt-6">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
