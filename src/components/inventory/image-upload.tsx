"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Star, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
    images: string[];
    primaryImage?: string;
    onChange: (images: string[], primaryImage?: string) => void;
    maxImages?: number;
}

export function ImageUpload({
    images,
    primaryImage,
    onChange,
    maxImages = 10,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleFileUpload = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;

            if (images.length + files.length > maxImages) {
                toast({
                    title: "Too many images",
                    description: `Maximum ${maxImages} images allowed`,
                    variant: "destructive",
                });
                return;
            }

            setUploading(true);

            try {
                const formData = new FormData();
                Array.from(files).forEach((file) => {
                    formData.append("files", file);
                });

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (data.success && data.urls.length > 0) {
                    const newImages = [...images, ...data.urls];
                    const newPrimaryImage = primaryImage || data.urls[0];
                    onChange(newImages, newPrimaryImage);

                    toast({
                        title: "Images uploaded",
                        description: `${data.urls.length} image(s) uploaded successfully`,
                    });

                    if (data.errors && data.errors.length > 0) {
                        toast({
                            title: "Some uploads failed",
                            description: data.errors.join(", "),
                            variant: "destructive",
                        });
                    }
                } else {
                    throw new Error("Upload failed");
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast({
                    title: "Upload failed",
                    description: "Failed to upload images. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setUploading(false);
            }
        },
        [images, primaryImage, maxImages, onChange, toast]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
        },
        [handleFileUpload]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFileUpload(e.target.files);
        },
        [handleFileUpload]
    );

    const removeImage = useCallback(
        (imageUrl: string) => {
            const newImages = images.filter((img) => img !== imageUrl);
            const newPrimaryImage =
                primaryImage === imageUrl
                    ? newImages[0] || undefined
                    : primaryImage;
            onChange(newImages, newPrimaryImage);

            // Delete from server
            fetch("/api/upload", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl }),
            }).catch(console.error);
        },
        [images, primaryImage, onChange]
    );

    const setPrimary = useCallback(
        (imageUrl: string) => {
            onChange(images, imageUrl);
            toast({
                title: "Primary image set",
                description: "This image will be shown first",
            });
        },
        [images, onChange, toast]
    );

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
                    ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-primary"}
                `}
            >
                <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={uploading}
                />
                <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                >
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div>
                        <p className="font-medium">
                            {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            PNG, JPG, WEBP up to 5MB (Max {maxImages} images)
                        </p>
                    </div>
                </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((imageUrl, index) => (
                        <Card
                            key={imageUrl}
                            className={`relative group overflow-hidden ${primaryImage === imageUrl ? "ring-2 ring-primary" : ""
                                }`}
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={imageUrl}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => setPrimary(imageUrl)}
                                        title="Set as primary image"
                                    >
                                        <Star
                                            className={`h-4 w-4 ${primaryImage === imageUrl
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : ""
                                                }`}
                                        />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeImage(imageUrl)}
                                        title="Remove image"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Primary Badge */}
                                {primaryImage === imageUrl && (
                                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current" />
                                        Primary
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}

                    {/* Empty Slots */}
                    {images.length < 4 && (
                        <Card className="aspect-square flex items-center justify-center border-dashed">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </Card>
                    )}
                </div>
            )}

            {images.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                    No images uploaded yet
                </p>
            )}
        </div>
    );
}
