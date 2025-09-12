"use client";

import { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type SelectedFile = { file: File; name: string } | null;

export function FileUpload({ onChange }: { onChange: (value: SelectedFile) => void }) {
  const inputId = useId();
  const fileInputId = useId();
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-4">
      {/* File input */}
      <div className="flex items-center gap-2">
        <Input
          id={fileInputId}
          type="file"
          onChange={(e) => {
            const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
            setFile(f);
            onChange(f ? { file: f, name: fileName || f.name } : null);
          }}
        />
      </div>
      
      {/* Name input with floating label */}
      <div className="relative">
        <Input
          id={inputId}
          placeholder=" "
          value={fileName}
          onChange={(e) => {
            const value = e.target.value;
            setFileName(value);
            if (file) {
              onChange({ file, name: value || file.name });
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer pt-6 pb-2"
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            focused || fileName ? "top-2 text-xs text-gray-500" : "top-1/2 -translate-y-1/2 text-gray-400"
          )}
        >
          File Name (Optional)
        </label>
      </div>
    </div>
  );
}
