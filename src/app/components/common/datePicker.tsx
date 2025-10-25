"use client";

import { useTransactions } from '@/app/context/transactionsContext';
import React from 'react';
import { useDarkMode } from '@/app/context/darkModeContext';
import DatePicker from 'react-datepicker';

interface DateRangePickerProps {
  darkMode?: boolean;
}


const DateRangePicker: React.FC<DateRangePickerProps> = () => {
  const { state, dispatch } = useTransactions();
  const { darkMode } = useDarkMode();
  const { dateRange } = state;

  const onDateRangeUpdate = (dates: [Date | null, Date | null]) => {
    if (dates[0] && dates[1]) {
      dispatch({
        type: "setDateRange",
        payload: {
          startDate: dates[0],
          endDate: dates[1],
        }
      })
    } else if (dates[0]) {
      dispatch({
        type: "setDateRange",
        payload: {
          startDate: dates[0],
        }
      })
    }
  }

  const baseInputClasses =
    'w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 shadow-sm';

  const lightInputClasses =
    'bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400';

  const darkInputClasses =
    'bg-gray-900 text-gray-100 border-gray-700 hover:border-gray-500';

  const inputClassName = `${baseInputClasses} ${darkMode ? darkInputClasses : lightInputClasses}`;

  return (
    <div className={`inline-block w-72 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <DatePicker
        selected={dateRange.startDate}
        onChange={onDateRangeUpdate}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        selectsRange
        className={inputClassName}
        popperClassName={darkMode ? 'react-datepicker-dark' : ''}
        calendarClassName={darkMode ? 'react-datepicker-calendar-dark' : ''}
        popperPlacement="bottom-start"
        placeholderText="Select date range"
      />
      <style jsx global>{`
        .react-datepicker-dark {
          background-color: #1f2937 !important;
          color: #f3f4f6 !important;
          border-color: #374151 !important;
        }
        .react-datepicker-dark .react-datepicker__header {
          background-color: #111827 !important;
          border-bottom: 1px solid #374151 !important;
        }
        .react-datepicker-dark .react-datepicker__day,
        .react-datepicker-dark .react-datepicker__day-name {
          color: #f3f4f6 !important;
        }
        .react-datepicker-dark .react-datepicker__day--selected,
        .react-datepicker-dark .react-datepicker__day--in-selecting-range,
        .react-datepicker-dark .react-datepicker__day--in-range {
          background-color: #6366f1 !important;
          color: #fff !important;
        }
        .react-datepicker-dark .react-datepicker__current-month {
          color: #f3f4f6 !important;
        }
        .react-datepicker-dark .react-datepicker__navigation {
          filter: invert(1);
        }
        .react-datepicker-calendar-dark {
          background-color: #1f2937 !important;
        }
      `}</style>
    </div>
  );
};

export default DateRangePicker;
