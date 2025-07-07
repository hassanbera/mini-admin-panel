import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const setTheme = (theme) => {
    const isDark = theme === 'dark';
    setIsDarkMode(isDark);
    localStorage.setItem('theme', theme);
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.body.style.backgroundColor = isDarkMode ? '#141414' : '#f5f5f5';
    document.body.style.color = isDarkMode ? '#ffffff' : '#000000';
  }, [isDarkMode]);

  // Ant Design theme configuration
  const antdTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
      ...(isDarkMode ? {
        colorBgContainer: '#1f1f1f',
        colorBgElevated: '#262626',
        colorBgLayout: '#141414',
        colorBorder: '#434343',
        colorText: '#ffffff',
        colorTextSecondary: '#a6a6a6',
      } : {
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f5f5f5',
        colorBorder: '#d9d9d9',
        colorText: '#000000',
        colorTextSecondary: '#666666',
      })
    },
    components: {
      Layout: {
        ...(isDarkMode ? {
          siderBg: '#001529',
          headerBg: '#001529',
          bodyBg: '#141414',
          footerBg: '#001529',
        } : {
          siderBg: '#001529',
          headerBg: '#001529', 
          bodyBg: '#f5f5f5',
          footerBg: '#001529',
        })
      },
      Menu: {
        ...(isDarkMode ? {
          darkItemBg: '#001529',
          darkItemSelectedBg: '#1890ff',
          darkItemHoverBg: '#112545',
        } : {})
      },
      Card: {
        ...(isDarkMode ? {
          colorBgContainer: '#1f1f1f',
          colorBorder: '#434343',
        } : {})
      },
      Table: {
        ...(isDarkMode ? {
          colorBgContainer: '#1f1f1f',
          colorBorder: '#434343',
          headerBg: '#262626',
        } : {})
      }
    }
  };

  const value = {
    isDarkMode,
    theme: isDarkMode ? 'dark' : 'light',
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
