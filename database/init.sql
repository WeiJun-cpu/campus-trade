-- ============================================
-- 校园二手交易平台 - 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. 用户资料表（关联 auth.users）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  qq TEXT,
  wechat TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 商品分类表
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- 3. 商品表
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL CHECK (price >= 0),
  original_price NUMERIC,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('like_new', 'good', 'fair', 'used')),
  category_id INT REFERENCES categories(id),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved')),
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 收藏表
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- RLS 策略
-- ============================================

-- profiles: 所有人可读，仅本人可改
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- categories: 所有人可读
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_read" ON categories FOR SELECT USING (true);

-- products: 所有人可读 active，卖家可管理自己的
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_read" ON products FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "products_update" ON products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "products_delete" ON products FOR DELETE USING (auth.uid() = seller_id);

-- favorites: 仅本人可管理
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_manage" ON favorites FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 自动创建 profile 触发器
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 种子分类数据
-- ============================================

INSERT INTO categories (name, slug) VALUES
  ('数码电子', 'digital'),
  ('书籍教材', 'books'),
  ('生活用品', 'daily'),
  ('服饰鞋包', 'fashion'),
  ('运动户外', 'sports'),
  ('其他', 'other');

-- ============================================
-- 更新时间自动触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
