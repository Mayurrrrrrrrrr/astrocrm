"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function OTPVerifyPage() {
    const searchParams = useSearchParams();
    const phoneNumber = searchParams.get("phone") || "";
    const devOtp = searchParams.get("dev") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

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
                window.location.href = "/";
            } else {
                setError(data.error || "Invalid OTP");
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background-secondary to-surface p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                        <p className="text-gray-400">Enter the 6-digit code sent to</p>
                        <p className="text-primary font-semibold">+{phoneNumber}</p>
                    </div>

                    {devOtp && (
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 mb-6 text-center">
                            <span className="text-yellow-400 text-sm">Dev OTP: {devOtp}</span>
                        </div>
                    )}

                    {/* OTP Inputs */}
                    <div className="flex justify-between gap-2 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={`w-12 h-14 bg-surface border rounded-xl text-center text-2xl font-bold text-white outline-none transition-colors ${digit ? "border-primary bg-primary/10" : "border-glass-border"
                                    } focus:border-primary`}
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <button
                        onClick={() => handleVerify()}
                        disabled={loading}
                        className="w-full bg-gradient-primary text-white font-semibold py-4 rounded-xl btn-glow transition-all disabled:opacity-70 mb-6"
                    >
                        {loading ? "Verifying..." : "Verify & Continue"}
                    </button>

                    <div className="text-center">
                        <span className="text-gray-400 text-sm">Didn't receive the code? </span>
                        <button
                            disabled={timer > 0}
                            className={`text-sm font-semibold ${timer > 0 ? "text-gray-500" : "text-primary hover:underline"}`}
                        >
                            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                        </button>
                    </div>

                    <a href="/auth/login" className="block text-center text-gray-500 text-sm mt-4 hover:text-gray-400">
                        ← Change Phone Number
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
