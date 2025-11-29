"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, FileSpreadsheet, X, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedFile {
    id: string;
    file: File;
    status: "uploading" | "processing" | "ready" | "error";
    progress: number;
}

export function DocumentUpload({ onFilesUploaded }: { onFilesUploaded?: (files: File[]) => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const acceptedTypes = [
        "text/plain",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv"
    ];

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFiles = useCallback(async (files: FileList | null) => {
        if (!files) return;

        const validFiles = Array.from(files).filter(file =>
            acceptedTypes.includes(file.type) ||
            file.name.endsWith('.txt') ||
            file.name.endsWith('.pdf') ||
            file.name.endsWith('.xlsx') ||
            file.name.endsWith('.xls') ||
            file.name.endsWith('.csv')
        );

        const newFiles: UploadedFile[] = validFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            status: "uploading",
            progress: 0
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);

        // Process each file
        for (const uploadedFile of newFiles) {
            try {
                // Simulate progress for better UX
                const progressInterval = setInterval(() => {
                    setUploadedFiles(prev => prev.map(f =>
                        f.id === uploadedFile.id && f.progress < 90
                            ? { ...f, progress: Math.min(f.progress + 15, 90) }
                            : f
                    ));
                }, 300);

                // Upload to API
                const formData = new FormData();
                formData.append('file', uploadedFile.file);

                const response = await fetch('/api/vishnu/upload', {
                    method: 'POST',
                    body: formData,
                });

                clearInterval(progressInterval);

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.status}`);
                }

                const data = await response.json();

                // Mark as processing
                setUploadedFiles(prev => prev.map(f =>
                    f.id === uploadedFile.id
                        ? { ...f, status: "processing", progress: 100 }
                        : f
                ));

                // Simulate processing time for UX
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mark as ready
                setUploadedFiles(prev => prev.map(f =>
                    f.id === uploadedFile.id
                        ? { ...f, status: "ready" }
                        : f
                ));

                console.log('Upload successful:', data);
            } catch (error) {
                console.error('Upload error:', error);
                setUploadedFiles(prev => prev.map(f =>
                    f.id === uploadedFile.id
                        ? { ...f, status: "error", progress: 0 }
                        : f
                ));
            }
        }

        if (onFilesUploaded) {
            onFilesUploaded(validFiles);
        }
    }, [acceptedTypes, onFilesUploaded]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
    }, [processFiles]);

    const removeFile = (id: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== id));
    };

    const getFileIcon = (fileName: string) => {
        if (fileName.endsWith('.pdf')) return <FileText className="h-5 w-5 text-red-400" />;
        if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
            return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
        }
        return <FileText className="h-5 w-5 text-blue-400" />;
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-muted-foreground/30 hover:border-primary/50"
                    }`}
                style={{
                    background: isDragging
                        ? "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)"
                        : "rgba(255, 255, 255, 0.03)"
                }}
            >
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".txt,.pdf,.xlsx,.xls,.csv"
                    onChange={handleFileInput}
                    className="hidden"
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-4"
                >
                    <motion.div
                        animate={{
                            scale: isDragging ? 1.1 : 1,
                            rotate: isDragging ? 5 : 0
                        }}
                        transition={{ duration: 0.2 }}
                        className="p-4 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20"
                    >
                        <Upload className="h-10 w-10 text-primary" />
                    </motion.div>

                    <div className="text-center">
                        <p className="text-lg font-semibold">
                            {isDragging ? "Drop files here" : "Upload Documents"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Drag and drop or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Supports: TXT, PDF, Excel (XLS, XLSX, CSV)
                        </p>
                    </div>
                </label>

                {/* Animated background effect */}
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-2xl"
                        style={{
                            background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
                            pointerEvents: "none"
                        }}
                    />
                )}
            </div>

            {/* Uploaded Files List */}
            <AnimatePresence>
                {uploadedFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        {uploadedFiles.map((uploadedFile) => (
                            <motion.div
                                key={uploadedFile.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                            >
                                {getFileIcon(uploadedFile.file.name)}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {uploadedFile.file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {(uploadedFile.file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>

                                {uploadedFile.status === "uploading" && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadedFile.progress}%` }}
                                                className="h-full bg-gradient-to-r from-violet-500 to-blue-500"
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {uploadedFile.progress}%
                                        </span>
                                    </div>
                                )}

                                {uploadedFile.status === "processing" && (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        <span className="text-xs text-muted-foreground">Processing</span>
                                    </div>
                                )}

                                {uploadedFile.status === "ready" && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                )}

                                {uploadedFile.status === "error" && (
                                    <div className="flex items-center gap-2">
                                        <X className="h-4 w-4 text-destructive" />
                                        <span className="text-xs text-destructive">Failed</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => removeFile(uploadedFile.id)}
                                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
