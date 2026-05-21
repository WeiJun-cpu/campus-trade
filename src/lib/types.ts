export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id">;
        Update: Partial<Omit<Category, "id">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
      };
      favorites: {
        Row: Favorite;
        Insert: Pick<Favorite, "user_id" | "product_id">;
        Update: never;
      };
    };
  };
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  qq: string | null;
  wechat: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  condition: "like_new" | "good" | "fair" | "used";
  category_id: number | null;
  seller_id: string;
  status: "active" | "sold" | "reserved";
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// 商品列表用，JOIN 了分类和卖家
export interface ProductWithRelations extends Product {
  category: Category | null;
  seller: Profile | null;
}

// 商品列表用，带是否已收藏
export interface ProductWithFavorite extends ProductWithRelations {
  is_favorited: boolean;
}
