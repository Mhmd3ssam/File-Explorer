import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { findFolder, saveData } from '@/lib/data';
import { writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const providedName = formData.get('name')?.toString();
  const parent = findFolder(params.id);
  
  console.log('Creating file in folder:', params.id, 'Parent found:', !!parent);
  
  if (!parent || !file) {
    return NextResponse.json({ error: 'Invalid request: missing parent or file' }, { status: 400 });
  }

  // Decide filename: prefer 'name' field, fallback to uploaded file's original name
  let rawName = (providedName && providedName.trim()) ? providedName.trim() : file.name;
  // If custom name provided without extension, append original extension from uploaded file
  if (providedName && providedName.trim() && !rawName.includes('.')) {
    const originalExt = (file.name.split('.').pop() || '').toLowerCase();
    if (originalExt) rawName = `${rawName}.${originalExt}`;
  }
  const safeName = basename(rawName);
  if (!safeName) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }

  // Infer kind by extension
  const ext = safeName.split('.').pop()?.toLowerCase() || '';
  let kind: 'document' | 'image' | 'video' | 'audio' | 'unknown' = 'unknown';
  if (['png','jpg','jpeg','gif','webp','svg'].includes(ext)) kind = 'image';
  else if (['mp4','mov','webm','mkv','avi'].includes(ext)) kind = 'video';
  else if (['mp3','wav','ogg','flac','m4a'].includes(ext)) kind = 'audio';
  else if (['pdf','doc','docx','ppt','pptx','xls','xlsx','txt','md'].includes(ext)) kind = 'document';
  if (kind === 'unknown') {
    const mime = (file as any)?.type || '';
    if (mime.startsWith('image/')) kind = 'image';
    else if (mime.startsWith('video/')) kind = 'video';
    else if (mime.startsWith('audio/')) kind = 'audio';
    else if (mime === 'application/pdf') kind = 'document';
  }

  const publicDir = join(process.cwd(), 'public');
  const filePath = join(publicDir, safeName);

  // If a file with the same name exists, auto-rename: "name (1).ext", "name (2).ext", ...
  function buildUniqueName(original: string, attempt: number): string {
    if (attempt === 0) return original;
    const idx = original.lastIndexOf('.')
    if (idx > 0) {
      const base = original.slice(0, idx)
      const ext = original.slice(idx)
      return `${base} (${attempt})${ext}`
    }
    return `${original} (${attempt})`
  }

  try {
    // Ensure public directory exists and create the file (auto-rename on conflict)
    await mkdir(publicDir, { recursive: true });
    const bytes = await file.arrayBuffer();

    let attempt = 0;
    let finalName = safeName;
    while (true) {
      try {
        const targetPath = join(publicDir, finalName);
        await writeFile(targetPath, Buffer.from(bytes), { flag: 'wx' });
        // success
        break;
      } catch (errAny: any) {
        if (errAny && typeof errAny === 'object' && 'code' in errAny && (errAny as any).code === 'EEXIST') {
          attempt += 1;
          finalName = buildUniqueName(safeName, attempt);
          continue;
        }
        console.error('Failed to create file in public folder:', errAny);
        return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
      }
    }

    // Update in-memory structure after successful file creation
    parent.children.push({
      id: randomUUID(),
      name: finalName,
      type: 'file',
      kind,
    });

    // Save the updated structure to disk
    saveData();
  } catch (err: any) {
    console.error('Unexpected failure while creating file:', err);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }

  // Revalidate the correct paths
  revalidatePath('/dashboard');
  revalidatePath('/folders');
  if (params.id === 'root') {
    // For root folder, revalidate the main folders page
    revalidatePath('/folders');
  } else {
    revalidatePath(`/dashboard/folder/${params.id}`);
    revalidatePath(`/folders/folder/${params.id}`);
  }

  return NextResponse.json({ success: true });
}
