"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // In a real app, these would come from AuthContext
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [consultation, setConsultation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage for demo purposes
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (!storedToken || !storedUser) {
            router.push("/auth/login");
            return;
        }

        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Fetch consultation details
        fetchConsultation(id, storedToken);
    }, [id, router]);

    const fetchConsultation = async (consultationId: string, authToken: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/consultations/${consultationId}/`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) throw new Error("Consultation not found");
            const data = await response.json();
            setConsultation(data);
        } catch (err) {
            console.error(err);
            // Handle error (redirect back or show error)
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!consultation || !user) return null;

    // Determine the "other" person
    const isAstrologer = user.role === 'astrologer'; // Assuming role is available
    const otherUser = isAstrologer ? consultation.customer : consultation.astrologer;
    const otherName = `${otherUser.first_name} ${otherUser.last_name || ''}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-surface p-4 md:p-8">
            <div className="max-w-4xl mx-auto h-[85vh]">
                <ChatInterface
                    consultationId={id}
                    jwtToken={token!}
                    currentUserId={user.id}
                    otherUserName={otherName}
                    isAstrologer={user.id === consultation.astrologer.id}
                />
            </div>
        </div>
    );
}
