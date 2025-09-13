"use client";

import { motion } from 'framer-motion';
import { FolderIcon, TrashIcon, DocIcon, ImageIcon, VideoIcon, AudioIcon, ClockIcon, BarChartIcon } from '@/components/shared/icons';

interface AnimatedEmptyStateProps {
  type: 'folders' | 'deleted' | 'documents' | 'images' | 'videos' | 'audios' | 'lastModified' | 'statistics';
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function AnimatedEmptyState({ type, title, description, icon }: AnimatedEmptyStateProps) {
  const getDefaultIcon = () => {
    switch (type) {
      case 'folders':
        return <FolderIcon size={64} className="text-gray-400" />;
      case 'deleted':
        return <TrashIcon size={64} className="text-gray-400" />;
      case 'documents':
        return <DocIcon size={64} className="text-gray-400" />;
      case 'images':
        return <ImageIcon size={64} className="text-gray-400" />;
      case 'videos':
        return <VideoIcon size={64} className="text-gray-400" />;
      case 'audios':
        return <AudioIcon size={64} className="text-gray-400" />;
      case 'lastModified':
        return <ClockIcon size={64} className="text-gray-400" />;
      case 'statistics':
        return <BarChartIcon size={64} className="text-gray-400" />;
      default:
        return <FolderIcon size={64} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[320px] w-full">
      <motion.div 
        className="text-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Animated Icon - Centered */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2 
          }}
        >
          <motion.div
            className="flex justify-center"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {icon || getDefaultIcon()}
          </motion.div>
        </motion.div>

        {/* Animated Title - Centered */}
        <motion.h3 
          className="text-xl font-semibold text-gray-900 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {title}
        </motion.h3>

        {/* Animated Description - Centered */}
        <motion.p 
          className="text-gray-500 text-lg max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {description}
        </motion.p>

        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gray-300 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
