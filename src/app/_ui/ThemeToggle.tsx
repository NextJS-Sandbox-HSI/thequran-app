import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

export function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-xl transition-all duration-300 ${darkMode
        ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
        } shadow-md hover:shadow-lg`}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}