import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) {
    return new Response(JSON.stringify({ error: 'No files uploaded' }), { status: 400 });
  }

  const results: { name: string; content: string }[] = [];

  for (const file of files) {
    if (!file.name.endsWith('.csv')) {
      continue; // skip non-csv files
    }

    const content = await file.text();
    results.push({ name: file.name, content });
  }

  return new Response(JSON.stringify({ success: true, files: results }), {
    status: 200,
  });
}
