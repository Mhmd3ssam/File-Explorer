import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { findFolder, renameFolder, deleteFolderById } from '@/lib/data';
import { randomUUID } from 'crypto';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const folder = findFolder(params.id);
  if (!folder) {
    return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
  }
  return NextResponse.json(folder);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name } = await req.json();
  const parent = findFolder(params.id);
  if (!parent || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  parent.children.push({
    id: randomUUID(),
    name: name.trim(),
    type: 'folder',
    children: [],
  });
  revalidatePath('/dashboard');
  revalidatePath('/folders');
  revalidatePath(`/dashboard/folder/${params.id}`);
  revalidatePath(`/folders/folder/${params.id}`);
  return NextResponse.json({ success: true });
} 

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { name } = await req.json();
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (!trimmed) return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  const ok = renameFolder(params.id, trimmed);
  if (!ok) return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
  revalidatePath('/dashboard');
  revalidatePath('/folders');
  revalidatePath(`/dashboard/folder/${params.id}`);
  revalidatePath(`/folders/folder/${params.id}`);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = deleteFolderById(params.id);
  if (!ok) return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
  revalidatePath('/dashboard');
  revalidatePath('/folders');
  return NextResponse.json({ success: true });
}
