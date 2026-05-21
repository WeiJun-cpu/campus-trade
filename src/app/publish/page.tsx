"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>发布商品</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 图片上传 */}
            <div className="space-y-2">
              <Label>商品图片</Label>
              <ImageUpload images={images} onChange={setImages} />
            </div>

            {/* 标题 */}
            <div className="space-y-2">
              <Label htmlFor="title">商品标题 *</Label>
              <Input
                id="title"
                placeholder="例如：考研数学全书 95新"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 描述 */}
            <div className="space-y-2">
              <Label htmlFor="desc">商品描述</Label>
              <Textarea
                id="desc"
                placeholder="描述商品的状况、使用时间、购买渠道等..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* 价格 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">售价 *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="¥"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">原价（选填）</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="¥"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
            </div>

            {/* 成色 & 分类 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>成色</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
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
                <Label>分类</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "发布中..." : "发布商品"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
