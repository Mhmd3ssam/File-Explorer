"use client";

import { useId, useState } from 'react';
import { Input } from '@/components/ui/input';

export type SelectedFile = { file: File; name: string } | null;

export function FileUpload({ onChange }: { onChange: (value: SelectedFile) => void }) {
  const inputId = useId();
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="text-sm min-w-16">
          File
        </label>
        <Input
          id={inputId}
          type="file"
          onChange={(e) => {
            const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
            setFile(f);
            onChange(f ? { file: f, name: fileName || f.name } : null);
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm min-w-16">Name</label>
        <Input
          placeholder="Optional name"
          value={fileName}
          onChange={(e) => {
            const value = e.target.value;
            setFileName(value);
            if (file) {
              onChange({ file, name: value || file.name });
            }
          }}
        />
      </div>
    </div>
  );
} 