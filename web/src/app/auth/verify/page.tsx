"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function OTPVerifyPage() {
    const searchParams = useSearchParams();
    const phoneNumber = searchParams.get("phone") || "";
    const devOtp = searchParams.get("dev") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit
        if (newOtp.every(d => d) && newOtp.join("").length === 6) {
            handleVerify(newOtp.join(""));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpCode?: string) => {
        const code = otpCode || otp.join("");
        if (code.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/accounts/auth/verify-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone_number: phoneNumber, otp: code }),
            });

            const data = await response.json();
            if (response.ok) {
                // Store tokens and redirect
                localStorage.setItem("accessToken", data.tokens.access);
                localStorage.setItem("refreshToken", data.tokens.refresh);
                localStorage.setItem("user", JSON.stringify(data.user));

                toast.success("Login Successful!");
                window.location.href = "/";
            } else {
                toast.error(data.error || "Invalid OTP");
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
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

                    {/* Left: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 text-center lg:text-left hidden lg:block"
                    >
                        <h1 className="text-5xl font-bold leading-tight mb-4">
                            Almost <br />
                            <span className="gradient-text">There!</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                            We've sent a verification code to your mobile number. Enter it to access your personalized astrology dashboard.
                        </p>
                    </motion.div>

                    {/* Right: Verify Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 w-full max-w-md mx-auto"
                    >
                        <div className="glass rounded-3xl p-8 border border-glass-border shadow-2xl relative overflow-hidden">
                            {/* Glow */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                                <p className="text-gray-400">Sent to <span className="text-primary font-bold">+{phoneNumber}</span></p>
                            </div>

                            {devOtp && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-6 text-center">
                                    <span className="text-yellow-400 text-xs font-mono">Dev OTP: {devOtp}</span>
                                </div>
                            )}

                            {/* OTP Inputs */}
                            <div className="flex justify-between gap-2 mb-8">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className={`w-12 h-14 bg-surface/50 border rounded-xl text-center text-2xl font-bold text-white outline-none transition-all ${digit ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(255,107,53,0.3)]" : "border-glass-border focus:border-white/50"
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => handleVerify()}
                                disabled={loading}
                                className="w-full bg-gradient-primary text-white font-bold py-4 rounded-xl shadow-glow hover:scale-[1.02] transition-all disabled:opacity-70 mb-6"
                            >
                                {loading ? "Verifying..." : "Verify & Continue"}
                            </button>

                            <div className="text-center">
                                <span className="text-gray-400 text-sm">Didn't receive code? </span>
                                <button
                                    disabled={timer > 0}
                                    className={`text-sm font-bold ${timer > 0 ? "text-gray-600" : "text-primary hover:underline"}`}
                                >
                                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                                </button>
                            </div>

                            <a href="/auth/login" className="block text-center text-gray-500 text-xs mt-6 hover:text-white transition-colors">
                                ← Change Phone Number
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
