import { convertCsvToDetail } from "../helpers/csvHelpers";
import { filterTransactions } from "../helpers/date-helpers";
import { CsvTransactionDetail, ParsedCsvTransaction } from "../types/csvParse";
import { DateRange } from "../types/date";

export const initialState: TransactionsState = {
    transactionStrings: [],
    transactions: [],
    filteredTransactions: [],
    dateRange: {
        startDate: new Date(),
        endDate: new Date(),
    }
};

export type TransactionsState = {
    transactionStrings: ParsedCsvTransaction[];
    transactions: CsvTransactionDetail[]; 
    filteredTransactions: CsvTransactionDetail[];
    dateRange: DateRange;
};
  
export type Action =
    | { type: 'addTransactions'; payload: ParsedCsvTransaction[] }
    | { type: 'deleteTransaction'; payload: number }
    | { type: 'clearTransactions'; payload: undefined }
    | { type: 'setDateRange'; payload: DateRange };

export function reducer(state: TransactionsState, action: Action): TransactionsState {
  switch (action.type) {
    case "addTransactions":
        const transactionStrings = [...state.transactionStrings, ...action.payload];
        const transactions = transactionStrings.map(t => convertCsvToDetail(t)).filter(t => t.Type !== "Payment");

        return {
            ...state,
            transactionStrings,
            transactions,
            filteredTransactions: filterTransactions(transactions, state.dateRange),
        };
    case "clearTransactions":
        return {
            ...state,
            transactionStrings: [],
            transactions: [],
            filteredTransactions: [],
        };
    case "deleteTransaction":
        return {
            ...state,
            transactionStrings: state.transactionStrings.filter(t => t.Id !== action.payload),
            transactions: state.transactions.filter(t => t.Id !== action.payload),
            filteredTransactions: state.transactions.filter(t => t.Id !== action.payload),
        };
    case "setDateRange":
        return {
            ...state,
            dateRange: action.payload,
            filteredTransactions: filterTransactions(state.transactions, action.payload),
        }
    default:
      return state;
  }
}