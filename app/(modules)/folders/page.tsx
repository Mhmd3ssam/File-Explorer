import { findFolder, getFolderStats, formatSize } from '@/lib/data';
import { FoldersClient } from '@/components/business/FoldersClient';
import type { FileNode, FolderSummary } from '@/lib/data-client';

export default function FoldersPage() {
  const root = findFolder('root');
  
  // Separate folders and files
  const folders = (root?.children || []).filter((c) => c.type === 'folder');
  const files = (root?.children || []).filter((c) => c.type === 'file') as FileNode[];
  
  // Create folder summaries
  const folderSummaries: FolderSummary[] = folders.map((f) => {
    const stats = getFolderStats(f.id);
    return { id: f.id, name: f.name, fileCount: stats.fileCount, size: formatSize(stats.totalSize) };
  });

  return <FoldersClient folders={folderSummaries} files={files} />;
}
