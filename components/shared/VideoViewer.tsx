"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface VideoViewerProps {
  name: string;
  trigger: React.ReactNode;
}

export function VideoViewer({ name, trigger }: VideoViewerProps) {
  const [showVideoViewer, setShowVideoViewer] = useState(false);

  return (
    <>
      <div onClick={() => setShowVideoViewer(true)}>
        {trigger}
      </div>

      <Dialog open={showVideoViewer} onOpenChange={setShowVideoViewer}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {name}
            </h3>
          </DialogHeader>

          <div className="relative w-full bg-black flex items-center justify-center" style={{ height: 'calc(90vh - 160px)' }}>
            <video 
              src={`/${name}`} 
              className="max-w-full max-h-full"
              controls
              autoPlay
              controlsList="nodownload"
            >
              Your browser does not support the video element.
            </video>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowVideoViewer(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `/${name}`;
                  link.download = name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
