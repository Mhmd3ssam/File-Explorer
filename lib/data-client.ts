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
