"use client";
import BarChart from "./charts/barChart";
import * as React from "react";
import { useDarkMode } from "../context/darkModeContext";
import { useTransactions } from "../context/transactionsContext";
/**
 * Displays a summary of the user's budget including total income, total expenses, net savings,
 * and a breakdown of expenses by category. Also includes a date range picker to filter the data.
 */
export const BudgetDisplay = () => {
    const { state } = useTransactions();
    const { darkMode } = useDarkMode();

    const [transactionsInDateRange, setTransactionsInDateRange] = React.useState(state.transactions);

    React.useEffect(() => {
        if (state.dateRange.startDate && state.dateRange.endDate) {
            const filtered = state.transactions.filter(t => {
                return t.TransactionDate >= state.dateRange.startDate! && t.TransactionDate <= state.dateRange.endDate!
            });
            setTransactionsInDateRange(filtered);
        }
    }, [state.dateRange, state.transactions]);

    // Monthly and weekly trends helpers
    function getMonthYear(date: Date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    function getWeekStart(date: Date) {
        // Return a new Date representing the start of the week (Sunday)
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - d.getDay());
        return d;
    }
    function getWeekEnd(date: Date) {
        const start = getWeekStart(date);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return end;
    }
    function getWeekRangeLabel(start: Date, end: Date) {
        const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
        return `${fmt(start)}-${fmt(end)}`;
    }

    // Monthly totals (after transactionsInDateRange is defined)
    const monthlyTotals: Record<string, number> = {};
    transactionsInDateRange.forEach(t => {
        const key = getMonthYear(new Date(t.TransactionDate));
        monthlyTotals[key] = (monthlyTotals[key] || 0) + t.Amount;
    });
    const GREEN = '#22c55e';
    const RED = '#ef4444';

    const monthlySeries = [{
        type: 'bar',
        name: 'Net',
        data: Object.entries(monthlyTotals).map(([name, y]) => ({
            name,
            y,
            color: y >= 0 ? GREEN : RED // green for positive, red for negative
        })),
    }];

    // Weekly totals with date range labels, fill missing weeks
    const weeklyTotals: Record<string, number> = {};
    transactionsInDateRange.forEach(t => {
        const weekStart = getWeekStart(new Date(t.TransactionDate));
        const weekEnd = getWeekEnd(weekStart);
        const key = getWeekRangeLabel(weekStart, weekEnd);
        weeklyTotals[key] = (weeklyTotals[key] || 0) + t.Amount;
    });

    // Find the full range of weeks to display
    const weekLabels: string[] = [];
    if (transactionsInDateRange.length > 0) {
        // Use the selected date range if available, else use min/max transaction date
        const minDate = state.dateRange.startDate || new Date(Math.min(...transactionsInDateRange.map(t => new Date(t.TransactionDate).getTime())));
        const maxDate = state.dateRange.endDate || new Date(Math.max(...transactionsInDateRange.map(t => new Date(t.TransactionDate).getTime())));
        const current = getWeekStart(minDate);
        const last = getWeekStart(maxDate);
        while (current <= last) {
            const weekEnd = getWeekEnd(current);
            weekLabels.push(getWeekRangeLabel(current, weekEnd));
            current.setDate(current.getDate() + 7);
        }
    }

    const weeklySeries = [{
        type: 'bar',
        name: 'Net',
        data: weekLabels.map(label => ({
            name: label,
            y: weeklyTotals[label] || 0,
            color: (weeklyTotals[label] || 0) >= 0 ? GREEN : RED
        })),
    }];

    const totalIncome = transactionsInDateRange
        .filter(t => t.Amount > 0)
        .reduce((sum, t) => sum + t.Amount, 0);

    const totalExpenses = transactionsInDateRange
        .filter(t => t.Amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.Amount), 0);

    const netSavings = totalIncome - totalExpenses;

    // Category breakdown (top 5)
    const categoryTotals: Record<string, number> = {};
    transactionsInDateRange.forEach(t => {
        if (t.Amount < 0) {
            categoryTotals[t.Category || "Uncategorized"] = (categoryTotals[t.Category || "Uncategorized"] || 0) + Math.abs(t.Amount);
        }
    });
    const topCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Example budget target (could be from state or props)
    const budgetTarget = 2000;
    const percentUsed = totalExpenses / budgetTarget * 100;

    return (
        <div className={
            (darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900") +
            " rounded-lg p-6 shadow w-full max-w-xl mx-auto"
        }>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-2">Budget Overview</h2>
            </div>
            <div className="mb-2 flex justify-between">
                <span>Total Income:</span>
                <span className="font-semibold text-green-500">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="mb-2 flex justify-between">
                <span>Total Expenses:</span>
                <span className="font-semibold text-red-500">${totalExpenses.toLocaleString()}</span>
            </div>
            <div className="mb-4 flex justify-between">
                <span>Net Savings:</span>
                <span className={netSavings >= 0 ? "font-semibold text-green-400" : "font-semibold text-red-400"}>
                    ${netSavings.toLocaleString()}
                </span>
            </div>
            <div className="mb-4">
                <span className="block mb-1">Budget Used:</span>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-4">
                    <div
                        className="h-4 rounded"
                        style={{
                            width: `${Math.min(percentUsed, 100)}%`,
                            background: percentUsed < 80 ? "#34d399" : percentUsed < 100 ? "#fbbf24" : "#ef4444"
                        }}
                    />
                </div>
                <span className="text-sm mt-1 block">{percentUsed.toFixed(1)}% of ${budgetTarget.toLocaleString()} target</span>
            </div>
            <div>
                <h3 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-2">Top Spending Categories</h3>
                <ul>
                    {topCategories.map(([cat, amt]) => (
                        <li key={cat} className="flex justify-between mb-1">
                            <span>{cat}</span>
                            <span className="text-red-400">${amt.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-2">Monthly Net Trend</h3>
                <BarChart
                    title="Monthly Net"
                    series={monthlySeries}
                    isDarkMode={darkMode}
                />
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-2">Weekly Net Trend</h3>
                <BarChart
                    title="Weekly Net"
                    series={weeklySeries}
                    isDarkMode={darkMode}
                />
            </div>
        </div>
    );
}