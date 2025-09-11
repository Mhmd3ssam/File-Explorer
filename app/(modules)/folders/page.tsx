import { findFolder } from '@/lib/data';
import { Table, type TableRow } from '@/components/shared/Table';
import Link from 'next/link';

export default function FoldersPage() {
  const folder = findFolder('root');
  const headers = ['Name', 'Type'];
  const rows: TableRow[] = (folder?.children ?? []).map((node) => ({
    id: node.id,
    cells: [
      node.type === 'folder' ? (
        <Link key={node.id} className="text-blue-600 hover:underline" href={`/dashboard/folder/${node.id}`}>
          {node.name}
        </Link>
      ) : (
        node.name
      ),
      node.type,
    ],
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Folders</h1>
      <Table headers={headers} rows={rows} />
    </div>
  );
} 