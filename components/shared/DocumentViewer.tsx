"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DocumentViewerProps {
  name: string;
  trigger: React.ReactNode;
}

export function DocumentViewer({ name, trigger }: DocumentViewerProps) {
  const [showDocViewer, setShowDocViewer] = useState(false);

  return (
    <>
      <div onClick={() => setShowDocViewer(true)}>
        {trigger}
      </div>

      <Dialog open={showDocViewer} onOpenChange={setShowDocViewer}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {name}
            </h3>
          </DialogHeader>

          <div className="relative w-full bg-gray-100 flex items-center justify-center" style={{ height: 'calc(90vh - 160px)' }}>
            <iframe
              src={`/${name}`}
              className="w-full h-full"
              style={{ border: 'none' }}
            >
              <p>Your browser does not support iframes. <a href={`/${name}`} target="_blank" rel="noopener noreferrer">Click here to view the document</a></p>
            </iframe>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDocViewer(false)}
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
