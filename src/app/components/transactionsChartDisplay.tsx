"use client";
import React, { useRef, useState } from "react";
import GenericChartModal, { GenericChartModalColumn } from "./common/MonthTransactionsModal";
import { useDarkMode } from "../context/darkModeContext";
import { useTransactions } from "../context/transactionsContext";
import { getMonthName } from "../helpers/date-helpers";
import BarChart from "./charts/barChart";
import PieChart from "./charts/pieChart";

export const TransactionsChartDisplay = () => {
    const { state } = useTransactions();
    const { darkMode } = useDarkMode();

    const [transactionsInDateRange, setTransactionsInDateRange] = React.useState(state.transactions);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const barClickType = useRef<"income" | "expenses">("income");

    // State for generic modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalData, setModalData] = useState<any[]>([]);
    const [modalColumns, setModalColumns] = useState<any[]>([]);
    const [modalSortKey, setModalSortKey] = useState<string | undefined>(undefined);
    const [modalSortDirection, setModalSortDirection] = useState<'asc' | 'desc'>('asc');

    React.useEffect(() => {
        if (state.dateRange.startDate && state.dateRange.endDate) {
            const filtered = state.transactions.filter(t => {
                return t.TransactionDate >= state.dateRange.startDate! && t.TransactionDate <= state.dateRange.endDate!
            });
            setTransactionsInDateRange(filtered);
        }
    }, [state.dateRange, state.transactions]);

    const getMonthFromDate = (date: Date) => getMonthName(date.getMonth());

        const handleMonthBarClick = (month: string, type: "income" | "expenses") => {
                barClickType.current = type;
                setSelectedMonth(month);
                // For backward compatibility, also open generic modal
                const filtered = transactionsInDateRange.filter(t => getMonthFromDate(t.TransactionDate) === month && (type === 'income' ? t.Amount > 0 : t.Amount < 0));
                setModalTitle(`Transactions for ${month} (${type})`);
                setModalData(filtered);
                setModalColumns([
                    { key: 'TransactionDate', label: 'Date', render: (v: Date) => v instanceof Date ? v.toLocaleDateString() : String(v), sortable: true },
                    { key: 'Category', label: 'Category', sortable: true },
                    { key: 'Amount', label: 'Amount', render: (v: number, row: any) => (row.Amount >= 0 ? '+' : '-') + '$' + Math.abs(row.Amount).toLocaleString(), sortable: true },
                    { key: 'Description', label: 'Description', render: (v: string) => <span title={String(v)} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',display:'inline-block',maxWidth:120}}>{String(v)}</span>, sortable: true },
                ]);
                setModalSortKey('Amount');
                setModalSortDirection(type === 'income' ? 'desc' : 'asc');
                setModalOpen(true);
        };

        // Handlers for other charts
        const handleCategoryBarClick = (category: string) => {
                const filtered = transactionsInDateRange.filter(t => t.Category === category);
                setModalTitle(`Transactions for Category: ${category}`);
                setModalData(filtered);
                setModalColumns([
                    { key: 'TransactionDate', label: 'Date', render: (v: Date) => v instanceof Date ? v.toLocaleDateString() : String(v), sortable: true },
                    { key: 'Category', label: 'Category', sortable: true },
                    { key: 'Amount', label: 'Amount', render: (v: number, row: any) => (row.Amount >= 0 ? '+' : '-') + '$' + Math.abs(row.Amount).toLocaleString(), sortable: true },
                    { key: 'Description', label: 'Description', render: (v: string) => <span title={String(v)} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',display:'inline-block',maxWidth:120}}>{String(v)}</span>, sortable: true },
                ]);
                setModalSortKey('Amount');
                setModalSortDirection('desc');
                setModalOpen(true);
        };

        const handleMonthCountBarClick = (month: string) => {
                const filtered = transactionsInDateRange.filter(t => getMonthFromDate(t.TransactionDate) === month);
                setModalTitle(`Transactions for Month: ${month}`);
                setModalData(filtered);
                setModalColumns([
                    { key: 'TransactionDate', label: 'Date', render: (v: Date) => v instanceof Date ? v.toLocaleDateString() : String(v), sortable: true },
                    { key: 'Category', label: 'Category', sortable: true },
                    { key: 'Amount', label: 'Amount', render: (v: number, row: any) => (row.Amount >= 0 ? '+' : '-') + '$' + Math.abs(row.Amount).toLocaleString(), sortable: true },
                    { key: 'Description', label: 'Description', render: (v: string) => <span title={String(v)} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',display:'inline-block',maxWidth:120}}>{String(v)}</span>, sortable: true },
                ]);
                setModalSortKey('Amount');
                setModalSortDirection('desc');
                setModalOpen(true);
        };

        const handleMoneySpentCategoryClick = (category: string) => {
                const filtered = transactionsInDateRange.filter(t => t.Category === category && t.Category !== 'Income');
                setModalTitle(`Money Spent for Category: ${category}`);
                setModalData(filtered);
                setModalColumns([
                    { key: 'TransactionDate', label: 'Date', render: (v: Date) => v instanceof Date ? v.toLocaleDateString() : String(v), sortable: true },
                    { key: 'Category', label: 'Category', sortable: true },
                    { key: 'Amount', label: 'Amount', render: (v: number, row: any) => (row.Amount >= 0 ? '+' : '-') + '$' + Math.abs(row.Amount).toLocaleString(), sortable: true },
                    { key: 'Description', label: 'Description', render: (v: string) => <span title={String(v)} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',display:'inline-block',maxWidth:120}}>{String(v)}</span>, sortable: true },
                ]);
                setModalSortKey('Amount');
                setModalSortDirection('desc');
                setModalOpen(true);
        };

        const handleMoneySpentMonthClick = (month: string) => {
                const filtered = transactionsInDateRange.filter(t => getMonthFromDate(t.TransactionDate) === month && t.Category !== 'Income');
                setModalTitle(`Money Spent for Month: ${month}`);
                setModalData(filtered);
                setModalColumns([
                    { key: 'TransactionDate', label: 'Date', render: (v: Date) => v instanceof Date ? v.toLocaleDateString() : String(v), sortable: true },
                    { key: 'Category', label: 'Category', sortable: true },
                    { key: 'Amount', label: 'Amount', render: (v: number, row: any) => (row.Amount >= 0 ? '+' : '-') + '$' + Math.abs(row.Amount).toLocaleString(), sortable: true },
                    { key: 'Description', label: 'Description', render: (v: string) => <span title={String(v)} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',display:'inline-block',maxWidth:120}}>{String(v)}</span>, sortable: true },
                ]);
                setModalSortKey('Amount');
                setModalSortDirection('desc');
                setModalOpen(true);
        };

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
            events: {
                click: () => handleMonthBarClick(month, "income")
            }
        }));
        const expensesData = months.map((month) => ({
            name: month,
            y: monthlyTotals[month].expenses,
            events: {
                click: () => handleMonthBarClick(month, "expenses")
            }
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
        const data = countStringArray(transactionsInDateRange.map(t => t.Category)).map(d => ({
            ...d,
            events: {
                click: () => handleCategoryBarClick(d.name)
            }
        }));
        return {
            type: "column",
            name: "Transactions by Category",
            data,
        }
    }

    const mapTransactionsToMonthChart = () => {
        const monthCount = transactionsInDateRange.map(t => t.TransactionDate.getMonth());
        const data = countByMonth(monthCount).map(d => ({
            ...d,
            events: {
                click: () => handleMonthCountBarClick(d.name)
            }
        }));
        return {
            type: "column",
            name: "Transactions by Month",
            data,
        }
    }

    const mapMoneySpentToTypeChart = () => {
        const categoryTotals = transactionsInDateRange.reduce((acc, curr) => {
            // Exclude 'Income' category
            if (curr.Category === "Income") return acc;
            if (!acc[curr.Category]) {
                acc[curr.Category] = 0;
            }
            acc[curr.Category] += Math.abs(curr.Amount);
            return acc;
        }, {} as Record<string, number>);

        const data: { name: string; y: number; events?: any }[] = Object.entries(categoryTotals).map(
            ([category, total]) => ({
                name: category,
                y: total,
                events: {
                    click: () => handleMoneySpentCategoryClick(category)
                }
            })
        );
        return data;
    }

    const mapMoneySpentToMonthChart = () => {
        const monthlyTotals = transactionsInDateRange.reduce((acc, curr) => {
            // Exclude 'Income' category
            if (curr.Category === "Income") return acc;
            const date = new Date(curr.TransactionDate);
            const month = date.getMonth();
            const monthName = getMonthName(month);
        
            if (!acc[monthName]) {
                acc[monthName] = 0;
            }
            acc[monthName] += Math.abs(curr.Amount);
            return acc;
        }, {} as Record<string, number>);
        
        const data: { name: string; y: number; events?: any }[] = Object.entries(monthlyTotals).map(
            ([month, total]) => ({
                name: month,
                y: total,
                events: {
                    click: () => handleMoneySpentMonthClick(month)
                }
            })
        );
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

    // Filter transactions for selected month
    const transactionsForSelectedMonth = selectedMonth
        ? transactionsInDateRange.filter(t => getMonthFromDate(t.TransactionDate) === selectedMonth)
        : [];

    return (
        <div className="flex flex-col">
            <div className="flex flex-row gap-8 mb-8">
                <BarChart 
                    series={mapIncomeVsExpensesByMonthChart()} 
                    title="Income vs Expenses by Month" 
                    isDarkMode={darkMode} 
                    legendEnabled={true}
                />
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
                    <PieChart 
                        data={mapMoneySpentToTypeChart().map(d => ({
                            ...d,
                            events: {
                                click: () => handleMoneySpentCategoryClick(d.name)
                            }
                        }))} 
                        title="Money Spent by Category" 
                        isDarkMode={darkMode} 
                    />
                </div>
                <div className="flex-1">
                    <BarChart series={[mapMoneySpentToMonthChart()]} title="Money Spent by Month" isDarkMode={darkMode} />
                </div>
            </div>

            {/* Generic modal for all chart drilldowns */}
            <GenericChartModal
                open={modalOpen}
                title={modalTitle}
                data={modalData}
                columns={modalColumns}
                onClose={() => setModalOpen(false)}
                initialSortKey={modalSortKey}
                initialSortDirection={modalSortDirection}
            />
        </div>
    )
}