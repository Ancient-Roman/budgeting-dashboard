import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  // Gather debug info for all fields
  const entries = Array.from(formData.entries()) as [string, FormDataEntryValue][];
  const debugInfo = entries.map(([key, value]) => ({
    key,
    valueType: typeof value,
    isFile: value instanceof File,
    fileName: value instanceof File ? value.name : undefined,
  }));

  // Extract all File objects from all fields
  const allFiles: File[] = entries
    .filter(([, value]) => value instanceof File)
    .map(([, value]) => value as File);

  if (!allFiles.length) {
    return new Response(
      JSON.stringify({ error: 'No files uploaded', debug: debugInfo }),
      { status: 400 }
    );
  }

  const results: { name: string; content: string }[] = [];

  for (const file of allFiles) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      continue; // skip non-csv files
    }
    const content = await file.text();
    results.push({ name: file.name, content });
  }

  return new Response(
    JSON.stringify({ success: true, files: results, debug: debugInfo }),
    { status: 200 }
  );
}
