import { NextResponse } from 'next/server';
import { getAllFiles } from '@/lib/data';

export async function GET() {
  try {
    const allFiles = getAllFiles();
    return NextResponse.json(allFiles);
  } catch (error) {
    console.error('Failed to get files:', error);
    return NextResponse.json({ error: 'Failed to get files' }, { status: 500 });
  }
}
