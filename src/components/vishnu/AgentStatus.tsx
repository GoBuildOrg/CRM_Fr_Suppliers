"use client";

import { motion } from "framer-motion";
import { Activity, Zap, CheckCircle2 } from "lucide-react";

type AgentState = "idle" | "analyzing" | "processing" | "ready";

export function AgentStatus({ status = "ready" }: { status?: AgentState }) {
    const statusConfig = {
        idle: {
            icon: Activity,
            text: "Agent Idle",
            color: "text-muted-foreground",
            bgColor: "bg-muted/50",
            dotColor: "bg-muted-foreground"
        },
        analyzing: {
            icon: Zap,
            text: "Analyzing Documents",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            dotColor: "bg-yellow-500"
        },
        processing: {
            icon: Zap,
            text: "Processing Query",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            dotColor: "bg-blue-500"
        },
        ready: {
            icon: CheckCircle2,
            text: "Ready",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            dotColor: "bg-green-500"
        }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${config.bgColor} backdrop-blur-sm border border-border/30`}>
            <div className="relative">
                <Icon className={`h-5 w-5 ${config.color}`} />
                {(status === "analyzing" || status === "processing") && (
                    <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${config.dotColor}`} />
                    </motion.div>
                )}
            </div>

            <div className="flex-1">
                <p className={`text-sm font-medium ${config.color}`}>
                    {config.text}
                </p>
            </div>

            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${config.dotColor}`}
            />
        </div>
    );
}
