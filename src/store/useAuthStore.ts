import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import type { User, UserRole, Shop, DailyChallenge, Notification } from "@/lib/types";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  username?: string;
  avatarStyle?: string;
  avatarSeed?: string;
}

interface AuthState {
  user: User | null;
  shop: Shop | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  challenges: DailyChallenge[];
  notifications: Notification[];

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  initialize: () => Promise<void>;
  fetchProfile: () => Promise<User | null>;
  updateProfile: (data: Partial<User>) => void;
  addXP: (amount: number, action: string) => Promise<void>;
  completeChallenge: (challengeId: string) => void;
  markNotificationRead: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      shop: null,
      isAuthenticated: false,
      isLoading: false,
      challenges: [],
      notifications: [],

      initialize: async () => {
        set({ isLoading: true });
        try {
          const supabase = createClient();
          const {
            data: { user: authUser },
            error,
          } = await supabase.auth.getUser();

          if (error || !authUser) {
            // Clear stale persisted state (handles expired/missing refresh tokens)
            set({ user: null, shop: null, isAuthenticated: false });
          } else {
            const profile = await get().fetchProfile();
            if (profile) {
              set({ user: profile, isAuthenticated: true });
            } else {
              set({ user: null, shop: null, isAuthenticated: false });
            }
          }
        } catch (error) {
          console.error("Failed to initialize auth:", error);
          set({ user: null, shop: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        try {
          const res = await fetch("/api/auth/me");
          if (!res.ok) return null;
          const data = await res.json();
          const user = data.user as User;
          set({
            user,
            shop: data.shop ? (data.shop as Shop) : get().shop,
            isAuthenticated: true,
          });
          return user;
        } catch {
          return null;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            throw new Error(error.message);
          }

          const profile = await get().fetchProfile();
          if (profile) {
            set({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({ isLoading: false });
          return false;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({
          user: null,
          shop: null,
          isAuthenticated: false,
          challenges: [],
          notifications: [],
        });
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
              fullName: data.name,
              phone: data.phone || "",
              role: data.role,
              username: data.username || data.email.split("@")[0],
              avatarStyle: data.avatarStyle || "adventurer",
              avatarSeed: data.avatarSeed || data.email.split("@")[0],
            }),
          });

          const result = await res.json();

          if (!res.ok) {
            set({ isLoading: false });
            throw new Error(result.error || "Registration failed");
          }

          // Fetch the profile after registration
          const profile = await get().fetchProfile();
          if (profile) {
            set({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // User created but email confirmation may be required
            set({ isLoading: false });
          }

          return true;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
        }
      },

      addXP: async (amount: number) => {
        const { user } = get();
        if (!user) return;
        // XP is awarded server-side only; this just updates the local display optimistically
        set({ user: { ...user, xp: user.xp + amount } });
      },

      completeChallenge: (challengeId: string) => {
        const { challenges, addXP } = get();
        const challenge = challenges.find((c) => c.id === challengeId);

        if (challenge && !challenge.completed) {
          const updatedChallenges = challenges.map((c) =>
            c.id === challengeId ? { ...c, completed: true } : c
          );

          set({ challenges: updatedChallenges });
          addXP(challenge.xp, `completing "${challenge.task}"`);
        }
      },

      markNotificationRead: (id: string) => {
        const { notifications } = get();
        set({
          notifications: notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        });
      },
    }),
    {
      name: "moulna-auth",
      partialize: (state) => ({
        user: state.user,
        shop: state.shop,
        isAuthenticated: state.isAuthenticated,
        challenges: state.challenges,
      }),
    }
  )
);
