import React, { useState } from 'react';

type SortDirection = 'asc' | 'desc';

type DataTableProps<T extends object> = {
  data: T[];
  defaultPageSize?: number;
  onDelete?: (row: T) => void;
  hiddenColumns?: (keyof T)[];
};

export function DataTable<T extends object>({
  data,
  defaultPageSize = 10,
  onDelete,
  hiddenColumns = [],
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  if (data.length === 0) return <div className="text-gray-400">No data available.</div>;

  const allHeaders = Object.keys(data[0]) as (keyof T)[];
  const headers = allHeaders.filter((key) => !hiddenColumns.includes(key));

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal == null || bVal == null) return 0;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return sortDirection === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="text-sm text-gray-200">
      {/* Page size selector */}
      <div className="mb-2 flex justify-between items-center">
        <label>
          Show{' '}
          <select
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>{' '}
          entries
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 divide-y divide-gray-700 bg-gray-900 text-left">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              {headers.map((key) => (
                <th
                  key={String(key)}
                  onClick={() => handleSort(key)}
                  className="px-4 py-2 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-between">
                    <span>{String(key)}</span>
                    {sortKey === key && (
                      <span>{sortDirection === 'asc' ? '🔼' : '🔽'}</span>
                    )}
                  </div>
                </th>
              ))}
              {onDelete && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={rowIdx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}
              >
                {headers.map((key) => (
                  <td key={String(key)} className="px-4 py-2 border-t border-gray-700">
                    {String(row[key])}
                  </td>
                ))}
                {onDelete && (
                  <td className="px-4 py-2 border-t border-gray-700">
                    <button
                      onClick={() => onDelete(row)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
