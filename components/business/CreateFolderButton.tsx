"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogFooter, DialogHeader } from '@/components/ui/dialog';

export function CreateFolderButton({ parentId = 'root' }: { parentId?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="md">
        + Folder
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <h2 className="text-base font-semibold">Create folder</h2>
        </DialogHeader>
        <form
          action="#"
          onSubmit={async (e) => {
            e.preventDefault();
            const trimmed = name.trim();
            if (trimmed) {
              await fetch(`/api/folders/${parentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmed }),
              });
              router.refresh();
            }
            setOpen(false);
            setName('');
          }}
        >
          <Input
            autoFocus
            name="name"
            placeholder="Folder name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <DialogFooter>
            <Button type="submit" variant="default">
              Create
            </Button>
            <Button type="button" onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
} 