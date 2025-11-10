"use client";
import * as React from 'react';
import { useTransactions } from '../context/transactionsContext';
import { parseBudgetCsv, exportBudgetCsv, generateBudgetFromAverages, CategoryBudgetItem } from '../helpers/budgetHelpers';
import { CsvTransactionDetail } from '../types/csvParse';
import MonthYearPicker from './common/monthYearPicker';
import CategoryBudgetCard from './CategoryBudgetCard';
import GenericChartModal, { GenericChartModalColumn } from './common/MonthTransactionsModal';

function getCurrentMonthKey(d = new Date()) {
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
}

function sumByCategoryForMonth(transactions: CsvTransactionDetail[], monthKey: string) {
    const sums: Record<string, number> = {};
    transactions.forEach(t => {
        const key = `${t.TransactionDate.getFullYear()}-${('0' + (t.TransactionDate.getMonth() + 1)).slice(-2)}`;
        if (key !== monthKey) return;
        if (t.Amount >= 0) return; // only expenses
        const cat = t.Category || 'Uncategorized';
        sums[cat] = (sums[cat] || 0) + Math.abs(t.Amount);
    });
    return sums;
}

export const CategoryBudget: React.FC = () => {
    const { state, dispatch } = useTransactions();
    const [budgets, setBudgets] = React.useState<CategoryBudgetItem[]>([]);
    const [monthKey, setMonthKey] = React.useState(getCurrentMonthKey());
    const [fileError, setFileError] = React.useState<string | null>(null);

    // load budgets when monthKey changes (or on mount) from reducer state
    // Only use global 'default' budgets. We do not support month-specific budgets.
    React.useEffect(() => {
        const defaultBudgets = state.categoryBudgets && state.categoryBudgets['default'];
        if (defaultBudgets && defaultBudgets.length) {
            setBudgets(defaultBudgets);
            return;
        }

        // derive from transactions in that month: categories present become budget items with amount 0
        const monthSums = sumByCategoryForMonth(state.transactions, monthKey);
        const categories = Object.keys(monthSums);
        if (categories.length > 0) {
            const defaults: CategoryBudgetItem[] = categories.map(cat => ({ category: cat, amount: 0 }));
            setBudgets(defaults);
            return;
        }

        // final fallback: generate budgets from averages
        try {
            const gen = generateBudgetFromAverages(state.transactions, 3);
            setBudgets(gen);
        } catch {
            setBudgets([]);
        }
    }, [monthKey, state.categoryBudgets, state.transactions]);

    const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null);
        const f = e.target.files?.[0];
        if (!f) return;
        const text = await f.text();
        try {
            const parsed = parseBudgetCsv(text);
            setBudgets(parsed);
            // save as the global default so imported budgets apply to all months unless a month-specific CSV is provided
            try { dispatch({ type: 'setCategoryBudgets', payload: { monthKey: 'default', budgets: parsed } }); } catch {}
            // clear the file input so same file can be re-selected later if desired
            (e.target as HTMLInputElement).value = '';
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setFileError(msg || 'Failed to parse CSV');
        }
    };

    const onAutoCreate = () => {
        const gen = generateBudgetFromAverages(state.transactions, 3);
    setBudgets(gen);
    try { dispatch({ type: 'setCategoryBudgets', payload: { monthKey: 'default', budgets: gen } }); } catch {}
    };

    const onExport = () => {
        const csv = exportBudgetCsv(budgets);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `category-budget-${monthKey}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const currentSums = sumByCategoryForMonth(state.transactions, monthKey);

    // modal state for viewing transactions for a category/month
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState('');
    const [modalData, setModalData] = React.useState<CsvTransactionDetail[]>([]);
    const [modalColumns, setModalColumns] = React.useState<GenericChartModalColumn<CsvTransactionDetail>[]>([]);
    const [modalSortKey, setModalSortKey] = React.useState<keyof CsvTransactionDetail | undefined>('TransactionDate');

    const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
    const [yearStr, monthStr] = monthKey.split('-');
    const currentDate = new Date();
    const daysTotal = daysInMonth(Number(yearStr), Number(monthStr));
    const today = currentDate.getDate();

    const onChangeBudget = (idx: number, val: string) => {
        const amt = Number(val);
        const next = budgets.map((b, i) => i === idx ? { ...b, amount: isNaN(amt) ? 0 : amt } : b);
        setBudgets(next);
        // edits should persist across months (update the global default)
        try { dispatch({ type: 'setCategoryBudgets', payload: { monthKey: 'default', budgets: next } }); } catch {}
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 rounded-md">
            <div className="flex items-center gap-4 mb-4">
                <div>
                    <input id="budget-import-file" type="file" accept=".csv,text/csv" onChange={onImport} className="hidden" />
                    <label htmlFor="budget-import-file" className="inline-flex items-center gap-2 px-3 py-1 border rounded cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 5v12" /></svg>
                        <span className="text-sm">Import CSV</span>
                    </label>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={onAutoCreate}>Auto-create</button>
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={onExport}>Export CSV</button>
                <div className="ml-auto">
                    <label className="mr-2 text-gray-700 dark:text-gray-300">Month:</label>
                    <MonthYearPicker monthKey={monthKey} onChange={setMonthKey} />
                </div>
            </div>
            {fileError && <div className="text-red-500 mb-2">{fileError}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {budgets.length === 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 sm:col-span-2">No budgets defined. Use Auto-create or import a CSV with headers Category,Amount.</div>
                )}

                {budgets.map((b: CategoryBudgetItem, idx) => {
                    const spent = currentSums[b.category] || 0;
                    const selectedYear = Number(yearStr);
                    const selectedMonth = Number(monthStr);
                    const now = new Date();
                    const nowYear = now.getFullYear();
                    const nowMonth = now.getMonth() + 1;
                    const isCurrent = selectedYear === nowYear && selectedMonth === nowMonth;
                    const isPast = selectedYear < nowYear || (selectedYear === nowYear && selectedMonth < nowMonth);

                    const allowedSoFar = isCurrent
                        ? (b.amount || 0) * (today / daysTotal)
                        : isPast
                            ? (b.amount || 0)
                            : 0;

                    const pctRelativeToTime = isCurrent ? (allowedSoFar <= 0 ? 0 : (spent / allowedSoFar)) : 0;
                    const over = isCurrent ? (spent > allowedSoFar) : (isPast ? (spent > (b.amount || 0)) : (spent > 0));
                    const pctOfMonth = (b.amount || 0) <= 0 ? 0 : (spent / (b.amount || 1));

                    const onCardClick = () => {
                        const filtered = state.transactions.filter(t => {
                            const key = `${t.TransactionDate.getFullYear()}-${('0' + (t.TransactionDate.getMonth() + 1)).slice(-2)}`;
                            return key === monthKey && (t.Category || 'Uncategorized') === b.category;
                        });
                        setModalTitle(`Transactions for ${b.category} — ${monthKey}`);
                        setModalData(filtered);
                        setModalColumns([
                            { key: 'TransactionDate', label: 'Date', render: (v: unknown) => v instanceof Date ? v.toLocaleDateString() : String(v), sortable: true },
                            { key: 'Category', label: 'Category', sortable: true },
                            { key: 'Amount', label: 'Amount', render: (_v: unknown, row?: CsvTransactionDetail) => row ? (row.Amount >= 0 ? '+' : '-') + '$' + Math.abs(row.Amount).toLocaleString() : '', sortable: true },
                            { key: 'Description', label: 'Description', render: (v: unknown) => <span title={String(v)} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',display:'inline-block',maxWidth:120}}>{String(v)}</span>, sortable: true },
                        ]);
                        setModalSortKey('TransactionDate');
                        setModalOpen(true);
                    };

                    return (
                        <>
                        <CategoryBudgetCard
                            key={b.category}
                            item={b}
                            spent={spent}
                            isCurrent={isCurrent}
                            pctRelativeToTime={pctRelativeToTime}
                            pctOfMonth={pctOfMonth}
                            over={over}
                            onChangeAmount={(amt) => onChangeBudget(idx, String(amt))}
                            onClick={onCardClick}
                        />
                        </>
                    );
                })}
            </div>

            <GenericChartModal
                open={modalOpen}
                title={modalTitle}
                data={modalData}
                columns={modalColumns}
                onClose={() => setModalOpen(false)}
                initialSortKey={modalSortKey}
            />
        </div>
    );
};

export default CategoryBudget;
