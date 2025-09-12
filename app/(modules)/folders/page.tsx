"use client";

import { useState } from 'react';
import { findFolder, getFolderStats } from '@/lib/data';
import { Dropdown } from '@/components/shared/Dropdown';
import { PlusIcon, FolderIcon, FileIcon } from '@/components/shared/icons';
import { CreateFolderButton } from '@/components/business/CreateFolderButton';
import { CreateFileButton } from '@/components/business/CreateFileButton';
import { EditFolderButton } from '@/components/business/EditFolderButton';
import { DeleteFolderButton } from '@/components/business/DeleteFolderButton';
import { FolderCard } from '@/components/shared/FolderCard';

export default function FoldersPage() {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  
  const folder = findFolder('root');
  const folders = folder?.children.filter(child => child.type === 'folder') || [];

  const dropdownItems = [
    {
      id: 'create-folder',
      label: 'Create folder',
      icon: <FolderIcon size={16} />,
      onClick: () => setShowFolderModal(true),
    },
    {
      id: 'create-file',
      label: 'Create file',
      icon: <FileIcon size={16} />,
      onClick: () => setShowFileModal(true),
    },
  ];

  const handleEditFolder = (folderId: string) => {
    setEditingFolderId(folderId);
  };

  const handleDeleteFolder = (folderId: string) => {
    setDeletingFolderId(folderId);
  };

  return (
    <div className="space-y-4">
      {/* Header with separator line */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Browse All Files</h1>
          <Dropdown
            title="Create"
            icon={<PlusIcon />}
            items={dropdownItems}
          />
        </div>
        {/* Separator line */}
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Folder Cards Grid */}
      {folders.length === 0 ? (
        <div className="text-center py-12">
          <FolderIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No folders yet</h3>
          <p className="text-gray-500 mb-4">Create your first folder to get started</p>
          <button
            onClick={() => setShowFolderModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon size={16} />
            Create Folder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {folders.map((folder) => {
            const stats = getFolderStats(folder);
            return (
              <FolderCard
                key={folder.id}
                id={folder.id}
                name={folder.name}
                fileCount={stats.fileCount}
                size={stats.size}
                href={`/dashboard/folder/${folder.id}`}
                onEdit={() => handleEditFolder(folder.id)}
                onDelete={() => handleDeleteFolder(folder.id)}
              />
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateFolderButton 
        parentId="root"
        open={showFolderModal}
        onOpenChange={setShowFolderModal}
      />
      <CreateFileButton 
        parentId="root"
        open={showFileModal}
        onOpenChange={setShowFileModal}
      />
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
    </div>
  );
}
