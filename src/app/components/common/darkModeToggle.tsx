"use client";

import React from 'react';
import { useDarkMode } from '@/app/context/darkModeContext';

export const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="px-6 py-3 rounded-xl font-bold tracking-tight shadow-sm transition-all duration-200 border border-gray-300 dark:border-gray-700 outline-none bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-400"
    >
      {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};
