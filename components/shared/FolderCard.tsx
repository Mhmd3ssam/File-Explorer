"use client";

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FolderIcon } from '@/components/shared/icons';

interface FolderCardProps {
  id: string;
  name: string;
  fileCount: number;
  size: string;
  href: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FolderCard({ id, name, fileCount, size, href, onEdit, onDelete }: FolderCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:cursor-pointer hover:border-blue-500 hover:border-2 w-full h-32">
      {/* Three dots menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  onEdit?.();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete?.();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Folder content */}
      <Link href={href} className="block h-full">
        <div className="flex flex-col h-full">
          {/* Top section with icon and name */}
          <div className="flex items-start gap-3 mb-3">
            {/* Folder icon with circular background and hover effect */}
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-50 hover:cursor-pointer">
              <FolderIcon size={16} className="text-gray-600 group-hover:text-blue-600" />
            </div>
            
            {/* Folder name */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-blue-600">
                {name}
              </h3>
            </div>
          </div>
          
          {/* Bottom section with file count (left) and folder size (right) */}
          <div className="mt-auto flex justify-between items-center">
            <div className="text-xs text-gray-500 group-hover:text-blue-500">
              {fileCount} files
            </div>
            <div className="text-xs text-gray-500 group-hover:text-blue-500">
              {size}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
