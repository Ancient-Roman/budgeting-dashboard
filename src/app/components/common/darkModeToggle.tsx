"use client";

import React from 'react';
import { useDarkMode } from '@/app/context/darkModeContext';

export const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white transition"
    >
      {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};
