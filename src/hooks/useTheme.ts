import { useState, useEffect, createContext, useContext } from "react";

export type Theme = "dark" | "light";

export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeProvider() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Read from localStorage only on client after mount
  useEffect(() => {
    const saved = localStorage.getItem("vatavaran-theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    }
  }, []);

  // Persist choice to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vatavaran-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
