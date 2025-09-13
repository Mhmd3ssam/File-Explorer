"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteFolderButtonProps {
  folderId: string;
  folderName: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteFolderButton({ folderId, folderName, open: externalOpen, onOpenChange }: DeleteFolderButtonProps) {
  const [open, setOpen] = useState(externalOpen);
  const [loading, setLoading] = useState(false);

  // Sync with external open state
  useEffect(() => {
    setOpen(externalOpen);
  }, [externalOpen]);

  // Sync with external onOpenChange
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(open);
    }
  }, [open, onOpenChange]);

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Failed to delete folder:', error);
        alert('Failed to delete folder. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Error deleting folder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Folder</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{folderName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> This will permanently delete the folder and all its contents.
          </p>
        </div>
        
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
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            style={{ backgroundColor: '#dc2626' }}
          >
            {loading ? 'Deleting...' : 'Delete Folder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
