"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreateFileButton } from '@/components/business/CreateFileButton';
import { DocIcon } from '@/components/shared/icons';

export default function DocumentsPage() {
  const [showFileModal, setShowFileModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DocIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No documents yet
          </h3>
          <p className="text-gray-500 mb-4">
            Upload your first document to get started
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <button
              onClick={() => setShowFileModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <DocIcon size={16} />
              Upload Document
            </button>
          </motion.div>
        </motion.div>
      </div>

      <CreateFileButton
        parentId="root"
        open={showFileModal}
        onOpenChange={setShowFileModal}
      />
    </div>
  );
}
