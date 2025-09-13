"use client";

import { useState } from 'react';
import { AnimatedEmptyState } from '@/components/shared/AnimatedEmptyState';

export default function ImagesPage() {
  const [showFileModal, setShowFileModal] = useState(false);

  return (
    <div className="space-y-4">
      <AnimatedEmptyState
        type="images"
        title="No images yet"
        description="Upload your first image to get started"
      />
    </div>
  );
}
