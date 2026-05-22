"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUpload({ images, onChange, max = 6 }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      if (images.length + files.length > max) {
        toast.error(`最多上传 ${max} 张图片`);
        return;
      }

      setUploading(true);
      const supabase = createClient();

      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error, data } = await supabase.storage
          .from("product-images")
          .upload(path, file);

        if (error) {
          toast.error(`上传失败: ${error.message}`);
        } else if (data) {
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);
          newUrls.push(urlData.publicUrl);
        }
      }

      onChange([...images, ...newUrls]);
      setUploading(false);
    },
    [images, onChange, max]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative group h-24 w-24 rounded-xl overflow-hidden border border-border/60 shadow-sm">
            <Image
              src={url}
              alt={`upload-${i}`}
              fill
              sizes="96px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white text-xs hover:bg-danger/80 transition-colors shadow-sm"
            >
              ×
            </button>
          </div>
        ))}
        {images.length < max && (
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary/40 text-muted-fg hover:text-primary transition-all duration-200 bg-cream/50 hover:bg-cream">
            <span className="text-2xl">+</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      {uploading && (
        <p className="text-sm text-muted-fg flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          上传中...
        </p>
      )}
      <p className="text-xs text-muted-fg/60">
        最多 {max} 张图片，支持 JPG、PNG、WebP
      </p>
    </div>
  );
}
