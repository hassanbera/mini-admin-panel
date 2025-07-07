import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from  '../../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ size = 'middle', showText = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Açık tema' : 'Koyu tema'}>
      <Button
        type="text"
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        size={size}
        className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
      >
        {showText && (isDarkMode ? 'Açık Tema' : 'Koyu Tema')}
      </Button>
    </Tooltip>
  );
};

export default ThemeToggle;
