"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Trash2, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadResume, deleteResume } from "@/features/admin/actions";

interface ResumeInfo {
  url: string;
  fileName: string;
  size: number;
}

export function ResumeUpload({ resume }: { resume: ResumeInfo }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState<ResumeInfo>(resume);

  const handleUpload = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
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
      const result = await uploadResume(fd);
      clearInterval(interval);
      setProgress(100);
      setCurrent({ url: result.url, fileName: file.name, size: file.size });
      toast.success("Resume uploaded successfully");
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload],
  );

  const handleDelete = useCallback(async () => {
    if (!current.url) return;
    setDeleting(true);
    try {
      await deleteResume();
      setCurrent({ url: "", fileName: "", size: 0 });
      toast.success("Resume deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }, [current.url]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {current.url ? (
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{current.fileName || "resume.pdf"}</p>
            <p className="text-xs text-muted-foreground">
              {current.size > 0 ? formatSize(current.size) : "Uploaded"}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm" asChild>
              <a href={current.url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="glass rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-card/70 transition-colors border-2 border-dashed border-border/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Upload Resume</p>
            <p className="text-xs text-muted-foreground mt-1">
              Drop a PDF here or click to browse (max 5 MB)
            </p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
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