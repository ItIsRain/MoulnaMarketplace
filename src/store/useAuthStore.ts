import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole, Badge, DailyChallenge, Notification } from "@/lib/types";

// Mock badges
const MOCK_BADGES: Badge[] = [
  { id: "first_buy", name: "First Purchase", icon: "🛍️", description: "Made your first purchase", category: "shopping", earnedAt: "2025-01-15", xpReward: 50 },
  { id: "streak_7", name: "Weekly Warrior", icon: "🔥", description: "7-day login streak", category: "streak", earnedAt: "2025-01-20", xpReward: 100 },
  { id: "first_review", name: "Critic", icon: "✍️", description: "Left your first review", category: "social", earnedAt: "2025-01-18", xpReward: 50 },
];

// Mock daily challenges
const MOCK_CHALLENGES: DailyChallenge[] = [
  { id: "browse_3", task: "Browse 3 different categories", xp: 30, icon: "👀", completed: true, progress: 3, target: 3 },
  { id: "add_wishlist", task: "Add 2 items to your wishlist", xp: 20, icon: "❤️", completed: false, progress: 1, target: 2 },
  { id: "share_product", task: "Share a product on social media", xp: 25, icon: "📤", completed: false },
];

// Mock user data
const MOCK_USER: User = {
  id: "user_1",
  name: "Sara Ahmed",
  username: "sara_uae",
  email: "sara@example.com",
  phone: "+971501234567",
  role: "buyer",
  level: 5,
  xp: 7850,
  badges: MOCK_BADGES,
  streakDays: 12,
  avatar: {
    style: "adventurer",
    seed: "sara_uae",
    backgroundColor: "c7a34d",
  },
  location: "Dubai",
  joinDate: "2024-06-15",
  isVerified: true,
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  challenges: DailyChallenge[];
  notifications: Notification[];

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  addXP: (amount: number, action: string) => void;
  completeChallenge: (challengeId: string) => void;
  setRole: (role: UserRole) => void;
  markNotificationRead: (id: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      challenges: MOCK_CHALLENGES,
      notifications: [],

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock login - accept any email with password "demo123"
        if (password === "demo123") {
          const user: User = {
            ...MOCK_USER,
            email,
            name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            username: email.split("@")[0],
            avatar: {
              style: "adventurer",
              seed: email.split("@")[0],
              backgroundColor: "c7a34d",
            },
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newUser: User = {
          id: `user_${Date.now()}`,
          name: data.name,
          username: data.email.split("@")[0],
          email: data.email,
          role: data.role,
          level: 1,
          xp: 100, // Sign-up bonus
          badges: [],
          streakDays: 1,
          avatar: {
            style: "adventurer",
            seed: data.email.split("@")[0],
          },
          joinDate: new Date().toISOString(),
          isVerified: false,
        };

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
        }
      },

      addXP: (amount: number, action: string) => {
        const { user, notifications } = get();
        if (user) {
          const newXP = user.xp + amount;

          // Create notification
          const notification: Notification = {
            id: `notif_${Date.now()}`,
            type: "xp",
            title: "XP Earned!",
            message: `+${amount} XP for ${action}`,
            read: false,
            createdAt: new Date().toISOString(),
            xpAmount: amount,
          };

          set({
            user: { ...user, xp: newXP },
            notifications: [notification, ...notifications],
          });
        }
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

      setRole: (role: UserRole) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, role } });
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
        isAuthenticated: state.isAuthenticated,
        challenges: state.challenges,
      }),
    }
  )
);
