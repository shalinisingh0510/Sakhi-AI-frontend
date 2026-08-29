"use client";

import { useState, useRef } from "react";
import { mediaApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { UploadCloud, X, FileVideo, Image as ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";

interface AdminMediaUploaderProps {
  type: "video" | "image";
  onSuccess: (mediaId: string, url?: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export function AdminMediaUploader({
  type,
  onSuccess,
  label,
  maxSizeMB = type === "video" ? 500 : 10,
}: AdminMediaUploaderProps) {
  const { token } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File too large. Maximum size is ${maxSizeMB}MB.`);
      setStatus("error");
      return;
    }

    if (type === "video" && !selected.type.startsWith("video/")) {
      setErrorMsg("Invalid file type. Please select a video.");
      setStatus("error");
      return;
    }

    if (type === "image" && !selected.type.startsWith("image/")) {
      setErrorMsg("Invalid file type. Please select an image.");
      setStatus("error");
      return;
    }

    setFile(selected);
    setErrorMsg(null);
    setStatus("idle");
    setProgress(0);
  };

  const startUpload = async () => {
    if (!file || !token) return;

    setStatus("uploading");
    setProgress(0);
    setErrorMsg(null);

    try {
      // 1. Get presigned URL
      const { upload_url, media } = await mediaApi.generatePresignedUrl(
        token,
        file.name,
        file.type,
        file.size
      );

      // 2. Upload directly to R2 using XMLHttpRequest for progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", upload_url, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      // 3. Success
      setStatus("success");
      onSuccess(media.id);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload file");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-semibold text-ink">
          {label || (type === "video" ? "Upload Video" : "Upload Image")}
        </label>
        {status === "success" && (
          <button onClick={reset} className="text-xs text-berry hover:underline">
            Upload another
          </button>
        )}
      </div>

      {status === "idle" && !file && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-peach/50 bg-peach/5 py-8 transition hover:bg-peach/10 hover:border-berry/30"
        >
          <UploadCloud className="mb-2 h-8 w-8 text-berry/50" />
          <p className="text-sm font-medium text-ink">Click to select a file</p>
          <p className="mt-1 text-xs text-ink/40">
            {type === "video" ? "MP4, WebM" : "JPG, PNG, WebP"} up to {maxSizeMB}MB
          </p>
        </div>
      )}

      {file && status !== "success" && (
        <div className="rounded-xl border border-peach/50 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2 shadow-sm">
                {type === "video" ? (
                  <FileVideo className="h-5 w-5 text-berry" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-berry" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-ink line-clamp-1">{file.name}</p>
                <p className="text-xs text-ink/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {status === "idle" && (
              <button
                onClick={reset}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {status === "uploading" && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-ink/70">Uploading...</span>
                <span className="font-medium text-berry">{progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-peach/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-berry transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === "idle" && (
            <button
              onClick={startUpload}
              className="mt-4 w-full rounded-xl bg-berry py-2.5 text-sm font-semibold text-white transition hover:bg-berry/90 active:scale-95 flex items-center justify-center gap-2"
            >
              Start Upload
            </button>
          )}
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-3 rounded-xl border border-moss/20 bg-moss/5 p-4 text-moss">
          <CheckCircle2 className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">Upload Complete</p>
            <p className="text-xs opacity-70">Media securely attached</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <p>{errorMsg}</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={type === "video" ? "video/*" : "image/*"}
        className="hidden"
      />
    </div>
  );
}
