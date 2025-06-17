import { CsvTransactionDetail } from "../types/csvParse";
import { DateRange } from "../types/date";

export function getMonthName(monthNumber) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return months[monthNumber]; // 0 - 11
}

export const filterTransactions = (transactions: CsvTransactionDetail[], dateRange: DateRange) => {
    const { startDate, endDate } = dateRange;

    if (endDate != null){
        return transactions.filter(t => t.TransactionDate.getTime() >= startDate.getTime() 
            && t.TransactionDate.getTime() <= endDate.getTime());
    }

    return transactions.filter(t => t.TransactionDate.getTime() >= startDate.getTime());
}