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

export type FolderSummary = {
  id: string;
  name: string;
  totalFiles: number;
  totalFolders: number;
  totalSize: number;
};
