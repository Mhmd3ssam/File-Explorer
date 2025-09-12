"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { findFolder } from '@/lib/data';
import { cn } from '@/lib/utils';

interface EditFolderButtonProps {
  folderId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditFolderButton({ folderId, open: externalOpen, onOpenChange }: EditFolderButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
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
      setFocused(false);
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
            <div className="relative">
              <Input
                id="folder-name"
                autoFocus
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={loading}
                required
                className="peer pt-6 pb-2"
              />
              <label
                htmlFor="folder-name"
                className={cn(
                  "absolute left-3 transition-all duration-200 pointer-events-none",
                  focused || name ? "top-2 text-xs text-gray-500" : "top-1/2 -translate-y-1/2 text-gray-400"
                )}
              >
                Folder Name
              </label>
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
