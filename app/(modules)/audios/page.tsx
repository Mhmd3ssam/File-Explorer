"use client";

import { useState } from 'react';
import { AnimatedEmptyState } from '@/components/shared/AnimatedEmptyState';

export default function AudiosPage() {
  const [showFileModal, setShowFileModal] = useState(false);

  return (
    <div className="space-y-4">
      <AnimatedEmptyState
        type="audios"
        title="No audios yet"
        description="Upload your first audio file to get started"
      />
    </div>
  );
}
