"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileUpload, type SelectedFile } from '@/components/shared/FileUpload';
import { FolderSelector } from '@/components/shared/FolderSelector';
import type { FolderNode } from '@/lib/data-client';

interface CreateFileButtonProps {
  parentId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  allowDestinationSelect?: boolean; // if false, uploads to parentId without showing folder selector
}

export function CreateFileButton({ parentId, open: externalOpen, onOpenChange, allowDestinationSelect = true }: CreateFileButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedFile>(null);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const router = useRouter();

  // Use external open state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Fetch folders when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFolders();
    }
  }, [isOpen]);

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/folders');
      if (response.ok) {
        const foldersData = await response.json();
        setFolders(foldersData);
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  };

  // Reset form when modal opens and set default folder
  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setLoading(false);
      if (!allowDestinationSelect) {
        // Always current folder
        setSelectedFolderId(parentId);
      } else {
        if (parentId !== 'root' && folders.some((f) => f.id === parentId)) {
          setSelectedFolderId(parentId);
        } else if (folders.length > 0) {
          setSelectedFolderId(folders[0].id);
        } else {
          setSelectedFolderId('');
        }
      }
    }
  }, [isOpen, parentId, allowDestinationSelect, folders]);

  const handleCreate = async () => {
    if (!selected || loading) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', selected.file);
      if (selected.name) form.append('name', selected.name);

      const targetFolderId = allowDestinationSelect ? selectedFolderId : parentId;
      if (!targetFolderId) return;
      const response = await fetch(`/api/files/${targetFolderId}`, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error || 'Unknown error'}`);
        return;
      }

      await response.json();
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const canUpload = !!selected && (allowDestinationSelect ? selectedFolderId && folders.length > 0 : true);

  // If no external control, render as button + modal
  if (externalOpen === undefined) {
    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline" size="md">
          + File
        </Button>
        <Dialog open={isOpen} onOpenChange={setOpen}>
          <DialogHeader>
            <DialogTitle>Upload New File</DialogTitle>
          </DialogHeader>
          
          <DialogContent>
            <div className="space-y-4">
              <FileUpload onChange={setSelected} />
              {allowDestinationSelect && (
                folders.length > 0 ? (
                  <FolderSelector
                    selectedFolderId={selectedFolderId}
                    onFolderChange={setSelectedFolderId}
                    disabled={loading}
                    folders={folders}
                  />
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">No folders available. Please create a folder first.</p>
                  </div>
                )
              )}
              {selected && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Selected:</span> {selected.file.name}
                    {selected.name && selected.name !== selected.file.name && (
                      <span> (will be saved as: {selected.name})</span>
                    )}
                  </p>
                  {allowDestinationSelect && selectedFolderId && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Destination:</span> {folders.find((f) => f.id === selectedFolderId)?.name || 'Unknown folder'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!canUpload || loading}
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  }

  // If external control, render only modal
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>Upload New File</DialogTitle>
        <DialogDescription>
          {allowDestinationSelect ? 'Select a file and choose the destination folder.' : 'Select a file to upload to this folder.'}
        </DialogDescription>
      </DialogHeader>
      
      <DialogContent>
        <div className="space-y-4">
          <FileUpload onChange={setSelected} />
          {allowDestinationSelect && (
            folders.length > 0 ? (
              <FolderSelector
                selectedFolderId={selectedFolderId}
                onFolderChange={setSelectedFolderId}
                disabled={loading}
                folders={folders}
              />
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">No folders available. Please create a folder first.</p>
              </div>
            )
          )}
          {selected && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Selected:</span> {selected.file.name}
                {selected.name && selected.name !== selected.file.name && (
                  <span> (will be saved as: {selected.name})</span>
                )}
              </p>
              {allowDestinationSelect && selectedFolderId && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Destination:</span> {folders.find((f) => f.id === selectedFolderId)?.name || 'Unknown folder'}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={() => setOpen(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleCreate} 
          disabled={!canUpload || loading}
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
