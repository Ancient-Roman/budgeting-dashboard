export type ParsedCsvTransaction = {
    Id: number;
    Amount: string;
    Category?: string;
    Description: string;
    Memo?: string;
    PostDate?: string;
    TransactionDate: string;
    Type?: string;
}

export type CsvTransactionDetail = {
    Id: number;
    Amount: number;
    Category: string;
    Description: string;
    Memo?: string;
    PostDate?: Date;
    TransactionDate: Date;
    Type?: string;
}

// essential columns needed for analysis
export type ColumnType = 'TransactionDate' | 'Amount' | 'Description';
export type OutputColumnType = ColumnType | "";