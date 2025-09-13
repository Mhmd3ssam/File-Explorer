"use client";

import { useState, useEffect, useRef } from 'react';
import { FolderIcon } from '@/components/shared/icons';
import Link from 'next/link';

interface FolderCardProps {
  id: string;
  name: string;
  fileCount: number;
  size: string;
  href: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isLastItem?: boolean; // Add prop to determine if this is the last item
  isFirstRow?: boolean; // Add prop to determine if this is in the first row
}

export function FolderCard({ id, name, fileCount, size, href, onEdit, onDelete, isLastItem = false, isFirstRow = false }: FolderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:cursor-pointer hover:border-blue-500 hover:border-2 w-full h-32">
      {/* Three dots menu */}
      <div className="absolute top-3 right-3">
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Dropdown menu positioned relative to the card */}
      {showMenu && (
        <div ref={dropdownRef} className="absolute top-16 right-3 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
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

      {/* Folder content */}
      <Link href={href} className="flex flex-col h-full">
        {/* Folder icon with square background and border */}
        <div className="w-12 h-12 bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center mx-auto mb-3">
          <FolderIcon size={24} className="text-gray-600" />
        </div>
        
        {/* Folder name */}
        <h3 className="font-medium text-gray-900 text-sm text-center mb-1 truncate" title={name}>
          {name}
        </h3>
        
        {/* File count and size */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span>{fileCount} files</span>
          <span>{size}</span>
        </div>
      </Link>
    </div>
  );
}
