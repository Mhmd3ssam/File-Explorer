"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CreateFolderButtonProps {
  parentId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateFolderButton({ parentId = 'root', open: externalOpen, onOpenChange }: CreateFolderButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  // Use external open state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setLoading(false);
      setFocused(false);
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
            {loading ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
