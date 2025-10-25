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
        <div>
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-6 py-3 rounded-xl font-extrabold tracking-tight shadow transition-all duration-200 border-none outline-none bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white dark:from-blue-600 dark:via-purple-700 dark:to-pink-600 hover:brightness-110 hover:saturate-150 focus:brightness-110 focus:saturate-150"
          >
            Clear All Uploads
          </button>
        </div>
  );
}