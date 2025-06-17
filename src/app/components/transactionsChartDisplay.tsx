"use client";

import { useDarkMode } from "../context/darkModeContext";
import { useTransactions } from "../context/transactionsContext";
import { getMonthName } from "../helpers/date-helpers";
import BarChart from "./charts/barChart";
import PieChart from "./charts/pieChart";
import DateRangePicker from "./common/datePicker";

export const TransactionsChartDisplay = () => {
    const { state } = useTransactions();
    const { darkMode } = useDarkMode();

    function countStringArray(values: string[]) {
        const counts: Record<string | number, number> = {};
      
        for (const value of values) {
          counts[value] = (counts[value] || 0) + 1;
        }
      
        return Object.entries(counts)
            .map(([value, count]) => ({ name: value, y: count }))
            .sort((a, b) => b.y - a.y);;
    }

    function countByMonth(values: number[]) {
        const counts: Record<number, number> = {};
      
        for (const value of values) {
          counts[value] = (counts[value] || 0) + 1;
        }
      
        return Object.entries(counts)
            .map(([value, count]) => ({ name: getMonthName(value), y: count }))
            .sort((a, b) => b.y - a.y);;
    }

    const mapTransactionsToTypeChart = () => {
        const data = countStringArray(state.transactions.map(t => t.Category));

        console.log(data);

        return {
            type: "column",
            name: "Transactions by Category",
            data,
        }
    }

    const mapTransactionsToMonthChart = () => {
        const monthCount = state.transactions.map(t => t.TransactionDate.getMonth());
        const data = countByMonth(monthCount);

        console.log(data);

        return {
            type: "column",
            name: "Transactions by Month",
            data,
        }
    }

    const mapMoneySpentToTypeChart = () => {
        const categoryTotals = state.transactions.reduce((acc, curr) => {
            if (!acc[curr.Category]) {
                acc[curr.Category] = 0;
            }
            acc[curr.Category] += Math.abs(curr.Amount);
            return acc;
        }, {} as Record<string, number>);

        const data: { name: string; y: number }[] = Object.entries(categoryTotals).map(
            ([category, total]) => ({
                name: category,
                y: total,
            })
        );

        console.log(data);

        return data;
    }

    const mapMoneySpentToMonthChart = () => {
        const monthlyTotals = state.transactions.reduce((acc, curr) => {
            const date = new Date(curr.TransactionDate);
            const month = date.getMonth();
            const monthName = getMonthName(month);
        
            if (!acc[monthName]) {
                acc[monthName] = 0;
            }
            acc[monthName] += Math.abs(curr.Amount);
            return acc;
        }, {} as Record<string, number>);
        
        const data: { name: string; y: number }[] = Object.entries(monthlyTotals).map(
            ([month, total]) => ({
                name: month,
                y: total,
            })
        );

        console.log(data);

        return {
            type: "column",
            name: "Money Spent by Month",
            data,
        }
    }

    return (
        <div className="flex flex-col">
            <div className={`p-6 ml-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h1 className="text-xl mb-4">Select Date Range</h1>
                <DateRangePicker
                    darkMode={darkMode}
                />
            </div>
            <div className="flex flex-row gap-8">
                <BarChart series={[mapTransactionsToTypeChart()]} title="Transactions by Category" isDarkMode={darkMode} />
                <BarChart series={[mapTransactionsToMonthChart()]} title="Transactions by Month" isDarkMode={darkMode} />
            </div>
            <div className="flex flex-row gap-8">
                <div className="flex-1">
                    <PieChart data={mapMoneySpentToTypeChart()} title="Money Spent by Category" isDarkMode={darkMode} />
                </div>
                <div className="flex-1">
                    <BarChart series={[mapMoneySpentToMonthChart()]} title="Money Spent by Month" isDarkMode={darkMode} />
                </div>
            </div>
        </div>
    )
}