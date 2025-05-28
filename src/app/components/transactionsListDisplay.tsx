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

    return (
        <DataTable data={state.transactions} onDelete={deleteTransaction} hiddenColumns={["Id", "Memo"]}/>
    );
}