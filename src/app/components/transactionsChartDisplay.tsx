"use client";

import React from "react";

import { useDarkMode } from "../context/darkModeContext";
import { useTransactions } from "../context/transactionsContext";
import { getMonthName } from "../helpers/date-helpers";
import BarChart from "./charts/barChart";
import PieChart from "./charts/pieChart";
import DateRangePicker from "./common/datePicker";

export const TransactionsChartDisplay = () => {
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

    const mapIncomeVsExpensesByMonthChart = () => {
        // Group transactions by month, summing income and expenses
        const monthlyTotals: Record<string, { income: number; expenses: number }> = {};

        transactionsInDateRange.forEach((t) => {
            const month = getMonthName(t.TransactionDate.getMonth());
            if (!monthlyTotals[month]) {
                monthlyTotals[month] = { income: 0, expenses: 0 };
            }
            if (t.Amount > 0) {
                monthlyTotals[month].income += t.Amount;
            } else if (t.Amount < 0) {
                monthlyTotals[month].expenses += Math.abs(t.Amount);
            }
        });

        // Prepare series data for Highcharts
        const months = Object.keys(monthlyTotals);
        const incomeData = months.map((month) => ({
            name: month,
            y: monthlyTotals[month].income,
        }));
        const expensesData = months.map((month) => ({
            name: month,
            y: monthlyTotals[month].expenses,
        }));

        return [
            {
                type: "column",
                name: "Income",
                data: incomeData,
            },
            {
                type: "column",
                name: "Expenses",
                data: expensesData,
            },
        ];
    };

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
        const data = countStringArray(transactionsInDateRange.map(t => t.Category));

        console.log(data);

        return {
            type: "column",
            name: "Transactions by Category",
            data,
        }
    }

    const mapTransactionsToMonthChart = () => {
        const monthCount = transactionsInDateRange.map(t => t.TransactionDate.getMonth());
        const data = countByMonth(monthCount);

        console.log(data);

        return {
            type: "column",
            name: "Transactions by Month",
            data,
        }
    }

    const mapMoneySpentToTypeChart = () => {
        const categoryTotals = transactionsInDateRange.reduce((acc, curr) => {
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
        const monthlyTotals = transactionsInDateRange.reduce((acc, curr) => {
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
            name: "Money Spent",
            data,
        }
    }

    const transactionsTooltipFormatter: Highcharts.TooltipFormatterCallbackFunction = function () {
        return `<b>${this.name}</b><br/>` +
          `Transactions: ${this.y}`;
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row gap-8 mb-8">
                <BarChart 
                    series={mapIncomeVsExpensesByMonthChart()} 
                    title="Income vs Expenses by Month" 
                    isDarkMode={darkMode} 
                    legendEnabled={true}
                />
                <div className={`p-6 ml-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                    <h1 className="text-xl mb-4">Select Date Range</h1>
                    <DateRangePicker
                        darkMode={darkMode}
                    />
                </div>
            </div>
            <div className="flex flex-row gap-8">
                <BarChart 
                    series={[mapTransactionsToTypeChart()]} 
                    title="Transactions by Category" 
                    isDarkMode={darkMode}  
                    tooltipFormatter={transactionsTooltipFormatter}
                />
                <BarChart 
                    series={[mapTransactionsToMonthChart()]} 
                    title="Transactions by Month" 
                    isDarkMode={darkMode} 
                    tooltipFormatter={transactionsTooltipFormatter}
                />
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