"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { FileUpload, type SelectedFile } from '@/components/shared/FileUpload';

export function CreateFileButton({ parentId }: { parentId: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedFile>(null);
  const router = useRouter();

  async function handleCreate() {
    if (!selected) return;
    const form = new FormData();
    form.append('file', selected.file);
    if (selected.name) form.append('name', selected.name);

    await fetch(`/api/files/${parentId}`, {
      method: 'POST',
      body: form,
    });
    setOpen(false);
    setSelected(null);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="md">
        + File
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <h2 className="text-base font-semibold">Upload file</h2>
        </DialogHeader>
        <div className="space-y-3">
          <FileUpload onChange={setSelected} />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} variant="default" disabled={!selected}>
            Create
          </Button>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
} 