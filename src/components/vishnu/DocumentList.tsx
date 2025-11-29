"use client";

import { FileText, FileSpreadsheet, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Document {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
    status: "ready" | "processing" | "error";
}

const mockDocuments: Document[] = [
    {
        id: "1",
        name: "Project Report Q4 2024.pdf",
        type: "pdf",
        size: 2457600,
        uploadedAt: new Date(Date.now() - 3600000),
        status: "ready"
    },
    {
        id: "2",
        name: "Sales Data Analysis.xlsx",
        type: "xlsx",
        size: 1048576,
        uploadedAt: new Date(Date.now() - 7200000),
        status: "ready"
    },
    {
        id: "3",
        name: "Meeting Notes.txt",
        type: "txt",
        size: 15360,
        uploadedAt: new Date(Date.now() - 86400000),
        status: "ready"
    }
];

export function DocumentList() {
    const getFileIcon = (type: string) => {
        if (type === "pdf") return <FileText className="h-5 w-5 text-red-400" />;
        if (type === "xlsx" || type === "xls" || type === "csv") {
            return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
        }
        return <FileText className="h-5 w-5 text-blue-400" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1048576).toFixed(1) + " MB";
    };

    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
        if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
        return Math.floor(seconds / 86400) + "d ago";
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">
                    Uploaded Documents
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {mockDocuments.length} files
                </span>
            </div>

            <div className="space-y-2">
                {mockDocuments.map((doc, index) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getFileIcon(doc.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {doc.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                        {formatFileSize(doc.size)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatTimeAgo(doc.uploadedAt)}
                                    </span>
                                </div>

                                {doc.status === "ready" && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span className="text-xs text-green-500">Ready</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                </button>
                                <button className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {mockDocuments.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                        No documents uploaded yet
                    </p>
                </div>
            )}
        </div>
    );
}
