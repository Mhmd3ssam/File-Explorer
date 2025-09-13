"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from '@/components/shared/icons';

export default function ImagesPage() {
  const [showFileModal, setShowFileModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No images yet
          </h3>
          <p className="text-gray-500 mb-4">
            Upload your first image to get started
          </p>
        </motion.div>
      </div>
    </div>
  );
}
