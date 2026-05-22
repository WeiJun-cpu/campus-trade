"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { CONDITION_LABELS } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";
import { toast } from "sonner";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [condition, setCondition] = useState("good");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      const { data: catData } = await supabase.from("categories").select("*").order("id");
      if (catData) setCategories(catData);

      const { data: prodData } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (prodData) {
        // Verify ownership
        if (!user || user.id !== prodData.seller_id) {
          toast.error("无权编辑此商品");
          router.push("/dashboard/products");
          return;
        }
        setProduct(prodData);
        setTitle(prodData.title);
        setDescription(prodData.description || "");
        setPrice(String(prodData.price));
        setOriginalPrice(prodData.original_price ? String(prodData.original_price) : "");
        setCondition(prodData.condition);
        setCategoryId(prodData.category_id ? String(prodData.category_id) : "");
        setImages(prodData.images || []);
      } else {
        toast.error("商品不存在");
        router.push("/dashboard/products");
        return;
      }

      setPageLoading(false);
    };
    load();
  }, [id, router]);

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

    const { error } = await supabase
      .from("products")
      .update({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        condition,
        category_id: categoryId ? parseInt(categoryId) : null,
        images,
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("商品已更新");
    router.push("/dashboard/products");
  };

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in">
        <Skeleton className="h-8 w-28 rounded-xl mb-8" />
        <div className="space-y-6 rounded-2xl border border-border/60 bg-surface p-6">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in-up">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-espresso"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            编辑商品
          </h1>
          <p className="mt-1.5 text-sm text-muted-fg">
            修改商品信息后保存即可
          </p>
        </div>
        <Button
          variant="ghost"
          asChild
          className="rounded-lg text-muted-fg hover:text-espresso"
          size="sm"
        >
          <Link href="/dashboard/products">← 返回</Link>
        </Button>
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
              保存中...
            </span>
          ) : (
            "保存修改"
          )}
        </Button>
      </form>
    </div>
  );
}
