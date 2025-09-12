import { NextResponse } from 'next/server';
import { getAllFolders } from '@/lib/data';

export async function GET() {
  try {
    const folders = getAllFolders();
    return NextResponse.json(folders);
  } catch (error) {
    console.error('Failed to get folders:', error);
    return NextResponse.json({ error: 'Failed to get folders' }, { status: 500 });
  }
}
