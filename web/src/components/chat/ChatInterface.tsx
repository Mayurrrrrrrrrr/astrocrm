"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { ChatBubble } from "./ChatBubble";

interface ChatInterfaceProps {
    consultationId: string;
    jwtToken: string;
    currentUserId: number;
    otherUserName: string;
    isAstrologer: boolean;
}

export function ChatInterface({
    consultationId,
    jwtToken,
    currentUserId,
    otherUserName,
    isAstrologer
}: ChatInterfaceProps) {
    const {
        messages,
        isConnected,
        isTyping,
        sendMessage,
        sendTyping
    } = useChat(consultationId, jwtToken);

    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputText.trim() || !isConnected) return;
        sendMessage(inputText);
        setInputText("");
        sendTyping(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);

        // Handle typing indicator
        sendTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => sendTyping(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-surface/50 backdrop-blur-lg rounded-3xl border border-glass-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-glass-border bg-background/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 shadow-glow-green" : "bg-red-500"}`} />
                    <div>
                        <h3 className="font-semibold text-white">{otherUserName}</h3>
                        <p className="text-xs text-gray-400">
                            {isConnected ? "Connected" : "Reconnecting..."}
                        </p>
                    </div>
                </div>
                {/* Timer Placeholder */}
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono digit-font">
                    05:00
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        Start the conversation with a greeting! 👋
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <ChatBubble
                        key={idx} // Using index as fallback key since ID might be temp
                        message={msg.message}
                        isMyMessage={msg.sender.id === currentUserId}
                        timestamp={msg.created_at}
                        senderName={msg.sender.id !== currentUserId ? otherUserName : "You"}
                    />
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-1 ml-4"
                        >
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-glass-border bg-background/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInput}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 bg-glass border border-glass-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        disabled={!isConnected}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || !isConnected}
                        className="bg-gradient-primary p-3 rounded-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
