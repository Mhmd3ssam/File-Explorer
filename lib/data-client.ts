export type FileNode = {
  id: string;
  name: string;
  type: "file";
  kind?: "document" | "image" | "video" | "audio" | "unknown";
};

export type FolderNode = {
  id: string;
  name: string;
  type: "folder";
  children: Array<FolderNode | FileNode>;
};

// This is a client-safe version that doesn't import server-side modules
// The actual data will be loaded from the server via API calls
let foldersCache: FolderNode[] = [];

export function getAllFolders(): FolderNode[] {
  // This will be populated by server-side data loading
  // For now, return empty array - the server will handle the actual data
  return foldersCache;
}

export function findFolder(id: string, current?: FolderNode): FolderNode | null {
  // This is a simplified version for client-side use
  // In a real app, you'd fetch this data from an API
  return null;
}

export function getFolderStats(folder: FolderNode): { fileCount: number; size: string } {
  let fileCount = 0;
  let totalSize = 0; // In bytes (simulated)
  
  function traverse(node: FolderNode | FileNode) {
    if (node.type === 'file') {
      fileCount++;
      // Simulate file size based on name length and type
      totalSize += node.name.length * 1024; // 1KB per character as simulation
    } else {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  
  traverse(folder);
  
  // Format size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  
  return {
    fileCount,
    size: formatSize(totalSize)
  };
}
