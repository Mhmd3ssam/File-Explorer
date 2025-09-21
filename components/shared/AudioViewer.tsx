"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AudioViewerProps {
  name: string;
  trigger: React.ReactNode;
}

export function AudioViewer({ name, trigger }: AudioViewerProps) {
  const [showAudioViewer, setShowAudioViewer] = useState(false);

  return (
    <>
      <div onClick={() => setShowAudioViewer(true)}>
        {trigger}
      </div>

      <Dialog open={showAudioViewer} onOpenChange={setShowAudioViewer}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {name}
            </h3>
          </DialogHeader>

          <div className="relative w-full bg-gray-100 flex items-center justify-center p-8">
            <audio 
              controls
              autoPlay
              className="w-full"
              controlsList="nodownload"
            >
              <source src={`/${name}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAudioViewer(false)}
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
