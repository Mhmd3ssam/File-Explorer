"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { findFolder } from '@/lib/data';

interface EditFolderButtonProps {
  folderId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditFolderButton({ folderId, open: externalOpen, onOpenChange }: EditFolderButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Use external open state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Load folder data when modal opens
  useEffect(() => {
    if (isOpen) {
      const folder = findFolder(folderId);
      if (folder) {
        setName(folder.name);
      }
      setLoading(false);
    }
  }, [isOpen, folderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      // For now, we'll just update the in-memory data
      // In a real app, this would be an API call
      const folder = findFolder(folderId);
      if (folder) {
        folder.name = trimmed;
      }
      
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error('Failed to update folder:', error);
      alert('Failed to update folder name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
          <DialogDescription>
            Update the name of your folder.
          </DialogDescription>
        </DialogHeader>
        
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <Input
                id="folder-name"
                autoFocus
                placeholder="Enter folder name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
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
            type="submit" 
            disabled={!name.trim() || loading}
          >
            {loading ? 'Updating...' : 'Update Folder'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
