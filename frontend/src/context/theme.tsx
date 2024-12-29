import React, { useState, createContext, ReactNode } from 'react';

interface ThemeContextProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  buttonSize: 'mini' | 'medium';
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDarkTheme: false,
  toggleTheme: () => {},
  buttonSize: 'mini',
});

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const currentTheme = localStorage.getItem('isDarkTheme') === 'false' ? false : true;

  const buttonSize = window.screen.width > 500 ? 'medium' : 'mini';

  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(currentTheme);

  if (isDarkTheme) {
    if (!document.body.classList.contains('dark')) {
      document.body.classList.add('dark');
    }
  } else {
    document.body.classList.remove('dark');
  }
  function toggleTheme() {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('isDarkTheme', String(newTheme));
  }

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, buttonSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
