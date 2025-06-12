"use client";

import React, { useState } from 'react';

export type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full min-w-5xl">
      <div className="flex border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-200
              ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 dark:border-blue-500 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 text-gray-900 dark:text-gray-100">
        {tabs.map(
          (tab) =>
            tab.id === activeTab && (
              <div key={tab.id}>
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
};
