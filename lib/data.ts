import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export type FileNode = {
  id: string;
  name: string;
  type: "file";
  kind?: "document" | "image" | "video" | "audio" | "unknown";
  uploadedAt: string; // ISO date string
  lastUpdated: string; // ISO date string
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
      const migrateNode = (node: any): any => {
        if (node.type === 'file' && !node.uploadedAt) {
          node.uploadedAt = new Date().toISOString();
          node.lastUpdated = new Date().toISOString();
        }
        if (node.children) {
          node.children = node.children.map(migrateNode);
        }
        return node;
      };
      
      const migrated = migrateNode(loaded);
      console.log('Loaded existing file structure from disk with', migrated.children.length, 'items');
      console.log('Root children:', migrated.children.map(c => ({ name: c.name, type: c.type })));
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

// Save data to file
function saveData(): void {
  try {
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });
    writeFileSync(DATA_FILE_PATH, JSON.stringify(root, null, 2));
    console.log('Saved file structure to disk with', root.children.length, 'items');
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

export { root, saveData };

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

export function getFolderStats(folderId: string): { totalFiles: number; totalFolders: number; totalSize: number } {
  const folder = findFolder(folderId);
  if (!folder) return { totalFiles: 0, totalFolders: 0, totalSize: 0 };

  let totalFiles = 0;
  let totalFolders = 0;
  let totalSize = 0;

  function traverse(node: FolderNode) {
    for (const child of node.children) {
      if (child.type === 'file') {
        totalFiles++;
        totalSize += getFileSize(child.name);
      } else if (child.type === 'folder') {
        totalFolders++;
        traverse(child);
      }
    }
  }

  traverse(folder);
  return { totalFiles, totalFolders, totalSize };
}

export function getFileSize(fileName: string): number {
  // Simulate file size based on name length
  return fileName.length * 1024;
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
