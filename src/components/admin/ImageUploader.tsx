"use client";

import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";

type ImageUploaderProps = {
  imageUrl?: string;
  imagePublicId?: string | null;
};

type UploadResponse = {
  imageUrl?: string;
  imagePublicId?: string;
  error?: string;
};

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024;

export function ImageUploader({ imageUrl = "", imagePublicId = "" }: ImageUploaderProps) {
  const [preview, setPreview] = useState(imageUrl);
  const [submittedUrl, setSubmittedUrl] = useState(imageUrl);
  const [publicId, setPublicId] = useState(imagePublicId ?? "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  function upload(file: File) {
    setError("");

    if (!allowedTypes.includes(file.type)) {
      setError("Upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > maxFileSize) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setSubmittedUrl("");
    setPublicId("");
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/upload");

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      setProgress(Math.round((event.loaded / event.total) * 100));
    };

    request.onload = () => {
      setUploading(false);

      let data: UploadResponse = {};
      try {
        data = JSON.parse(request.responseText) as UploadResponse;
      } catch {
        data = { error: "Upload failed." };
      }

      if (request.status < 200 || request.status >= 300 || !data.imageUrl) {
        setError(data.error || "Upload failed.");
        setSubmittedUrl("");
        setPublicId("");
        return;
      }

      setPreview(data.imageUrl);
      setSubmittedUrl(data.imageUrl);
      setPublicId(data.imagePublicId || "");
      setProgress(100);
    };

    request.onerror = () => {
      setUploading(false);
      setError("Upload failed. Please try again.");
      setSubmittedUrl("");
      setPublicId("");
    };

    request.send(formData);
  }

  return (
    <div className="grid gap-3">
      <input name="imageUrl" type="hidden" value={submittedUrl} readOnly />
      <input name="imagePublicId" type="hidden" value={publicId} readOnly />
      <label className="group grid cursor-pointer place-items-center rounded-lg border border-dashed border-red-500/30 bg-white/6 p-4 text-center transition hover:border-red-500/70 hover:bg-white/9">
        <input
          className="sr-only"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
          }}
        />
        {preview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-950 shadow-[0_0_36px_rgba(255,23,68,0.18)]">
            <Image src={preview} alt="Portfolio image preview" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 560px, 100vw" />
          </div>
        ) : (
          <div className="py-10">
            <ImagePlus className="mx-auto text-red-500" size={34} />
            <p className="mt-3 font-black text-white">Upload portfolio image</p>
            <p className="mt-1 text-sm text-white/55">JPG, PNG, or WEBP up to 5MB</p>
          </div>
        )}
      </label>
      {uploading ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-red-100">
            <Loader2 className="animate-spin" size={16} /> Uploading image... {progress}%
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      <div>
        <label className="mb-2 block text-sm font-semibold text-white/70">Image URL</label>
        <Input
          value={submittedUrl}
          onChange={(event) => {
            setSubmittedUrl(event.target.value);
            setPreview(event.target.value);
            setPublicId("");
          }}
          placeholder="/uploads/work.webp"
        />
      </div>
    </div>
  );
}
