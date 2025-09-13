"use client";

import { useState } from 'react';
import { FolderCard } from '@/components/shared/FolderCard';
import { FileCard } from '@/components/shared/FileCard';
import { EditFolderButton } from '@/components/business/EditFolderButton';
import { DeleteFolderButton } from '@/components/business/DeleteFolderButton';
import { EditFileButton } from '@/components/business/EditFileButton';
import { DeleteFileButton } from '@/components/business/DeleteFileButton';
import type { AnyNode } from '@/lib/data-client';

export function FolderItemsClient({ nodes }: { nodes: AnyNode[] }) {
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  // Calculate folder size
  const getFolderSize = (folder: any): string => {
    const totalSize = (folder.children || []).reduce((sum: number, child: any) => {
      return sum + (child.type === 'file' ? getFileSize(child.name) : 0);
    }, 0);
    return formatSize(totalSize);
  };

  // Calculate file size
  const getFileSize = (fileName: string): number => {
    return fileName.length * 1024; // Mock size calculation
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Determine if an item is in the first row (first 4 items)
  const isFirstRow = (index: number) => index < 4;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-6">
        {nodes.map((n: any, index: number) => (
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
              isLastItem={index === nodes.length - 1}
              isFirstRow={isFirstRow(index)}
            />
          ) : (
            <FileCard 
              key={n.id} 
              id={n.id}
              name={n.name} 
              kind={n.kind}
              size={formatSize(getFileSize(n.name))}
              onEdit={() => setEditingFileId(n.id)}
              onDelete={() => setDeletingFileId(n.id)}
              isLastItem={index === nodes.length - 1}
              isFirstRow={isFirstRow(index)}
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
      {editingFileId && (
        <EditFileButton
          fileId={editingFileId}
          fileName={nodes.find((x: any) => x.id === editingFileId)?.name || ''}
          open={!!editingFileId}
          onOpenChange={(open) => !open && setEditingFileId(null)}
        />
      )}
      {deletingFileId && (
        <DeleteFileButton
          fileId={deletingFileId}
          fileName={nodes.find((x: any) => x.id === deletingFileId)?.name || ''}
          open={!!deletingFileId}
          onOpenChange={(open) => !open && setDeletingFileId(null)}
        />
      )}
    </div>
  );
}
