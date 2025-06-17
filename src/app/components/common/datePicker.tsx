"use client";

import { useTransactions } from '@/app/context/transactionsContext';
import React from 'react';
import DatePicker from 'react-datepicker';

interface DateRangePickerProps {
  darkMode?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  darkMode = false,
}) => {
  const { state, dispatch } = useTransactions();

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
        popperPlacement="bottom-start"
        placeholderText="Select date range"
      />
    </div>
  );
};

export default DateRangePicker;
