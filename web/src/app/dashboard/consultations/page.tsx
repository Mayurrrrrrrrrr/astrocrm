"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function ConsultationsPage() {
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/consultations/my/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setConsultations(data);
            }
        } catch (error) {
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading history...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Consultation History</h1>

            <div className="grid gap-4">
                {consultations.length === 0 ? (
                    <div className="text-center py-20 bg-surface/30 rounded-3xl border border-white/5">
                        <p className="text-gray-400 mb-4">No consultations yet.</p>
                        <a href="/astrologers" className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold shadow-glow">Start Your First Chat</a>
                    </div>
                ) : (
                    consultations.map((consultation, i) => (
                        <motion.div
                            key={consultation.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass p-6 rounded-2xl border border-glass-border flex flex-col md:flex-row justify-between items-center gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${consultation.consultation_type === 'chat' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {consultation.consultation_type === 'chat' ? '💬' : '📞'}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">
                                        {consultation.astrologer_name || `Astrologer #${consultation.astrologer}`}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(consultation.created_at).toLocaleDateString()} at {new Date(consultation.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase">Duration</p>
                                    <p className="text-white font-medium">-- min</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${consultation.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            consultation.status === 'active' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-gray-700 text-gray-400'
                                        }`}>
                                        {consultation.status.toUpperCase()}
                                    </span>
                                </div>
                                {consultation.status === 'active' && (
                                    <a href={`/chat/${consultation.id}`} className="px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-bold shadow-glow">
                                        Resume
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
