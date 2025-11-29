"use client";

import { useState } from "react";
import { DocumentUpload } from "@/components/vishnu/DocumentUpload";
import { ChatInterface } from "@/components/vishnu/ChatInterface";
import { DocumentList } from "@/components/vishnu/DocumentList";
import { AgentStatus } from "@/components/vishnu/AgentStatus";
import { motion } from "framer-motion";
import { Brain, Menu, X } from "lucide-react";

export default function VishnuPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-[calc(100vh-8rem)] relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-cyan-500/5" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                                Vishnu AI Assistant
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Intelligent document analysis powered by RAG
                            </p>
                        </div>
                    </motion.div>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4"
                >
                    <AgentStatus status="ready" />
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6 h-[calc(100%-10rem)]">
                {/* Left Sidebar - Document Management */}
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                        opacity: isSidebarOpen ? 1 : 0,
                        x: isSidebarOpen ? 0 : -20,
                        width: isSidebarOpen ? "320px" : "0px"
                    }}
                    className={`flex-shrink-0 space-y-6 overflow-hidden ${isSidebarOpen ? "block" : "hidden lg:block"
                        }`}
                >
                    <div className="h-full flex flex-col gap-6">
                        {/* Upload Section */}
                        <div className="flex-shrink-0">
                            <DocumentUpload />
                        </div>

                        {/* Documents List */}
                        <div className="flex-1 overflow-y-auto">
                            <DocumentList />
                        </div>
                    </div>
                </motion.aside>

                {/* Main Chat Area */}
                <motion.main
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden"
                    style={{
                        boxShadow: "0 20px 60px -12px rgba(139, 92, 246, 0.15)"
                    }}
                >
                    <ChatInterface />
                </motion.main>
            </div>

            {/* Info Card - Feature Preview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/20">
                        <Brain className="h-4 w-4 text-violet-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">
                            🚀 Agentic Capabilities Coming Soon
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            This UI is ready for RAG integration. See{" "}
                            <code className="px-1.5 py-0.5 rounded bg-muted text-xs">
                                VISHNU_AGENTIC_ROADMAP.md
                            </code>{" "}
                            for implementation steps.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
