"use client";

import { useState } from "react";
import { FolderIcon } from "@/components/shared/icons";
import { EditFolderButton } from "@/components/business/EditFolderButton";
import { DeleteFolderButton } from "@/components/business/DeleteFolderButton";
import { FolderCard } from "@/components/shared/FolderCard";
import { FileCard } from "@/components/shared/FileCard";
import type { FolderNode, FileNode } from "@/lib/data-client";

export type FolderSummary = {
  id: string;
  name: string;
  fileCount: number;
  size: string;
};

export function FoldersClient({ folders, files }: { folders: FolderSummary[], files: FileNode[] }) {
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  const totalItems = folders.length + files.length;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Render folders */}
          {folders.map((f) => (
            <FolderCard
              key={f.id}
              id={f.id}
              name={f.name}
              fileCount={f.fileCount}
              size={f.size}
              href={`/folders/folder/${f.id}`}
              onEdit={() => setEditingFolderId(f.id)}
              onDelete={() => setDeletingFolderId(f.id)}
            />
          ))}
          
          {/* Render files */}
          {files.map((f) => (
            <FileCard
              key={f.id}
              id={f.id}
              name={f.name}
              kind={f.kind}
              size={getFileSize(f.name)}
              onEdit={() => {
                // TODO: Implement file editing
                console.log('Edit file:', f.name);
              }}
              onDelete={() => {
                // TODO: Implement file deletion
                console.log('Delete file:', f.name);
              }}
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
          folderName={
            folders.find((x) => x.id === deletingFolderId)?.name || ""
          }
          open={!!deletingFolderId}
          onOpenChange={(open) => !open && setDeletingFolderId(null)}
        />
      )}
    </div>
  );
}
