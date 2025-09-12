import { findFolder, getFolderPath } from '@/lib/data';
import { CreateFolderButton } from '@/components/business/CreateFolderButton';
import { CreateFileButton } from '@/components/business/CreateFileButton';
import { FolderList } from '@/components/shared/FolderList';
import { Breadcrumbs, type Crumb } from '@/components/shared/Breadcrumbs';

interface Props { params: { id: string } }

export default function FoldersFolderPage({ params }: Props) {
  const folder = findFolder(params.id);
  if (!folder) return <p>Folder not found</p>;

  const path = getFolderPath(folder.id);
  const crumbs: Crumb[] = path.map((f, idx) => ({
    id: f.id,
    name: f.name === 'root' ? 'root' : f.name,
    href: idx < path.length - 1 ? (f.id === 'root' ? '/folders' : `/folders/folder/${f.id}`) : undefined,
  }));

  return (
    <div className="space-y-4">
      <Breadcrumbs items={crumbs} />
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{folder.name}</h1>
        <div className="flex gap-2">
          <CreateFileButton parentId={folder.id} allowDestinationSelect={false} />
          <CreateFolderButton parentId={folder.id} />
        </div>
      </div>
      <FolderList nodes={folder.children} />
    </div>
  );
}
