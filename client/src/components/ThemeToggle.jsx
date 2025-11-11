import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../store/themeStore';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-lg 
                 border border-gray-300 dark:border-gray-800 
                 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300
                 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
