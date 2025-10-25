"use client";

import { useTransactions } from "../context/transactionsContext";
import { ParsedCsvTransaction } from "../types/csvParse";
import { DataTable } from "./common/dataTable";

export const TransactionsListDisplay = () => {
    const { state, dispatch } = useTransactions();

    const deleteTransaction = (row: ParsedCsvTransaction) => {
        dispatch({
            type: "deleteTransaction",
            payload: row.Id,
        });
    }

    // Convert CsvTransactionDetail[] to ParsedCsvTransaction[] for DataTable
    const filteredRows: ParsedCsvTransaction[] = state.filteredTransactions.map(t => ({
        ...t,
        Amount: t.Amount.toString(),
        TransactionDate: t.TransactionDate instanceof Date ? t.TransactionDate.toISOString().slice(0, 10) : t.TransactionDate,
        PostDate: t.PostDate instanceof Date ? t.PostDate.toISOString().slice(0, 10) : t.PostDate,
    }));
    return (
        <DataTable data={filteredRows} onDelete={deleteTransaction} hiddenColumns={["Id", "Memo"]}/>
    );
}