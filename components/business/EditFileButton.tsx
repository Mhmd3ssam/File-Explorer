"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditFileButtonProps {
  fileId: string;
  fileName: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditFileButton({ fileId, fileName, open: externalOpen, onOpenChange }: EditFileButtonProps) {
  const [open, setOpen] = useState(externalOpen);
  const [newName, setNewName] = useState(fileName);
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

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setNewName(fileName);
    }
  }, [open, fileName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      return;
    }

    if (newName.trim() === fileName) {
      setOpen(false);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Failed to rename file:', error);
        alert('Failed to rename file. Please try again.');
      }
    } catch (error) {
      console.error('Error renaming file:', error);
      alert('Error renaming file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <DialogDescription>
            Enter a new name for the file.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter file name"
              disabled={loading}
              autoFocus
            />
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
              type="submit"
              disabled={loading || !newName.trim() || newName.trim() === fileName}
            >
              {loading ? 'Renaming...' : 'Rename File'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
