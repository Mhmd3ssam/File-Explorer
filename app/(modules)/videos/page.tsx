"use client";

import { useState } from 'react';
import { AnimatedEmptyState } from '@/components/shared/AnimatedEmptyState';

export default function VideosPage() {
  const [showFileModal, setShowFileModal] = useState(false);

  return (
    <div className="space-y-4">
      <AnimatedEmptyState
        type="videos"
        title="No videos yet"
        description="Upload your first video to get started"
      />
    </div>
  );
}
