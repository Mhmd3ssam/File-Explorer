import { findFolder, getFolderStats } from '@/lib/data';
import { FoldersClient, type FolderSummary } from '@/components/business/FoldersClient';
import type { FileNode } from '@/lib/data-client';

export default function FoldersPage() {
  const root = findFolder('root');
  
  // Separate folders and files
  const folders = (root?.children || []).filter((c) => c.type === 'folder');
  const files = (root?.children || []).filter((c) => c.type === 'file') as FileNode[];
  
  // Create folder summaries
  const folderSummaries: FolderSummary[] = folders.map((f) => {
    const stats = getFolderStats(f);
    return { id: f.id, name: f.name, fileCount: stats.fileCount, size: stats.size };
  });

  return <FoldersClient folders={folderSummaries} files={files} />;
}
