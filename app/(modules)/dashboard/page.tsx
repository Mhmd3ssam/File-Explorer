import { findFolder } from '@/lib/data';
import { FolderList } from '@/components/shared/FolderList';

export default function DashboardPage() {
  const folder = findFolder('root');
  return (
    <div>
      {folder && <FolderList nodes={folder.children} />}
    </div>
  );
}
