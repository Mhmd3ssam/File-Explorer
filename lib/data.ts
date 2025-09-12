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

export const root: FolderNode = {
  id: "root",
  name: "root",
  type: "folder",
  children: [
    { id: "folder-1", name: "Folder 1", type: "folder", children: [] },
    { id: "folder-2", name: "Folder 2", type: "folder", children: [] },
  ],
};

export function findFolder(
  id: string,
  current: FolderNode = root
): FolderNode | null {
  if (current.id === id) return current;
  for (const child of current.children) {
    if (child.type === "folder") {
      const result = findFolder(id, child);
      if (result) return result;
    }
  }
  return null;
}

export function getAllFolders(current: FolderNode = root): FolderNode[] {
  const folders: FolderNode[] = [];
  
  function traverse(node: FolderNode, path: string = '') {
    if (node.id !== 'root') {
      folders.push({
        ...node,
        name: path ? `${path}/${node.name}` : node.name
      });
    }
    
    for (const child of node.children) {
      if (child.type === 'folder') {
        const newPath = path ? `${path}/${node.name}` : node.name;
        traverse(child, newPath);
      }
    }
  }
  
  traverse(current);
  return folders;
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


export function getFolderPath(id: string): FolderNode[] {
  const path: FolderNode[] = [];
  function dfs(node: FolderNode): boolean {
    path.push(node);
    if (node.id == id) return true;
    for (const child of node.children) {
      if (child.type === 'folder') {
        if (dfs(child)) return true;
      }
    }
    path.pop();
    return false;
  }
  // TypeScript-friendly boolean literals will be fixed after write
  dfs(root as any);
  return path;
}

export function renameFolder(id: string, newName: string, current: FolderNode = root): boolean {
  if (current.id === id) { current.name = newName; return true; }
  for (const child of current.children) {
    if (child.type === 'folder') {
      if (renameFolder(id, newName, child)) return true;
    }
  }
  return false;
}

export function deleteFolderById(id: string, current: FolderNode = root): boolean {
  for (let i = 0; i < current.children.length; i++) {
    const child = current.children[i];
    if (child.type === 'folder') {
      if (child.id === id) { current.children.splice(i, 1); return true; }
      if (deleteFolderById(id, child)) return true;
    }
  }
  return false;
}
