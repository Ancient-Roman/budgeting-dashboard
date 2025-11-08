import Papa from 'papaparse';
import { CsvTransactionDetail } from '../types/csvParse';

export type CategoryBudgetItem = {
    category: string;
    amount: number; // monthly budget amount
};

// Parse a simple CSV with headers: Category,Amount
export function parseBudgetCsv(csvString: string): CategoryBudgetItem[] {
    const res = Papa.parse<{Category: string; Amount: string}>(csvString, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim()
    });

    if (res.errors && res.errors.length > 0) {
        throw new Error('Failed to parse budget CSV');
    }

    return (res.data || [])
        .filter(r => r.Category && r.Amount)
        .map(r => ({ category: r.Category, amount: Number(r.Amount) }));
}

export function exportBudgetCsv(budgets: CategoryBudgetItem[]): string {
    const csv = Papa.unparse(budgets.map(b => ({ Category: b.category, Amount: b.amount })), {
        header: true,
    });
    return csv;
}

// Generate a budget per category based on average monthly spending over provided transactions
export function generateBudgetFromAverages(transactions: CsvTransactionDetail[], monthsToAverage = 3): CategoryBudgetItem[] {
    if (!transactions || transactions.length === 0) return [];

    // Group spending (only expenses) by month and category
    const byMonthCategory: Record<string, Record<string, number>> = {};

    transactions.forEach(t => {
        if (t.Amount >= 0) return; // only expenses
        const m = `${t.TransactionDate.getFullYear()}-${('0' + (t.TransactionDate.getMonth() + 1)).slice(-2)}`;
        byMonthCategory[m] = byMonthCategory[m] || {};
        const cat = t.Category || 'Uncategorized';
        byMonthCategory[m][cat] = (byMonthCategory[m][cat] || 0) + Math.abs(t.Amount);
    });

    // Take the most recent `monthsToAverage` months
    const months = Object.keys(byMonthCategory).sort().slice(-monthsToAverage);
    const sumsByCategory: Record<string, number> = {};

    months.forEach(m => {
        const catMap = byMonthCategory[m] || {};
        Object.entries(catMap).forEach(([cat, amt]) => {
            sumsByCategory[cat] = (sumsByCategory[cat] || 0) + amt;
        });
    });

    const budgets: CategoryBudgetItem[] = Object.entries(sumsByCategory).map(([cat, total]) => ({
        category: cat,
        amount: +(total / Math.max(1, months.length)).toFixed(2),
    }));

    // Sort by amount desc
    budgets.sort((a, b) => b.amount - a.amount);
    return budgets;
}
