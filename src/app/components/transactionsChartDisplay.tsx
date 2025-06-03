"use client";

import { useTransactions } from "../context/transactionsContext";
import { convertCsvToDetail } from "../helpers/csvHelpers";
import { getMonthName } from "../helpers/date-helpers";
import BarChart from "./charts/barChart";

export const TransactionsChartDisplay = () => {
    const { state } = useTransactions();

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
        const monthCount = state.transactions.map(t => convertCsvToDetail(t).TransactionDate.getMonth());
        const data = countByMonth(monthCount);

        console.log(data);

        return {
            type: "column",
            name: "Transactions by Month",
            data,
        }
    }

    return (
        <>
            <BarChart series={[mapTransactionsToTypeChart()]} title="Transactions by Category" isDarkMode/>
            <BarChart series={[mapTransactionsToMonthChart()]} title="Transactions by Month" isDarkMode/>
        </>
    )
}