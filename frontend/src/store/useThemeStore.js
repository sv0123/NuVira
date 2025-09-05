import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("NuVira-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("NuVira-theme", theme);
    set({ theme });
  },
}));