"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { findFolder } from '@/lib/data';

interface DeleteFolderButtonProps {
  folderId: string;
  folderName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteFolderButton({ folderId, folderName, open: externalOpen, onOpenChange }: DeleteFolderButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Use external open state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // For now, we'll just update the in-memory data
      // In a real app, this would be an API call
      const root = findFolder('root');
      if (root) {
        root.children = root.children.filter(child => child.id !== folderId);
      }
      
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete folder:', error);
      alert('Failed to delete folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete "{folderName}"? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <DialogContent>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> This will permanently delete the folder and all its contents.
          </p>
        </div>
      </DialogContent>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setOpen(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? 'Deleting...' : 'Delete Folder'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
