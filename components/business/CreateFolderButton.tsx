"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CreateFolderButtonProps {
  parentId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateFolderButton({ parentId = 'root', open: externalOpen, onOpenChange }: CreateFolderButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Use external open state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      await fetch(`/api/folders/${parentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    } finally {
      setLoading(false);
    }
  };

  // If no external control, render as button + modal
  if (externalOpen === undefined) {
    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline" size="md">
          + Folder
        </Button>
        <Dialog open={isOpen} onOpenChange={setOpen}>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new folder.
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
                {loading ? 'Creating...' : 'Create Folder'}
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </>
    );
  }

  // If external control, render only modal
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder.
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
            {loading ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
