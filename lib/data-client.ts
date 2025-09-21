"use client";

export type FileNode = {
  id: string;
  name: string;
  type: "file";
  kind?: "document" | "image" | "video" | "audio" | "unknown";
  uploadedAt: string; // ISO date string
  lastUpdated: string; // ISO date string
  parentId?: string; // Add parentId to track parent folder
};

export type FolderNode = {
  id: string;
  name: string;
  type: "folder";
  children: Array<FolderNode | FileNode>;
};

export type FolderSummary = {
  id: string;
  name: string;
  fileCount: number;
  size: string;
};

export type AnyNode = FolderNode | FileNode;

import { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

export function useFiles() {
  const [files, setFiles] = useState<FileNode[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();

    // Set up event listeners for file changes
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchFiles();
        router.refresh();
      }
    };

    // Refetch when tab becomes visible
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Create an AbortController for the EventSource
    const controller = new AbortController();
    const eventSource = new EventSource('/api/files');

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setFiles(newData);
        router.refresh();
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    // Poll as a fallback every 3 seconds
    const interval = setInterval(() => {
      fetchFiles();
      router.refresh();
    }, 3000);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      eventSource.close();
      controller.abort();
      clearInterval(interval);
    };
  }, [router]);

  return { files };
}

// Format size in bytes to human readable format
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
