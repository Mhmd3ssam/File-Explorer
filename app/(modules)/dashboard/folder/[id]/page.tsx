import { findFolder } from '@/lib/data';
import { CreateFolderButton } from '@/components/business/CreateFolderButton';
import { CreateFileButton } from '@/components/business/CreateFileButton';
import { FolderList } from '@/components/shared/FolderList';

interface Props {
  params: { id: string };
}

export default function DashboardFolderPage({ params }: Props) {
  const folder = findFolder(params.id);
  if (!folder) {
    return <p>Folder not found</p>;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{folder.name}</h1>
        <div className="flex gap-2">
          <CreateFileButton parentId={folder.id} />
          <CreateFolderButton parentId={folder.id} />
        </div>
      </div>
      <FolderList nodes={folder.children} />
    </div>
  );
} 