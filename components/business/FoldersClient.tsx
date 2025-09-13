"use client";

import { useState } from 'react';
import { FolderCard } from '@/components/shared/FolderCard';
import { FileCard } from '@/components/shared/FileCard';
import { FolderIcon } from '@/components/shared/icons';
import { EditFolderButton } from '@/components/business/EditFolderButton';
import { DeleteFolderButton } from '@/components/business/DeleteFolderButton';
import { EditFileButton } from '@/components/business/EditFileButton';
import { DeleteFileButton } from '@/components/business/DeleteFileButton';
import type { FolderSummary, FileNode } from '@/lib/data-client';

export function FoldersClient({ folders, files }: { folders: FolderSummary[], files: FileNode[] }) {
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const totalItems = folders.length + files.length;

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

  return (
    <div className="space-y-4">
      {totalItems === 0 ? (
        <div className="text-center py-12">
          <FolderIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No folders or files yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first folder or upload a file to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {/* Render folders */}
          {folders.map((f, index) => (
            <FolderCard
              key={f.id}
              id={f.id}
              name={f.name}
              fileCount={f.fileCount}
              size={f.size}
              href={`/folders/folder/${f.id}`}
              onEdit={() => setEditingFolderId(f.id)}
              onDelete={() => setDeletingFolderId(f.id)}
              isLastItem={index === folders.length - 1 && files.length === 0}
            />
          ))}
          
          {/* Render files */}
          {files.map((f, index) => (
            <FileCard
              key={f.id}
              id={f.id}
              name={f.name}
              kind={f.kind}
              size={formatSize(getFileSize(f.name))}
              onEdit={() => setEditingFileId(f.id)}
              onDelete={() => setDeletingFileId(f.id)}
              isLastItem={index === files.length - 1}
            />
          ))}
        </div>
      )}

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
          folderName={folders.find(f => f.id === deletingFolderId)?.name || ''}
          open={!!deletingFolderId}
          onOpenChange={(open) => !open && setDeletingFolderId(null)}
        />
      )}
      {editingFileId && (
        <EditFileButton
          fileId={editingFileId}
          fileName={files.find(f => f.id === editingFileId)?.name || ''}
          open={!!editingFileId}
          onOpenChange={(open) => !open && setEditingFileId(null)}
        />
      )}
      {deletingFileId && (
        <DeleteFileButton
          fileId={deletingFileId}
          fileName={files.find(f => f.id === deletingFileId)?.name || ''}
          open={!!deletingFileId}
          onOpenChange={(open) => !open && setDeletingFileId(null)}
        />
      )}
    </div>
  );
}
