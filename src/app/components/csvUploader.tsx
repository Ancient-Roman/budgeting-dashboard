'use client';

import React from 'react';
import { useTransactions } from '../context/transactionsContext';
import { parseCsvWithOptionalHeaders } from '../helpers/csvHelpers';
import { categorizeTransaction } from '../helpers/categoryHelper';
import { DateRange } from '../types/date';

const CSVUpload = () => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const { dispatch } = useTransactions();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      if (file.name.toLowerCase().endsWith('.csv')) {
        formData.append('files', file);
      }
      else {
        alert(`File ${file.name} is not a CSV and will be ignored.`);
      }
    });

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          handleFileChange(data.files.map(f => f.content));
        } else {
          alert(`Error uploading files: ${data.error}`);
          console.error(data);
        }
      });
  };

  const handleFileChange = (files: string[]) => {
    console.log("Processing files:", files.join(", "));
    if (files && files.length > 0) {
      files.forEach(file => {
        const result = parseCsvWithOptionalHeaders(file);
        if (result.errors.length) throw new Error(result.errors.join(" | "));
        
        const resultsWithId = result.data.map((d, idx) => ({ ...d, Id: idx }));
        const resultsWithCategory = resultsWithId.map((transaction => ({
          ...transaction,
          Category: transaction.Category ? transaction.Category : categorizeTransaction(transaction)
        })));
        
        dispatch({
            type: "addTransactions",
            payload: resultsWithCategory,
        })

        // dispatch date range to max span of transactions
        const dates = resultsWithCategory.map(t => new Date(t.TransactionDate));
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        const dateRange: DateRange = { startDate: minDate, endDate: maxDate };
        dispatch({
          type: "setDateRange",
          payload: dateRange,
        });
      });
    }
  };

  return (
  <div>
      <button
        type="button"
        onClick={handleButtonClick}
        className="px-6 py-3 rounded-xl font-extrabold tracking-tight shadow transition-all duration-200 border-none outline-none bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white dark:from-blue-600 dark:via-purple-700 dark:to-pink-600 hover:brightness-110 hover:saturate-150 focus:brightness-110 focus:saturate-150"
      >
        Upload CSV(s)
      </button>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        multiple
        hidden
        ref={fileInputRef}
      />
    </div>
  );
};

export default CSVUpload;