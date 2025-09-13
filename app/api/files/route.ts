import { NextResponse } from 'next/server';
import { findFolder } from '@/lib/data';

export async function GET() {
  try {
    const root = findFolder('root');
    const allFiles = (root?.children || []).filter((child) => child.type === 'file');
    return NextResponse.json(allFiles);
  } catch (error) {
    console.error('Failed to get files:', error);
    return NextResponse.json({ error: 'Failed to get files' }, { status: 500 });
  }
}
