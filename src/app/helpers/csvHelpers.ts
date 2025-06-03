import { CsvTransactionDetail, ParsedCsvTransaction } from "../types/csvParse";

export const convertCsvToDetail = (parsed: ParsedCsvTransaction): CsvTransactionDetail => ({
    ...parsed,
    Amount: Number(parsed.Amount),
    PostDate: new Date(parsed.PostDate),
    TransactionDate: new Date(parsed.TransactionDate),
})