import { findFolder, getFolderStats } from '@/lib/data';
import { FoldersClient, type FolderSummary } from '@/components/business/FoldersClient';

export default function FoldersPage() {
  const root = findFolder('root');
  const folders = (root?.children || []).filter((c) => c.type === 'folder');
  const summaries: FolderSummary[] = folders.map((f) => {
    const stats = getFolderStats(f);
    return { id: f.id, name: f.name, fileCount: stats.fileCount, size: stats.size };
  });

  return <FoldersClient folders={summaries} />;
}
