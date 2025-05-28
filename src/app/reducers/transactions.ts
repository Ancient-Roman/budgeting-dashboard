import { ParsedCsvTransaction } from "../types/csvParse";

export const initialState: TransactionsState = {
  transactions: [],
};

export type TransactionsState = {
    transactions: ParsedCsvTransaction[];
};
  
export type Action =
    | { type: 'addTransactions'; payload: ParsedCsvTransaction[] }
    | { type: 'deleteTransaction'; payload: number }
    | { type: 'clearTransactions'; payload: undefined };

export function reducer(state: TransactionsState, action: Action): TransactionsState {
  switch (action.type) {
    case "addTransactions":
        return {
            ...state,
            transactions: [...state.transactions, ...action.payload],
        };
    case "clearTransactions":
        return {
            ...state,
            transactions: [],
        };
    case "deleteTransaction":
        return {
            ...state,
            transactions: state.transactions.filter(t => t.Id !== action.payload),
        };
    default:
      return state;
  }
}