import { convertCsvToDetail } from "../helpers/csvHelpers";
import { CsvTransactionDetail, ParsedCsvTransaction } from "../types/csvParse";

export const initialState: TransactionsState = {
    transactionStrings: [],
    transactions: [],
};

export type TransactionsState = {
    transactionStrings: ParsedCsvTransaction[];
    transactions: CsvTransactionDetail[]; 
};
  
export type Action =
    | { type: 'addTransactions'; payload: ParsedCsvTransaction[] }
    | { type: 'deleteTransaction'; payload: number }
    | { type: 'clearTransactions'; payload: undefined };

export function reducer(state: TransactionsState, action: Action): TransactionsState {
  switch (action.type) {
    case "addTransactions":
        const transactionStrings = [...state.transactionStrings, ...action.payload];
        const transactions = transactionStrings.map(t => convertCsvToDetail(t)).filter(t => t.Type !== "Payment");

        return {
            ...state,
            transactionStrings,
            transactions,
        };
    case "clearTransactions":
        return {
            ...state,
            transactionStrings: [],
            transactions: [],
        };
    case "deleteTransaction":
        return {
            ...state,
            transactionStrings: state.transactionStrings.filter(t => t.Id !== action.payload),
            transactions: state.transactions.filter(t => t.Id !== action.payload),
        };
    default:
      return state;
  }
}