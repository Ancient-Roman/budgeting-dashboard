"use client";

import { useTransactions } from "../context/transactionsContext";
import BarChart from "./charts/barChart";

export const TransactionsChartDisplay = () => {
    const { state } = useTransactions();

    function countStringArray(values: string[]) {
        const counts: Record<string, number> = {};
      
        for (const value of values) {
          counts[value] = (counts[value] || 0) + 1;
        }
      
        return Object.entries(counts)
            .map(([value, count]) => ({ name: value, y: count }))
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

    return (
        <BarChart series={[mapTransactionsToTypeChart()]} title="Transactions by Category" isDarkMode/>
    )
}