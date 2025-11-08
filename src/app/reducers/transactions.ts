import { convertCsvToDetail } from "../helpers/csvHelpers";
import { filterTransactions } from "../helpers/date-helpers";
import { CsvTransactionDetail, ParsedCsvTransaction } from "../types/csvParse";
import { CategoryBudgetItem } from "../helpers/budgetHelpers";
import { DateRange } from "../types/date";

export const initialState: TransactionsState = {
    transactionStrings: [],
    transactions: [],
    filteredTransactions: [],
    categoryBudgets: {},
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
    categoryBudgets?: Record<string, CategoryBudgetItem[]>;
};
  
export type Action =
    | { type: 'addTransactions'; payload: ParsedCsvTransaction[] }
    | { type: 'deleteTransaction'; payload: number }
    | { type: 'clearTransactions'; payload: undefined }
    | { type: 'setDateRange'; payload: DateRange }
    | { type: 'setTransactionCategory'; payload: {id: number, category: string} }
    | { type: 'setCategoryBudgets'; payload: { monthKey: string; budgets: CategoryBudgetItem[] } };

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
    case "setCategoryBudgets":
        return {
            ...state,
            categoryBudgets: {
                ...(state.categoryBudgets || {}),
                [action.payload.monthKey]: action.payload.budgets,
            }
        }
    case "setTransactionCategory":
        return {
            ...state,
            transactions: state.transactions.map(t =>
                t.Id === action.payload.id
                    ? { ...t, Category: action.payload.category }
                    : t
            ),
            transactionStrings: state.transactionStrings.map(t =>
                t.Id === action.payload.id
                    ? { ...t, Category: action.payload.category }
                    : t
            ),
            filteredTransactions: state.filteredTransactions.map(t =>
                t.Id === action.payload.id
                    ? { ...t, Category: action.payload.category }
                    : t
            ),
        };
    default:
      return state;
  }
}