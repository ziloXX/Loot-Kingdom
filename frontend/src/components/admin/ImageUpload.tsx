"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, Plus, Loader2, ImageIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/components/ui/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
    const { token } = useAuthStore();
    const { showToast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setIsUploading(true);

            try {
                const newUrls: string[] = [];

                for (const file of Array.from(files)) {
                    const formData = new FormData();
                    formData.append("file", file);

                    const response = await fetch(`${API_URL}/upload`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || "Upload failed");
                    }

                    const data = await response.json();
                    newUrls.push(data.url);
                }

                onChange([...value, ...newUrls]);
                showToast("success", `${newUrls.length} image(s) uploaded`);
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Upload failed");
            } finally {
                setIsUploading(false);
                // Reset input
                e.target.value = "";
            }
        },
        [token, value, onChange, showToast]
    );

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm text-gray-400">Product Images</label>

            {/* Image Grid */}
            <div className="grid grid-cols-4 gap-3">
                {/* Existing Images */}
                {value.map((url, index) => (
                    <div
                        key={url}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700 group"
                    >
                        <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-xs text-white">
                            {index + 1}
                        </div>
                    </div>
                ))}

                {/* Add Image Dropzone */}
                <label
                    className={`aspect-square rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-gray-800/50 transition-colors ${isUploading ? "pointer-events-none opacity-50" : ""
                        }`}
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                        <>
                            <Plus className="w-8 h-8 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Add Image</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleUpload}
                        className="hidden"
                        disabled={isUploading}
                    />
                </label>
            </div>

            {/* Help Text */}
            {value.length === 0 && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload product images (Front, Back, Box, Detail)</span>
                </div>
            )}
        </div>
    );
}
