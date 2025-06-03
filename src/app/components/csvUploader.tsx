'use client';

import React, { useRef } from 'react';
import Papa from 'papaparse';
import { ParsedCsvTransaction } from '../types/csvParse';
import { useTransactions } from '../context/transactionsContext';

const CSVUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { dispatch } = useTransactions();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
        const fileArray = Array.from(files);

        fileArray.forEach(file => {
            if (file && file.type === 'text/csv') {
                Papa.parse<ParsedCsvTransaction>(file, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: function(header) {
                      return header.replace(/\s+/g, ''); // Remove white space in header names
                    },
                    complete: (results) => {
                        if (results.errors.length) throw new Error(results.errors.join(" | "));

                        const resultsWithId = results.data.map((d, idx) => ({ ...d, Id: idx }));

                        dispatch({
                            type: "addTransactions",
                            payload: resultsWithId,
                        })
                    },
                    error: (err) => {
                        console.error('Error parsing CSV:', err);
                    },
                });
              }
        });
      }
  };

  return (
    <div className="cursor-pointer border border-white rounded p-4">
      <button className="cursor-pointer" type="button" onClick={handleButtonClick}>
        Upload CSV(s)
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple
      />
    </div>
  );
};

export default CSVUpload;