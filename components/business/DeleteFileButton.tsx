"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteFileButtonProps {
  fileId: string;
  fileName: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteFileButton({ fileId, fileName, open: externalOpen, onOpenChange }: DeleteFileButtonProps) {
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
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Failed to delete file:', error);
        alert('Failed to delete file. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{fileName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> This will permanently delete the file.
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
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Deleting...' : 'Delete File'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
