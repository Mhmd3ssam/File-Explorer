"use client";

import { useState, useEffect, useRef } from 'react';
import { Table, type TableRow } from '@/components/shared/Table';
import { ImageViewer } from '@/components/shared/ImageViewer';
import { VideoViewer } from '@/components/shared/VideoViewer';
import { AudioViewer } from '@/components/shared/AudioViewer';
import { DocumentViewer } from '@/components/shared/DocumentViewer';
import { DocIcon, ImageIcon, VideoIcon, AudioIcon, FileIcon } from '@/components/shared/icons';
import { PieChart } from '@/components/shared/PieChart';
import { AnimatedEmptyState } from '@/components/shared/AnimatedEmptyState';
import { EditFileButton } from '@/components/business/EditFileButton';
import { DeleteFileButton } from '@/components/business/DeleteFileButton';
import type { FileNode } from '@/lib/data-client';

export default function DashboardPage() {
  const [allFiles, setAllFiles] = useState<(FileNode & { parentFolder?: { id: string, name: string } })[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const filesPerPage = 5;
  const maxNameLength = 30;
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Fetch files from API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        if (response.ok) {
          const files = await response.json();
          // Filter out files without IDs
          const validFiles = files.filter((file: any) => file.id && file.name);
          setAllFiles(validFiles);
        }
      } catch (error) {
        console.error('Failed to fetch files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowActionsMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get file icon based on file type
  const getFileIcon = (kind?: string, size: number = 24) => {
    switch (kind) {
      case 'image':
        return <ImageIcon size={size} className="text-gray-600" />;
      case 'video':
        return <VideoIcon size={size} className="text-gray-600" />;
      case 'audio':
        return <AudioIcon size={size} className="text-gray-600" />;
      case 'document':
        return <DocIcon size={size} className="text-gray-600" />;
      default:
        return <FileIcon size={size} className="text-gray-600" />;
    }
  };

  // Calculate file size
  const getFileSize = (fileName: string) => {
    const sizeInBytes = fileName.length * 1024;
    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };
    return formatSize(sizeInBytes);
  };

  // Format date from ISO string or return "-" if invalid/missing
  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      return date.toLocaleDateString();
    } catch (error) {
      return '-';
    }
  };

  // Truncate file name and add tooltip if needed
  const formatFileName = (fileName: string) => {
    if (fileName.length <= maxNameLength) {
      return (
        <span className="font-medium">{fileName}</span>
      );
    }
    
    const truncatedName = fileName.substring(0, maxNameLength) + '...';
    return (
      <span 
        className="font-medium cursor-help" 
        title={fileName}
      >
        {truncatedName}
      </span>
    );
  };

  // Handle actions
  const handleAction = (action: string, fileId: string) => {
    setShowActionsMenu(null);
    
    // Validate file ID
    if (!fileId || fileId.trim() === '') {
      alert('Error: Invalid file ID');
      return;
    }
    
    switch (action) {
      case 'edit':
        setEditingFileId(fileId);
        break;
      case 'delete':
        setDeletingFileId(fileId);
        break;
      case 'download':
        handleDownload(fileId);
        break;
      default:
        break;
    }
  };

  // Handle file download
  const handleDownload = (fileId: string) => {
    const file = allFiles.find(f => f.id === fileId);
    if (!file) {
      alert('File not found');
      return;
    }

    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = `/public/${file.name}`;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle dropdown menu
  const toggleActionsMenu = (fileId: string) => {
    setShowActionsMenu(showActionsMenu === fileId ? null : fileId);
  };

  // Calculate pagination
  const totalFiles = allFiles.length;
  const totalPages = Math.ceil(totalFiles / filesPerPage);
  const startIndex = currentPage * filesPerPage;
  const endIndex = startIndex + filesPerPage;
  const currentFiles = allFiles.slice(startIndex, endIndex);

  // Get last modified files (last 3)
  const lastModifiedFiles = allFiles
    .sort((a, b) => new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime())
    .slice(0, 3);

  // Calculate file statistics
  const fileStats = {
    total: allFiles.length,
    images: allFiles.filter(f => f.kind === 'image').length,
    videos: allFiles.filter(f => f.kind === 'video').length,
    audios: allFiles.filter(f => f.kind === 'audio').length,
    documents: allFiles.filter(f => f.kind === 'document').length,
  };

  // Prepare pie chart data
  const pieChartData = {
    images: fileStats.images,
    videos: fileStats.videos,
    audios: fileStats.audios,
    documents: fileStats.documents,
    others: fileStats.total - (fileStats.images + fileStats.videos + fileStats.audios + fileStats.documents),
  };

  // Create table rows without actions column
      const tableRows: TableRow[] = currentFiles.map((file) => {
    return {
      id: file.id,
      cells: [
        // File name with icon
        (() => {
          const cellContent = (
            <div className="flex items-center gap-2">
              {getFileIcon(file.kind)}
              {formatFileName(file.name)}
            </div>
          );

          switch (file.kind) {
            case 'image':
              return <ImageViewer name={file.name} trigger={cellContent} />;
            case 'video':
              return <VideoViewer name={file.name} trigger={cellContent} />;
            case 'audio':
              return <AudioViewer name={file.name} trigger={cellContent} />;
            case 'document':
              return <DocumentViewer name={file.name} trigger={cellContent} />;
            default:
              return cellContent;
          }
        })(),
        // Folder name with link
        file.parentFolder ? (
          <a 
            href={`/folders/folder/${file.parentFolder.id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {file.parentFolder.name}
          </a>
        ) : (
          <span className="text-gray-500">Root</span>
        ),
        // File size
        getFileSize(file.name),
        // Upload date
        formatDate(file.uploadedAt),
        // Last updated date
        formatDate(file.lastUpdated),
      ]
    };
  });  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top section with two subsections - increased height and proper centering */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last Modified Files - 3 small cards in a row */}
        <div className="h-64 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Last Modified Files</h2>
          {lastModifiedFiles.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <AnimatedEmptyState
                type="lastModified"
                title="No files yet"
                description=""
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                {lastModifiedFiles.map((file) => {
                  const cardContent = (
                    <div className="bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors border border-gray-200">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                        {getFileIcon(file.kind, 20)}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm text-center mb-2 truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500 text-center">
                        {formatDate(file.lastUpdated)}
                      </p>
                    </div>
                  );

                  switch (file.kind) {
                    case 'image':
                      return <ImageViewer key={file.id} name={file.name} trigger={cardContent} />;
                    case 'video':
                      return <VideoViewer key={file.id} name={file.name} trigger={cardContent} />;
                    case 'audio':
                      return <AudioViewer key={file.id} name={file.name} trigger={cardContent} />;
                    case 'document':
                      return <DocumentViewer key={file.id} name={file.name} trigger={cardContent} />;
                    default:
                      return <div key={file.id}>{cardContent}</div>;
                  }
                })}
              </div>
            </div>
          )}
        </div>

        {/* File Statistics - Pie chart on right, details on left */}
        <div className="h-64 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">File Statistics</h2>
            <span className="text-sm text-gray-600">{fileStats.total} Total</span>
          </div>
          {fileStats.total === 0 ? (
            <div className="h-full flex items-center justify-center">
              <AnimatedEmptyState
                type="statistics"
                title="No files yet"
                description=""
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {/* Statistics Details - Left Side */}
              <div className="flex-1 max-w-xs">
                {/* File Type Statistics - 2 per row with smaller gap */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Images */}
                  {fileStats.images > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <ImageIcon size={20} className="text-green-600" />
                      </div>
                      <div className="text-xs font-bold text-gray-900">{fileStats.images} Images</div>
                    </div>
                  )}
                  
                  {/* Videos */}
                  {fileStats.videos > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <VideoIcon size={20} className="text-purple-600" />
                      </div>
                      <div className="text-xs font-bold text-gray-900">{fileStats.videos} Videos</div>
                    </div>
                  )}
                  
                  {/* Audios */}
                  {fileStats.audios > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AudioIcon size={20} className="text-blue-600" />
                      </div>
                      <div className="text-xs font-bold text-gray-900">{fileStats.audios} Audios</div>
                    </div>
                  )}
                  
                  {/* Documents */}
                  {fileStats.documents > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <DocIcon size={20} className="text-orange-600" />
                      </div>
                      <div className="text-xs font-bold text-gray-900">{fileStats.documents} Documents</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pie Chart - Right Side */}
              <div className="flex-1 max-w-xs">
                <PieChart data={pieChartData} total={fileStats.total} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Files Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Files</h2>
        {allFiles.length === 0 ? (
          <AnimatedEmptyState
            type="folders"
            title="No files uploaded yet"
            description=""
          />
        ) : (
          <>
            <Table
              headers={['Name', 'Folder', 'Size', 'Upload Date', 'Last Updated']}
              rows={tableRows}
              tableLabel="All files in the system"
            />
            
            {/* Custom Pagination with Page Numbers */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalFiles)} of {totalFiles} files
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === i
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit File Modal */}
      {editingFileId && (
        <EditFileButton
          fileId={editingFileId}
          fileName={allFiles.find(f => f.id === editingFileId)?.name || ''}
          open={!!editingFileId}
          onOpenChange={(open) => {
            if (!open) {
              setEditingFileId(null);
            }
          }}
        />
      )}

      {/* Delete File Modal */}
      {deletingFileId && (
        <DeleteFileButton
          fileId={deletingFileId}
          fileName={allFiles.find(f => f.id === deletingFileId)?.name || ''}
          open={!!deletingFileId}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingFileId(null);
            }
          }}
        />
      )}
    </div>
  );
}
