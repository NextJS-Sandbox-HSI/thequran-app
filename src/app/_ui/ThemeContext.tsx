'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  // debug
  const renderCount = useRef(0);
  const prevTheme = useRef<Theme>('light');
  const prevMounted = useRef(false);

  renderCount.current++;
  
  console.log(`=== Render #${renderCount.current} ===`);
  console.log('Current theme:', theme, '(prev:', prevTheme.current, ')');
  console.log('Current mounted:', mounted, '(prev:', prevMounted.current, ')');
  console.log('Theme changed:', theme !== prevTheme.current);
  console.log('Mounted changed:', mounted !== prevMounted.current);

  // Handle hydration mismatch
  useEffect(() => {
    console.log('🚀 Mount effect running');
    setMounted(true);
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    console.log('📱 Saved theme:', savedTheme);
    console.log('🌙 Prefers dark:', prefersDark);
    
    if (savedTheme) {
      console.log('🔄 Setting theme from localStorage:', savedTheme);
      setTheme(savedTheme);
    } else if (prefersDark) {
      console.log('🔄 Setting theme from system preference: dark');
      setTheme('dark');
    }
  }, []);

  // Apply theme to document - ONLY depend on theme
  useEffect(() => {
    console.log('💾 Theme effect running');
    console.log('   Theme:', theme);
    console.log('   Mounted:', mounted);
    console.log('   Will save:', mounted);
    
    if (mounted) {
      console.log('✅ Saving theme to localStorage:', theme);
      localStorage.setItem('theme', theme);
    } else {
      console.log('⏳ Skipping save - not mounted yet');
    }
  }, [theme]); // Only theme dependency

  // Update refs for next render comparison
  useEffect(() => {
    prevTheme.current = theme;
    prevMounted.current = mounted;
  });

  const toggleTheme = () => {
    console.log('🔄 Toggle theme called, current:', theme);
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('🔄 New theme will be:', newTheme);
      return newTheme;
    });
  };

  const darkMode = theme === 'dark';

  console.log('📤 Providing context:', { theme, darkMode });
  console.log('=== End Render ===\n');

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      <div style={mounted ? {} : { visibility: 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}