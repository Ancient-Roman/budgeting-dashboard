import React, { useState } from "react";

interface MonthTransactionsModalProps {
  month: string | null;
  type: "income" | "expenses";
  transactions: Array<{
    TransactionDate: Date;
    Category: string;
    Amount: number;
    Description?: string;
  }>;
  onClose: () => void;
}

const MonthTransactionsModal: React.FC<MonthTransactionsModalProps> = ({ month, transactions, onClose, type }) => {
  const [sortKey, setSortKey] = useState<'date' | 'category' | 'amount' | 'description'>('amount');

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  React.useEffect(() => {
    if (sortKey === 'amount') {
      setSortDirection(type === 'income' ? 'desc' : 'asc');
    }
  }, [type, sortKey]);

  if (!month) return null;

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue, bValue;
    switch (sortKey) {
      case 'date':
        aValue = a.TransactionDate.getTime();
        bValue = b.TransactionDate.getTime();
        break;
      case 'category':
        aValue = a.Category || '';
        bValue = b.Category || '';
        break;
      case 'amount':
        aValue = a.Amount;
        bValue = b.Amount;
        break;
      case 'description':
        aValue = a.Description || '';
        bValue = b.Description || '';
        break;
      default:
        aValue = '';
        bValue = '';
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      // If sorting by amount, use type to determine direction
      if (key === 'amount') {
        setSortDirection(type === 'income' ? 'desc' : 'asc');
      } else {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      }
    } else {
      setSortKey(key);
      if (key === 'amount') {
        setSortDirection(type === 'income' ? 'desc' : 'asc');
      } else {
        setSortDirection('asc');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-lg relative`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={onClose}
        >
          &times;
        </button>
  <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-4">Transactions for {month}</h2>
        {transactions.length === 0 ? (
          <div className="text-gray-500">No transactions for this month.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort('date')}>
                  Date {sortKey === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort('category')}>
                  Category {sortKey === 'category' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort('amount')}>
                  Amount {sortKey === 'amount' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-2 py-1 cursor-pointer" onClick={() => handleSort('description')}>
                  Description {sortKey === 'description' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((t, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-2 py-1">{t.TransactionDate.toLocaleDateString()}</td>
                  <td className="px-2 py-1">{t.Category}</td>
                  <td className={"px-2 py-1 " + (t.Amount >= 0 ? "text-green-500" : "text-red-500") }>
                    {t.Amount >= 0 ? '+' : '-'}${Math.abs(t.Amount).toLocaleString()}
                  </td>
                  <td
                    className="px-2 py-1 max-w-[120px] truncate cursor-pointer"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    title={t.Description}
                  >
                    {t.Description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MonthTransactionsModal;
