"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/supabase/storage";

interface FileUploadProps {
  bucket: "projects" | "certificates" | "posts";
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  bucket,
  value,
  onChange,
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const urls = useMemo(
    () => (multiple ? (value as string[]) : value ? [value as string] : []),
    [multiple, value],
  );

  const handleUpload = useCallback(
    async (file: File) => {
      if (file.size > maxSize) {
        throw new Error(`File too large. Max size is ${maxSize / 1024 / 1024}MB`);
      }

      const url = await uploadFile(bucket, file);
      return url;
    },
    [bucket, maxSize],
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      setUploading(true);
      try {
        const uploadedUrls: string[] = [];
        for (const file of Array.from(files)) {
          const url = await handleUpload(file);
          uploadedUrls.push(url);
        }

        if (multiple) {
          onChange([...urls, ...uploadedUrls]);
        } else {
          onChange(uploadedUrls[0] ?? "");
        }
      } catch (error) {
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [handleUpload, multiple, onChange, urls],
  );

  const removeUrl = useCallback(
    (index: number) => {
      if (multiple) {
        const updated = [...urls];
        updated.splice(index, 1);
        onChange(updated);
      } else {
        onChange("");
      }
    },
    [multiple, onChange, urls],
  );

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url);
  const isPDF = (url: string) => /\.pdf$/i.test(url);

  return (
    <div className={cn("space-y-3", className)}>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((url, i) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden border border-border"
            >
              {isImage(url) ? (
                <div className="relative w-24 h-24">
                  <Image
                    src={url}
                    alt={`Upload ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : isPDF(url) ? (
                <div className="w-24 h-24 flex flex-col items-center justify-center bg-muted gap-1">
                  <FileText className="h-8 w-8 text-primary" />
                  <span className="text-[10px] text-muted-foreground truncate px-1 max-w-full">
                    PDF
                  </span>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) {
            await handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              {accept.replace(/\*/g, "all")} &middot; Max{" "}
              {maxSize / 1024 / 1024}MB
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={async (e) => {
          if (e.target.files && e.target.files.length > 0) {
            try {
              await handleFiles(e.target.files);
            } catch (error) {
              const msg = error instanceof Error ? error.message : "Upload failed";
              const { toast } = await import("sonner");
              toast.error(msg);
            }
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}
