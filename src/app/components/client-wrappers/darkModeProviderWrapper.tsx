"use client";

import React from 'react';
import { DarkModeProvider } from '@/app/context/darkModeContext';

export const DarkModeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DarkModeProvider>{children}</DarkModeProvider>;
};
