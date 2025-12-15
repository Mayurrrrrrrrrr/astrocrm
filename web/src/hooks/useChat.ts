import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
    id: number;
    message: string;
    sender: {
        id: number;
        first_name: string;
    };
    created_at: string;
    is_from_customer: boolean;
}

export function useChat(consultationId: string, token: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!consultationId || !token) return;

        const wsUrl = `ws://localhost:8000/ws/chat/${consultationId}/?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setIsConnected(true);
            setError(null);
            console.log('Connected to chat');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'chat_message':
                    setMessages(prev => [...prev, data.message]);
                    break;
                case 'typing_indicator':
                    setIsTyping(data.is_typing);
                    break;
                case 'connection_established':
                    console.log('Connection established:', data.message);
                    break;
                case 'error':
                    setError(data.message);
                    break;
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('Disconnected from chat');
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
            setError('Connection error');
        };

        socketRef.current = ws;

        return () => {
            ws.close();
        };
    }, [consultationId, token]);

    const sendMessage = useCallback((message: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'chat_message',
                message
            }));
        }
    }, []);

    const sendTyping = useCallback((typing: boolean) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'typing',
                is_typing: typing
            }));
        }
    }, []);

    return {
        messages,
        setMessages, // Exposed to load history
        isConnected,
        isTyping,
        error,
        sendMessage,
        sendTyping
    };
}
