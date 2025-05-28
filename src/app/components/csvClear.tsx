"use client";

import { useTransactions } from "../context/transactionsContext";

export const CsvClear = () => {
    const { dispatch } = useTransactions();

    const handleButtonClick = () => {
        dispatch({
            type: "clearTransactions",
            payload: undefined,
        });
    }

    return (
        <div className="cursor-pointer border border-white rounded p-4">
          <button className="cursor-pointer" type="button" onClick={handleButtonClick}>
            Clear All Uploads
          </button>
        </div>
      );
}