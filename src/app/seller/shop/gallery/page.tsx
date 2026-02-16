"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ImageIcon, Save, Upload, Trash2, Loader2, X, AlertCircle,
} from "lucide-react";

const MAX_IMAGES = 20;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function GalleryPage() {
  const [images, setImages] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load existing gallery images
  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/seller/shop");
        if (res.ok) {
          const data = await res.json();
          setImages(data.shop.galleryImages ?? []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const uploadFiles = async (files: File[]) => {
    setError("");

    const validFiles = files.filter((f) => {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setError("Only JPEG, PNG, and WebP files are allowed.");
        return false;
      }
      if (f.size > MAX_SIZE) {
        setError("Each file must be under 5MB.");
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - images.length} more.`);
      return;
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "gallery");

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        } else {
          const data = await res.json();
          setError(data.error || "Upload failed");
        }
      }
      if (newUrls.length > 0) {
        setImages((prev) => [...prev, ...newUrls]);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/seller/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryImages: images }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save gallery");
      }
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-moulna-gold" />
            Shop Gallery
          </h1>
          <p className="text-muted-foreground">
            Upload photos to showcase your shop ({images.length}/{MAX_IMAGES})
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-moulna-gold hover:bg-moulna-gold-dark"
        >
          <Save className="w-4 h-4 me-2" />
          {isSaving ? "Saving..." : "Save Gallery"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Upload Area */}
      <Card
        className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
          dragOver
            ? "border-moulna-gold bg-moulna-gold/5"
            : "border-muted-foreground/20 hover:border-moulna-gold/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
      >
        <div className="text-center">
          {uploading ? (
            <Loader2 className="w-10 h-10 mx-auto text-moulna-gold animate-spin mb-3" />
          ) : (
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          )}
          <p className="font-medium mb-1">
            {uploading ? "Uploading..." : "Drop images here or click to browse"}
          </p>
          <p className="text-sm text-muted-foreground">
            JPEG, PNG, or WebP &middot; Max 5MB per file &middot; Up to {MAX_IMAGES} images
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </Card>

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="relative aspect-square rounded-xl overflow-hidden group">
              <Image
                src={url}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  onClick={() => removeImage(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No gallery images yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload photos of your products, workspace, or anything that represents your shop.
          </p>
        </Card>
      )}

      {/* Mobile Save */}
      <div className="lg:hidden">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-moulna-gold hover:bg-moulna-gold-dark"
        >
          <Save className="w-4 h-4 me-2" />
          {isSaving ? "Saving..." : "Save Gallery"}
        </Button>
      </div>
    </div>
  );
}
