export function normalizeCsvHeader(header: string | undefined): string {
  const raw = String(header || '');
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  // strip leading 'transaction' if present
  const withoutTransaction = cleaned.replace(/^transaction/, '');

  // mapping heuristics
  if (/^id$/.test(withoutTransaction) || /^transactionid$/.test(cleaned)) return 'Id';
  if (withoutTransaction.includes('postdate') || cleaned.includes('postdate')) return 'PostDate';
  if (withoutTransaction.includes('date') || cleaned.includes('transactiondate')) return 'TransactionDate';
  if (withoutTransaction.includes('amount') || withoutTransaction.includes('amt') || cleaned.includes('total')) return 'Amount';
  if (withoutTransaction.includes('category')) return 'Category';
  if (withoutTransaction.includes('description') || withoutTransaction.includes('memo') || withoutTransaction.includes('notes') || withoutTransaction.includes('payee')) return 'Description';
  if (withoutTransaction.includes('type') || cleaned.includes('transactiontype')) return 'Type';

  // default: remove whitespace
  return raw.replace(/\s+/g, '');
}

export default normalizeCsvHeader;
