import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  loaded: boolean;
  loading: boolean;
  init: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loaded: false,
  loading: false,

  init: async () => {
    const state = get();
    if (state.loaded || state.loading) return state.user;

    set({ loading: true });
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      set({ user: data.user, loaded: true, loading: false });
    } catch {
      set({ loaded: true, loading: false });
    }

    // Subscribe to auth changes
    const supabase = createClient();
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user || null, loaded: true });
    });
  },

  setUser: (user) => set({ user, loaded: true }),
}));
