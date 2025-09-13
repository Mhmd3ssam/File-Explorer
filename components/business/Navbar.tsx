"use client";

import { usePathname } from 'next/navigation';
import { CreateFileButton } from '@/components/business/CreateFileButton';
import { CreateFolderButton } from '@/components/business/CreateFolderButton';
import { Dropdown } from '@/components/shared/Dropdown';
import { PlusIcon, FolderIcon, FileIcon, DocIcon, ImageIcon, VideoIcon, AudioIcon } from '@/components/shared/icons';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  const dropdownItems = [
    {
      id: "create-folder",
      label: "Create folder",
      icon: <FolderIcon size={16} />,
      onClick: () => setShowFolderModal(true),
    },
    {
      id: "create-file",
      label: "Create file",
      icon: <FileIcon size={16} />,
      onClick: () => setShowFileModal(true),
    },
  ];

  // Check if we're in a folder details route
  const isFolderDetailsRoute = pathname.includes('/folder/');

  // Get module-specific button content
  const getModuleButton = () => {
    const moduleName = pathname.split('/')[1];
    
    switch (moduleName) {
      case 'documents':
        return {
          icon: <DocIcon size={16} />,
          text: 'Upload Document'
        };
      case 'images':
        return {
          icon: <ImageIcon size={16} />,
          text: 'Upload Image'
        };
      case 'videos':
        return {
          icon: <VideoIcon size={16} />,
          text: 'Upload Video'
        };
      case 'audios':
        return {
          icon: <AudioIcon size={16} />,
          text: 'Upload Audio'
        };
      default:
        return {
          icon: <FileIcon size={16} />,
          text: '+ File'
        };
    }
  };

  // Get title and buttons based on current route
  const getNavbarContent = () => {
    if (pathname === '/dashboard') {
      return {
        title: 'All files',
        buttons: null
      };
    }
    
    if (pathname === '/folders') {
      return {
        title: 'Folders & Files',
        buttons: <Dropdown title="Create" icon={<PlusIcon />} items={dropdownItems} />
      };
    }
    
    if (pathname === '/deleted') {
      return {
        title: 'Deleted files',
        buttons: null
      };
    }
    
    // For folder details routes, show no buttons
    if (isFolderDetailsRoute) {
      return {
        title: 'Folder Details',
        buttons: null
      };
    }
    
    // For other modules (documents, images, videos, audios)
    const moduleName = pathname.split('/')[1];
    const capitalizedModule = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    const moduleButton = getModuleButton();
    
    return {
      title: `All ${capitalizedModule}`,
      buttons: (
        <button
          onClick={() => setShowFileModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {moduleButton.icon}
          {moduleButton.text}
        </button>
      )
    };
  };

  const { title, buttons } = getNavbarContent();

  return (
    <>
      <header className="h-12 border-b flex items-center justify-between px-4 bg-white/70 backdrop-blur relative z-40">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {buttons && (
          <div className="flex items-center gap-2 relative z-50">
            {buttons}
          </div>
        )}
      </header>
      
      {/* Modals for folders module - render at root level */}
      {pathname === '/folders' && (
        <>
          <CreateFolderButton
            parentId="root"
            open={showFolderModal}
            onOpenChange={setShowFolderModal}
          />
          <CreateFileButton
            parentId="root"
            allowDestinationSelect={false}
            open={showFileModal}
            onOpenChange={setShowFileModal}
          />
        </>
      )}
      
      {/* Modal for other modules */}
      {!isFolderDetailsRoute && pathname !== '/folders' && pathname !== '/dashboard' && pathname !== '/deleted' && (
        <CreateFileButton
          parentId="root"
          open={showFileModal}
          onOpenChange={setShowFileModal}
        />
      )}
    </>
  );
}
