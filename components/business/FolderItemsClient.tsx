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

  // Calculate file size for files (simulated)
  const getFileSize = (fileName: string) => {
    // Simulate file size based on name length
    const sizeInBytes = fileName.length * 1024;
    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };
    return formatSize(sizeInBytes);
  };

  // Calculate folder size (simulated)
  const getFolderSize = (folder: any) => {
    const fileCount = (folder.children || []).filter((c: any) => c.type === 'file').length;
    const totalSize = (folder.children || []).reduce((acc: number, child: any) => {
      if (child.type === 'file') {
        return acc + child.name.length * 1024; // Same calculation as getFileSize
      }
      return acc;
    }, 0);
    
    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };
    return formatSize(totalSize);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-6">
        {nodes.map((n: any) => (
          n.type === 'folder' ? (
            <FolderCard
              key={n.id}
              id={n.id}
              name={n.name}
              fileCount={(n.children || []).filter((c: any) => c.type === 'file').length}
              size={getFolderSize(n)}
              href={`/folders/folder/${n.id}`}
              onEdit={() => setEditingFolderId(n.id)}
              onDelete={() => setDeletingFolderId(n.id)}
            />
          ) : (
            <FileCard 
              key={n.id} 
              id={n.id}
              name={n.name} 
              kind={n.kind}
              size={getFileSize(n.name)}
              onEdit={() => {
                // TODO: Implement file editing
                console.log('Edit file:', n.name);
              }}
              onDelete={() => {
                // TODO: Implement file deletion
                console.log('Delete file:', n.name);
              }}
            />
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
    </div>
  );
}
