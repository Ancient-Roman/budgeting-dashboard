"use client";
import React from 'react';

interface Props {
  monthKey: string;
  onChange: (newMonthKey: string) => void;
}

const MonthYearPicker: React.FC<Props> = ({ monthKey, onChange }) => {
  const [y, m] = monthKey.split('-');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const currentYear = new Date().getFullYear();
  // Show a small window of years ending at currentYear (currentYear-2 .. currentYear)
  const years = Array.from({length: 3}, (_,i) => currentYear - 2 + i);

  return (
    <div className="flex items-center gap-2">
      <select value={m} onChange={e => onChange(`${y}-${e.target.value}`)} className="border border-gray-300 dark:border-gray-700 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        {monthNames.map((label, idx) => {
          const monthNum = idx + 1;
          const val = ('0' + monthNum).slice(-2);
          const today = new Date();
          const currentYear = today.getFullYear();
          const currentMonth = today.getMonth() + 1;
          const selectedYearNum = Number(y);
          const disabled = selectedYearNum > currentYear || (selectedYearNum === currentYear && monthNum > currentMonth);
          return <option key={val} value={val} disabled={disabled}>{label}</option>;
        })}
      </select>
      <select value={y} onChange={e => onChange(`${e.target.value}-${m}`)} className="border border-gray-300 dark:border-gray-700 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        {years.map(yr => <option key={yr} value={String(yr)}>{yr}</option>)}
      </select>
    </div>
  );
};

export default MonthYearPicker;
