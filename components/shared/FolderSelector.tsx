"use client";

import { useState } from 'react';
import { getAllFolders, findFolder } from '@/lib/data';
import { FolderIcon } from '@/components/shared/icons';
import { cn } from '@/lib/utils';

interface FolderSelectorProps {
  selectedFolderId: string;
  onFolderChange: (folderId: string) => void;
  disabled?: boolean;
}

export function FolderSelector({ selectedFolderId, onFolderChange, disabled }: FolderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const folders = getAllFolders();

  const getDisplayName = (folderId: string) => {
    const folder = findFolder(folderId);
    return folder ? folder.name : 'Select a folder';
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Destination Folder
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-2">
          <FolderIcon size={16} />
          <span>{getDisplayName(selectedFolderId)}</span>
        </div>
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="py-1">
            {folders.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No folders available
              </div>
            ) : (
              folders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => {
                    onFolderChange(folder.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100",
                    selectedFolderId === folder.id && "bg-blue-50 text-blue-700"
                  )}
                >
                  <FolderIcon size={16} />
                  <span>{folder.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
