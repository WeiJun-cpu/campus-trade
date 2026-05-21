"use client";

import { useState, useCallback } from "react";
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
          <div key={i} className="relative group">
            <img
              src={url}
              alt={`upload-${i}`}
              className="h-24 w-24 rounded-lg object-cover border"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        {images.length < max && (
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
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
      {uploading && <p className="text-sm text-muted-foreground">上传中...</p>}
      <p className="text-xs text-muted-foreground">
        最多 {max} 张图片，支持 JPG、PNG、WebP
      </p>
    </div>
  );
}
