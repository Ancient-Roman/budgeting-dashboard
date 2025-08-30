'use client';

import React from 'react';
import { useTransactions } from '../context/transactionsContext';
import { parseCsvWithOptionalHeaders } from '../helpers/csvHelpers';
import { categorizeTransaction } from '../helpers/categoryHelper';

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
      });
    }
  };

  return (
    <div className="cursor-pointer border border-white rounded p-4">
      <button className="cursor-pointer" type="button" onClick={handleButtonClick}>
        Upload CSV(s)
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          multiple
          hidden
          ref={fileInputRef}
      />
      </button>
    </div>
  );
};

export default CSVUpload;