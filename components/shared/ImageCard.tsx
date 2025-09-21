"use client";

import { ImageViewer } from '@/components/shared/ImageViewer';

interface ImageCardProps {
  id: string;
  name: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ImageCard({ id, name, onEdit, onDelete }: ImageCardProps) {
  return (
    <ImageViewer 
      key={name} // Add key to force re-render when name changes
      name={name}
      trigger={
        <div className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 hover:border-blue-500 hover:border-2 cursor-pointer">
          {/* Image Preview */}
          <img
            src={`/${name}`}
            alt={name}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay with file name */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
            <div className="flex justify-end">
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-sm font-medium truncate">
                {name}
              </h3>
            </div>
          </div>
        </div>
      }
    />
  );
}
