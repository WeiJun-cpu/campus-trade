"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { createClient } from "@/lib/supabase/client";
import { CONDITION_LABELS } from "@/lib/utils";
import type { Category } from "@/lib/types";
import { toast } from "sonner";

export default function PublishPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [condition, setCondition] = useState("good");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*").order("id");
      if (data) setCategories(data);
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("请输入商品标题");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("请输入有效价格");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error } = await supabase.from("products").insert({
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      condition,
      category_id: categoryId ? parseInt(categoryId) : null,
      seller_id: user.id,
      images,
      status: "active",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("发布成功！");
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in-up">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-espresso"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          发布商品
        </h1>
        <p className="mt-1.5 text-sm text-muted-fg">
          分享你的闲置好物，让它们找到新主人
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-2xl border border-border/60 p-6 space-y-6 shadow-md"
      >
        {/* 图片上传 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-espresso">商品图片</Label>
          <ImageUpload images={images} onChange={setImages} />
        </div>

        {/* 标题 */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-espresso">
            商品标题 <span className="text-coral">*</span>
          </Label>
          <Input
            id="title"
            placeholder="例如：考研数学全书 95新"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="rounded-xl border-border/60 h-11 bg-cream/50 focus:bg-surface transition-colors"
          />
        </div>

        {/* 描述 */}
        <div className="space-y-2">
          <Label htmlFor="desc" className="text-sm font-medium text-espresso">
            商品描述
          </Label>
          <Textarea
            id="desc"
            placeholder="描述商品的状况、使用时间、购买渠道等..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-xl border-border/60 bg-cream/50 focus:bg-surface transition-colors resize-none"
          />
        </div>

        {/* 价格 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-espresso">
              售价 <span className="text-coral">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-fg pointer-events-none">
                ¥
              </span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl border-border/60 h-11 pl-8 bg-cream/50 focus:bg-surface transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice" className="text-sm font-medium text-espresso">
              原价
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-fg pointer-events-none">
                ¥
              </span>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="rounded-xl border-border/60 h-11 pl-8 bg-cream/50 focus:bg-surface transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 成色 & 分类 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-espresso">成色</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className="rounded-xl border-border/60 h-11 bg-cream/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-espresso">分类</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="rounded-xl border-border/60 h-11 bg-cream/50">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-fg shadow-warm hover:shadow-lg transition-all duration-200 font-semibold"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              发布中...
            </span>
          ) : (
            "发布商品"
          )}
        </Button>
      </form>
    </div>
  );
}
