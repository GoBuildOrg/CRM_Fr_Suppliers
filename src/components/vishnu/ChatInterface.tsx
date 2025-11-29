"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic, Loader2, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    sources?: string[];
}

const suggestedPrompts = [
    "How do I manage suppliers in a construction CRM?",
    "What's the typical quotation workflow?",
    "Best practices for material tracking",
    "How to track project milestones?",
    "Explain the order management process",
];

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "👋 Hello! I'm Vishnu, your intelligent construction CRM assistant. I can help you with:\n\n• Construction industry best practices\n• Supplier and project management\n• Quotation and estimation workflows\n• Material tracking and inventory\n• Document analysis (upload PDFs, text files, etc.)\n\nWhat would you like to know?",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentQuery = input;
        setInput("");
        setIsTyping(true);

        try {
            // Call the actual API
            const response = await fetch('/api/vishnu/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: currentQuery }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            const documentSources = data.sources?.documents?.map((s: any) => s.fileName) || [];
            const knowledgeSources = data.sources?.knowledge?.map((s: any) => s.category) || [];
            const allSources = [...documentSources, ...knowledgeSources];

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "I apologize, but I couldn't generate a response.",
                timestamp: new Date(),
                sources: allSources
            };
            console.log(data.response);
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Query error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I encountered an error processing your request. Please check:\n\n1. Your Pinecone API key is configured in .env.local\n2. Your OpenAI API key is configured\n3. The Pinecone index 'gobuild-crm-rag' exists\n\nError: " + (error instanceof Error ? error.message : 'Unknown error'),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handlePromptClick = (prompt: string) => {
        setInput(prompt);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {message.role === "assistant" && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                            )}

                            <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                                <div
                                    className={`rounded-2xl px-4 py-3 ${message.role === "user"
                                        ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white"
                                        : "bg-card/50 backdrop-blur-sm border border-border/50"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {message.content}
                                    </p>
                                </div>

                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {message.sources.map((source, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2 py-1 rounded-lg bg-muted/50 text-muted-foreground"
                                            >
                                                📄 {source}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="text-xs text-muted-foreground mt-1 px-1" suppressHydrationWarning>
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {message.role === "user" && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                    className="w-2 h-2 rounded-full bg-primary"
                                />
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                    className="w-2 h-2 rounded-full bg-primary"
                                />
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                    className="w-2 h-2 rounded-full bg-primary"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 pb-4"
                >
                    <div className="flex flex-wrap gap-2">
                        {suggestedPrompts.map((prompt, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePromptClick(prompt)}
                                className="px-3 py-2 text-sm rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all"
                            >
                                <Sparkles className="h-3 w-3 inline mr-1" />
                                {prompt}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Input Area */}
            <div className="border-t bg-card/30 backdrop-blur-md p-4">
                <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Ask anything about your documents..."
                            rows={1}
                            className="w-full px-4 py-3 pr-12 rounded-xl bg-background/50 border border-border/50 focus:border-primary/50 focus:outline-none resize-none transition-all"
                            style={{ minHeight: "48px", maxHeight: "120px" }}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isTyping ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </motion.button>
                </div>

                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Vishnu can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
}
