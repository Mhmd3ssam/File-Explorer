import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

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

// Default root structure
const defaultRoot: FolderNode = {
  id: "root",
  name: "root",
  type: "folder",
  children: [],
};

// Data file path
const DATA_FILE_PATH = join(process.cwd(), 'data', 'file-structure.json');

// Load data synchronously on startup
function loadData(): FolderNode {
  try {
    if (existsSync(DATA_FILE_PATH)) {
      const data = readFileSync(DATA_FILE_PATH, 'utf-8');
      const loaded = JSON.parse(data);
      
      // Migrate existing files to include date fields if they don't exist
      const migrateNode = (node: any, parentId?: string): any => {
        if (node.type === 'file' && !node.uploadedAt) {
          node.uploadedAt = new Date().toISOString();
          node.lastUpdated = new Date().toISOString();
        }
        if (node.type === 'file') {
          node.parentId = parentId;
        }
        if (node.children) {
          node.children = node.children.map((child: any) => migrateNode(child, node.id));
        }
        return node;
      };
      
      const migrated = migrateNode(loaded);
      console.log('Loaded existing file structure from disk with', migrated.children.length, 'items');
      console.log('Root children:', migrated.children.map((c: FolderNode | FileNode) => ({ name: c.name, type: c.type })));
      return migrated;
    } else {
      console.log('No existing data file found, starting with empty structure');
      return { ...defaultRoot };
    }
  } catch (error) {
    console.error('Error loading data:', error);
    return { ...defaultRoot };
  }
}

// Initialize root with loaded data
const root: FolderNode = loadData();

// Save data to disk
export function saveData(): void {
  try {
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });
    writeFileSync(DATA_FILE_PATH, JSON.stringify(root, null, 2));
    console.log('Data saved to disk');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Find a folder by ID
export function findFolder(id: string, current: FolderNode = root): FolderNode | null {
  if (current.id === id) return current;
  
  for (const child of current.children) {
    if (child.type === 'folder') {
      const found = findFolder(id, child);
      if (found) return found;
    }
  }
  
  return null;
}

// Find a file by ID
export function findFile(id: string, current: FolderNode = root): (FileNode & { parentId: string }) | null {
  for (const child of current.children) {
    if (child.type === 'file' && child.id === id) {
      return { ...child, parentId: current.id };
    } else if (child.type === 'folder') {
      const found = findFile(id, child);
      if (found) return found;
    }
  }
  
  return null;
}

// Get all files from the entire system (root + all subfolders) with parent folder info
export function getAllFiles(current: FolderNode = root): (FileNode & { parentFolder?: { id: string, name: string } })[] {
  const files: (FileNode & { parentFolder?: { id: string, name: string } })[] = [];
  
  function traverse(node: FolderNode) {
    for (const child of node.children) {
      if (child.type === 'file') {
        files.push({
          ...child,
          parentFolder: node.id === 'root' ? undefined : { id: node.id, name: node.name }
        });
      } else if (child.type === 'folder') {
        traverse(child);
      }
    }
  }
  
  traverse(current);
  return files;
}

// Format size in bytes to human readable format
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Get folder statistics
export function getFolderStats(folderId: string, current: FolderNode = root): { fileCount: number; totalSize: number } {
  const folder = findFolder(folderId, current);
  if (!folder) return { fileCount: 0, totalSize: 0 };
  
  let fileCount = 0;
  let totalSize = 0;
  
  function traverse(node: FolderNode) {
    for (const child of node.children) {
      if (child.type === 'file') {
        fileCount++;
        totalSize += getFileSize(child.name);
      } else if (child.type === 'folder') {
        traverse(child);
      }
    }
  }
  
  traverse(folder);
  return { fileCount, totalSize };
}

export function getFileSize(fileName: string): number {
  return fileName.length * 1024; // Mock size calculation
}

export function updateFileLastUpdated(fileId: string, current: FolderNode = root): boolean {
  function traverse(node: FolderNode): boolean {
    for (const child of node.children) {
      if (child.type === 'file' && child.id === fileId) {
        child.lastUpdated = new Date().toISOString();
        return true;
      } else if (child.type === 'folder') {
        if (traverse(child)) return true;
      }
    }
    return false;
  }
  
  const updated = traverse(current);
  if (updated) {
    saveData();
  }
  return updated;
}

export function getFolderPath(folderId: string, current: FolderNode = root): FolderNode[] {
  const path: FolderNode[] = [];
  
  function traverse(node: FolderNode, currentPath: FolderNode[]): boolean {
    if (node.id === folderId) {
      path.push(...currentPath, node);
      return true;
    }
    
    for (const child of node.children) {
      if (child.type === 'folder') {
        if (traverse(child, [...currentPath, node])) {
          return true;
        }
      }
    }
    return false;
  }
  
  traverse(current, []);
  return path;
}

export function renameFolder(folderId: string, newName: string, current: FolderNode = root): boolean {
  function traverse(node: FolderNode): boolean {
    if (node.id === folderId) {
      node.name = newName;
      return true;
    }
    
    for (const child of node.children) {
      if (child.type === 'folder') {
        if (traverse(child)) return true;
      }
    }
    return false;
  }
  
  return traverse(current);
}

export function deleteFolderById(folderId: string, current: FolderNode = root): boolean {
  function traverse(node: FolderNode): boolean {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type === 'folder' && child.id === folderId) {
        node.children.splice(i, 1);
        return true;
      }
      if (child.type === 'folder') {
        if (traverse(child)) return true;
      }
    }
    return false;
  }
  
  return traverse(current);
}

// Rename a file
export function renameFile(fileId: string, newName: string, current: FolderNode = root): boolean {
  function traverse(node: FolderNode): boolean {
    for (const child of node.children) {
      if (child.type === 'file' && child.id === fileId) {
        child.name = newName;
        child.lastUpdated = new Date().toISOString();
        return true;
      } else if (child.type === 'folder') {
        if (traverse(child)) return true;
      }
    }
    return false;
  }
  
  return traverse(current);
}

// Delete a file
export function deleteFile(fileId: string, current: FolderNode = root): boolean {
  function traverse(node: FolderNode): boolean {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type === 'file' && child.id === fileId) {
        node.children.splice(i, 1);
        return true;
      } else if (child.type === 'folder') {
        if (traverse(child)) return true;
      }
    }
    return false;
  }
  
  return traverse(current);
}

// Get all folders from the root
export function getAllFolders(current: FolderNode = root): FolderNode[] {
  const folders: FolderNode[] = [];
  
  function traverse(node: FolderNode) {
    if (node.id !== 'root') {
      folders.push(node);
    }
    for (const child of node.children) {
      if (child.type === 'folder') {
        traverse(child);
      }
    }
  }
  
  traverse(current);
  return folders;
}

export { root };

// Get all files from the entire system (root + all subfolders)
