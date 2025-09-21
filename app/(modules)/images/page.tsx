"use client";

import { useState } from 'react';
import { AnimatedEmptyState } from '@/components/shared/AnimatedEmptyState';
import { ImageCard } from '@/components/shared/ImageCard';
import { EditFileButton } from '@/components/business/EditFileButton';
import { DeleteFileButton } from '@/components/business/DeleteFileButton';
import { useFiles, FileNode } from '@/lib/data-client';

export default function ImagesPage() {
  const { files } = useFiles();
  const [editFile, setEditFile] = useState<FileNode | null>(null);
  const [deleteFile, setDeleteFile] = useState<FileNode | null>(null);

  const images = files?.filter(file => 
    file.name.toLowerCase().endsWith('.jpg') || 
    file.name.toLowerCase().endsWith('.jpeg') || 
    file.name.toLowerCase().endsWith('.png') || 
    file.name.toLowerCase().endsWith('.gif') || 
    file.name.toLowerCase().endsWith('.webp')
  ) || [];

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <AnimatedEmptyState
          type="images"
          title="No images yet"
          description="Upload your first image to get started"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id}>
            <ImageCard
              id={image.id}
              name={image.name}
              onEdit={() => setEditFile(image)}
              onDelete={() => setDeleteFile(image)}
            />
          </div>
        ))}
      </div>

      {editFile && (
        <EditFileButton
          fileId={editFile.id}
          fileName={editFile.name}
          open={!!editFile}
          onOpenChange={(open) => !open && setEditFile(null)}
        />
      )}

      {deleteFile && (
        <DeleteFileButton
          fileId={deleteFile.id}
          fileName={deleteFile.name}
          open={!!deleteFile}
          onOpenChange={(open) => !open && setDeleteFile(null)}
        />
      )}
    </div>
  );
}
