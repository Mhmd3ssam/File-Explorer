import { findFolder } from '@/lib/data';
import { CreateFolderButton } from '@/components/business/CreateFolderButton';
import { CreateFileButton } from '@/components/business/CreateFileButton';
import { FolderList } from '@/components/shared/FolderList';

export default function DashboardPage() {
  const folder = findFolder('root');
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">All files</h1>
        <div className="flex gap-2">
          <CreateFileButton parentId="root" />
          <CreateFolderButton parentId="root" />
        </div>
      </div>
      {folder && <FolderList nodes={folder.children} />}
    </div>
  );
} 