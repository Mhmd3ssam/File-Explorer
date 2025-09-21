"use client";

import { useState, useEffect, useRef } from 'react';
import { DocIcon, ImageIcon, VideoIcon, AudioIcon, FileIcon } from '@/components/shared/icons';
import { ImageViewer } from '@/components/shared/ImageViewer';
import { VideoViewer } from '@/components/shared/VideoViewer';
import { AudioViewer } from '@/components/shared/AudioViewer';
import { DocumentViewer } from '@/components/shared/DocumentViewer';

interface FileCardProps {
  id: string;
  name: string;
  kind?: 'document' | 'image' | 'video' | 'audio' | 'unknown';
  size: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isLastItem?: boolean; // Add prop to determine if this is the last item
  isFirstRow?: boolean; // Add prop to determine if this is in the first row
}

export function FileCard({ id, name, kind, size, onEdit, onDelete, isLastItem = false, isFirstRow = false }: FileCardProps) {
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

  // Get file icon based on file type
  const getFileIcon = (kind?: string) => {
    switch (kind) {
      case 'image':
        return <ImageIcon size={24} className="text-gray-600" />;
      case 'video':
        return <VideoIcon size={24} className="text-gray-600" />;
      case 'audio':
        return <AudioIcon size={24} className="text-gray-600" />;
      case 'document':
        return <DocIcon size={24} className="text-gray-600" />;
      default:
        return <FileIcon size={24} className="text-gray-600" />;
    }
  };

  // Get file type display name
  const getFileType = (kind?: string) => {
    switch (kind) {
      case 'image':
        return 'Image';
      case 'video':
        return 'Video';
      case 'audio':
        return 'Audio';
      case 'document':
        return 'Document';
      default:
        return 'File';
    }
  };

  // Render file content based on type
  const renderFileContent = () => {
    const cardContent = (
      <div className="flex flex-col h-full">
        <div className="w-12 h-12 bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center mx-auto mb-3">
          {getFileIcon(kind)}
        </div>
        <h3 className="font-medium text-gray-900 text-sm text-center mb-1 truncate" title={name}>
          {name}
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span>{getFileType(kind)}</span>
          <span>{size}</span>
        </div>
      </div>
    );

    switch (kind) {
      case 'image':
        return <ImageViewer name={name} trigger={cardContent} />;
      case 'video':
        return <VideoViewer name={name} trigger={cardContent} />;
      case 'audio':
        return <AudioViewer name={name} trigger={cardContent} />;
      case 'document':
        return <DocumentViewer name={name} trigger={cardContent} />;
      default:
        return cardContent;
    }
  };

  return (
    <>
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

        {/* File content with appropriate viewer */}
        {renderFileContent()}
      </div>
    </>
  );
}
