"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadProfileImage, deleteProfileImage } from "@/features/admin/actions";

interface ProfileImageInfo {
  url: string;
}

export function ProfileImageUpload({ profile }: { profile: ProfileImageInfo }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState<ProfileImageInfo>(profile);

  const handleUpload = useCallback(async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP are accepted");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB");
      return;
    }

    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 20, 90));
    }, 300);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadProfileImage(fd);
      clearInterval(interval);
      setProgress(100);
      setCurrent({ url: result.url });
      toast.success("Profile image uploaded successfully");
      router.refresh();
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [router]);

  const handleDelete = useCallback(async () => {
    if (!current.url) return;
    setDeleting(true);
    try {
      await deleteProfileImage();
      setCurrent({ url: "" });
      toast.success("Profile image deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }, [current.url, router]);

  return (
    <div className="space-y-4">
      {current.url ? (
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border/40">
            <Image
              src={current.url}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4 mr-1.5" />
              Change
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleUpload(file); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/40 bg-card/30 p-6 transition-colors hover:bg-card/70"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium">Upload Profile Image</p>
          <p className="text-xs text-muted-foreground">JPG, PNG or WEBP (max 5 MB)</p>
        </div>
      )}

      {uploading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </div>
  );
}