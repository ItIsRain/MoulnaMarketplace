"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  className?: string;
  aspectRatio?: "square" | "landscape" | "banner";
  placeholder?: string;
  maxSizeMB?: number;
  recommendedSize?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  className,
  aspectRatio = "landscape",
  placeholder = "Click or drag to upload an image",
  maxSizeMB = 10,
  recommendedSize,
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP are allowed");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum is ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "banner"
        ? "aspect-[3/1]"
        : "aspect-video";

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {value ? (
        <div className={cn("relative rounded-lg overflow-hidden border", aspectClass)}>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group">
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg bg-white/90 text-sm font-medium hover:bg-white transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Replace"
                )}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={cn(
            "w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors",
            aspectClass,
            dragOver
              ? "border-moulna-gold bg-moulna-gold/5"
              : "border-muted-foreground/30 hover:border-moulna-gold hover:bg-moulna-gold/5"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-moulna-gold animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground text-center px-4">
                {placeholder}
              </span>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP &middot; Max {maxSizeMB}MB
                </span>
                {recommendedSize && (
                  <span className="text-xs font-medium text-moulna-gold">
                    Recommended: {recommendedSize}
                  </span>
                )}
              </div>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  maxImages?: number;
  maxSizeMB?: number;
  className?: string;
  recommendedSize?: string;
}

export function MultiImageUpload({
  value,
  onChange,
  folder,
  maxImages = 8,
  maxSizeMB = 10,
  className,
  recommendedSize,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    const newUrls = [...value];

    for (const file of Array.from(files)) {
      if (newUrls.length >= maxImages) break;

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Only JPEG, PNG, and WebP are allowed");
        continue;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Maximum is ${maxSizeMB}MB`);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        newUrls.push(data.url);
        onChange([...newUrls]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((img, index) => (
          <div key={img} className="relative aspect-square rounded-lg overflow-hidden border group">
            <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" unoptimized />
            {index === 0 && (
              <span className="absolute top-2 left-2 text-[10px] font-medium bg-moulna-gold text-white px-2 py-0.5 rounded-full">
                Main
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-moulna-gold hover:bg-moulna-gold/5 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Add Image"}
            </span>
          </button>
        )}
      </div>

      <div className="text-xs text-muted-foreground space-y-0.5">
        <p>
          {value.length}/{maxImages} images &middot; JPEG, PNG, WebP &middot; Max {maxSizeMB}MB each
          {value.length > 0 && " · First image is the main photo"}
        </p>
        {recommendedSize && (
          <p className="font-medium text-moulna-gold">
            Recommended: {recommendedSize}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
