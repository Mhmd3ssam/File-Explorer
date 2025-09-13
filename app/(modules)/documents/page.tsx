"use client";

import { useState } from 'react';
import { AnimatedEmptyState } from '@/components/shared/AnimatedEmptyState';

export default function DocumentsPage() {
  const [showFileModal, setShowFileModal] = useState(false);

  return (
    <div className="space-y-4">
      <AnimatedEmptyState
        type="documents"
        title="No documents yet"
        description="Upload your first document to get started"
      />
    </div>
  );
}
