"use client";

import { useState } from 'react';
import { FolderCard } from '@/components/shared/FolderCard';
import { FileCard } from '@/components/shared/FileCard';
import { EditFolderButton } from '@/components/business/EditFolderButton';
import { DeleteFolderButton } from '@/components/business/DeleteFolderButton';

type AnyNode = any;

export function FolderItemsClient({ nodes }: { nodes: AnyNode[] }) {
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((n: any) => (
          n.type === 'folder' ? (
            <FolderCard
              key={n.id}
              id={n.id}
              name={n.name}
              fileCount={(n.children || []).filter((c: any) => c.type === 'file').length}
              size=""
              href={`/folders/folder/${n.id}`}
              onEdit={() => setEditingFolderId(n.id)}
              onDelete={() => setDeletingFolderId(n.id)}
            />
          ) : (
            <FileCard key={n.id} name={n.name} kind={n.kind} />
          )
        ))}
      </div>

      {editingFolderId && (
        <EditFolderButton
          folderId={editingFolderId}
          open={!!editingFolderId}
          onOpenChange={(open) => !open && setEditingFolderId(null)}
        />
      )}
      {deletingFolderId && (
        <DeleteFolderButton
          folderId={deletingFolderId}
          folderName={nodes.find((x: any) => x.id === deletingFolderId)?.name || ''}
          open={!!deletingFolderId}
          onOpenChange={(open) => !open && setDeletingFolderId(null)}
        />
      )}
    </>
  );
}
