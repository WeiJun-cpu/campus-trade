import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  loaded: boolean;
  loading: boolean;
  init: () => Promise<User | null>;
  setUser: (user: User | null) => void;
}

let initPromise: Promise<User | null> | null = null;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loaded: false,
  loading: false,

  init: async () => {
    const state = get();
    if (state.loaded) return state.user;

    // If already loading, wait for the existing promise
    if (state.loading && initPromise) return initPromise;

    set({ loading: true });

    initPromise = (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        set({ user: data.user, loaded: true, loading: false });

        // Subscribe to auth changes (only once)
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user || null, loaded: true });
        });

        return data.user;
      } catch {
        set({ loaded: true, loading: false });
        return null;
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  },

  setUser: (user) => set({ user, loaded: true }),
}));
