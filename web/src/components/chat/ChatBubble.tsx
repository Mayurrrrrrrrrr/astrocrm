"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
    message: string;
    isMyMessage: boolean;
    timestamp: string;
    senderName?: string;
}

export function ChatBubble({ message, isMyMessage, timestamp, senderName }: ChatBubbleProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"} mb-4`}
        >
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMyMessage
                        ? "bg-gradient-primary text-white rounded-br-none"
                        : "glass text-white rounded-bl-none"
                    }`}
            >
                {!isMyMessage && senderName && (
                    <p className="text-xs text-primary mb-1 font-medium">{senderName}</p>
                )}
                <p className="text-sm md:text-base leading-relaxed">{message}</p>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">
                {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </motion.div>
    );
}
