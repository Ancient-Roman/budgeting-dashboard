import Papa from "papaparse";
import { ColumnType, CsvTransactionDetail, OutputColumnType, ParsedCsvTransaction } from "../types/csvParse";
import normalizeCsvHeader from './headerNormalizer';

export const convertCsvToDetail = (parsed: ParsedCsvTransaction): CsvTransactionDetail => ({
    ...parsed,
    // Normalize amount: remove $ and commas so Number() parses correctly and adjust sign per Type
    Amount: (() => {
        const raw = parsed.Amount ?? '';
        const cleaned = String(raw).replace(/[$,]/g, '').trim();
        const base = cleaned === '' ? 0 : Number(cleaned);
        const t = (parsed.Type || '').toString().trim().toLowerCase();

        // Sale or Debit => negative expense
        // Payment or Credit => positive
        if (t === 'sale' || t === 'debit') return -Math.abs(base);
        if (t === 'payment' || t === 'credit') return Math.abs(base);

        return base;
    })(),
    PostDate: parsed.PostDate ? new Date(parsed.PostDate) : undefined,
    TransactionDate: new Date(parsed.TransactionDate),
    Category: parsed.Category ?? "Unknown",
});

function hasHeader(row: string[]): boolean {
    return row.every(cell => isNaN(Date.parse(cell)) && !isLikelyAmount(cell));
};

function isLikelyDate(value: string): boolean {
    return /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(value) || /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/.test(value);
}

function isLikelyAmount(value: string): boolean {
    const cleaned = value.replace(/[$,]/g, '');
    return /^-?\d+(\.\d{1,2})?$/.test(cleaned);
}

function isLikelyDescription(value: string): boolean {
    return /[a-zA-Z]/.test(value) && value.length > 3;
}

function addHeadersToCsvData(csvData: string[][], columnTypes: Record<number, OutputColumnType>): string[][] {
    const headers: string[] = [];

    for (let i = 0; i < csvData[0].length; i++) {
        headers.push(columnTypes[i] || `column${i + 1}`);
    }

    return [headers, ...csvData];
}

function inferColumnTypes(csvRows: string[][]): Record<number, OutputColumnType> {
    const columnScores: Record<number, Record<ColumnType, number>> = {};
    const numRows = csvRows.length;
    const threshold = Math.floor(numRows * 0.7); // 70% threshold
    const usedTypes = new Set<ColumnType>();

    for (const row of csvRows) {
        row.forEach((cell, index) => {
            if (!columnScores[index]) {
                columnScores[index] = {
                    TransactionDate: 0,
                    Amount: 0,
                    Description: 0,
                };
            }

            const trimmed = cell.trim();

            if (isLikelyDate(trimmed)) columnScores[index].TransactionDate += 1;
            if (isLikelyAmount(trimmed)) columnScores[index].Amount += 1;
            if (isLikelyDescription(trimmed)) columnScores[index].Description += 1;
        });
    }

    const result: Record<number, OutputColumnType> = {};

    // Rank columns by best score for assignment priority
    const columnsSortedByConfidence = Object.entries(columnScores)
        .map(([colIndexStr, scores]) => {
            const colIndex = parseInt(colIndexStr);
            const [bestType, bestScore] = Object.entries(scores).reduce((a, b) =>
                a[1] > b[1] ? a : b
            );
            return { colIndex, bestType: bestType as ColumnType, bestScore };
        })
        // Sort descending by score
        .sort((a, b) => b.bestScore - a.bestScore);

    for (const { colIndex, bestType, bestScore } of columnsSortedByConfidence) {
        if (bestScore >= threshold && !usedTypes.has(bestType)) {
            result[colIndex] = bestType;
            usedTypes.add(bestType);
        } else {
            result[colIndex] = ""; // assign blank if not confident or already used
        }
    }

    return result;
}

function removeBlankColumns(
    csvRows: string[][],
    columnHeaders: Record<number, string>
): { rows: string[][]; headers: Record<number, ColumnType> } {
    // Find valid (non-blank) column indices
    const validIndices = Object.entries(columnHeaders)
        .filter(([, header]) => header !== "")
        .map(([index]) => parseInt(index))
        .sort((a, b) => a - b);

    // Create cleaned rows
    const filteredRows = csvRows.map(row =>
        validIndices.map(index => row[index] ?? "")
    );

    // Create cleaned headers with re-indexed keys
    const filteredHeaders: Record<number, ColumnType> = {};
    validIndices.forEach((originalIndex, newIndex) => {
        filteredHeaders[newIndex] = columnHeaders[originalIndex] as ColumnType;
    });

    return {
        rows: filteredRows,
        headers: filteredHeaders,
    };
}


export function parseCsvWithOptionalHeaders(
    csvString: string
): Papa.ParseResult<ParsedCsvTransaction> {
    // Step 1: Raw parse without headers
    const preview = Papa.parse<string[]>(csvString, {
        skipEmptyLines: true,
    });

    const data = preview.data;

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("CSV is empty or invalid");
    }

    // Step 2: Check for headers
    const headerExists = hasHeader(data[0]);

    let finalCsvData: string[][];

    if (headerExists) {
        // Use as-is
        finalCsvData = data as string[][];
    } else {
        // Infer headers and add to data
        const inferredTypes = inferColumnTypes(data);
        const { rows: cleanedRows, headers: cleanedHeaders } = removeBlankColumns(data, inferredTypes);
        finalCsvData = addHeadersToCsvData(cleanedRows, cleanedHeaders);
    }

    // Step 3: Re-parse with headers
    const finalCsvString = Papa.unparse(finalCsvData);

    return Papa.parse<ParsedCsvTransaction>(finalCsvString, {
        header: true,
        skipEmptyLines: true,
        transformHeader: function(header) {
            return normalizeCsvHeader(header);
        },
    });
}