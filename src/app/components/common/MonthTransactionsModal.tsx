
import React, { useState } from "react";

export interface GenericChartModalColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface GenericChartModalProps<T> {
  open: boolean;
  title: string;
  data: T[];
  columns: GenericChartModalColumn<T>[];
  onClose: () => void;
  initialSortKey?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
}


function GenericChartModal<T extends Record<string, unknown>>({
  open,
  title,
  data,
  columns,
  onClose,
  initialSortKey,
  initialSortDirection = 'asc',
}: GenericChartModalProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(initialSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  React.useEffect(() => {
    setSortKey(initialSortKey);
    setSortDirection(initialSortDirection);
  }, [initialSortKey, initialSortDirection, open]);


  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  if (!open) return null;

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-4">{title}</h2>
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {sortedData.length === 0 ? (
            <div className="text-gray-500">No data to display.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className={"px-2 py-1 " + (col.sortable !== false ? "cursor-pointer" : "")}
                      onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                    >
                      {col.label} {sortKey === col.key && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-2 py-1">
                        {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenericChartModal;
