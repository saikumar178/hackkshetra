import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: true,   // ✅ Guest mode always authenticated
  loading: false,

  // ✅ Load guest profile from backend
  fetchUser: async () => {
    try {
      const { data } = await api.get("/auth/profile");
      set({ user: data, isAuthenticated: true });
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  },

  // ✅ Update profile (name, bio, skills)
  updateUser: async (updates) => {
    try {
      const { data } = await api.put("/auth/profile", updates);
      set({ user: data });
    } catch (err) {
      console.error("Update failed:", err);
    }
  },

  // ✅ For your login modal (safe fallback)
  login: async () => {
    const { data } = await api.get("/auth/profile");
    set({ user: data, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
