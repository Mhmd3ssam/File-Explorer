"use client";

import { useState, useEffect, useRef } from 'react';
import { Table, type TableRow } from '@/components/shared/Table';
import { DocIcon, ImageIcon, VideoIcon, AudioIcon, FileIcon } from '@/components/shared/icons';
import { PieChart } from '@/components/shared/PieChart';
import type { FileNode } from '@/lib/data-client';

export default function DashboardPage() {
  const [allFiles, setAllFiles] = useState<FileNode[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
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
          setAllFiles(files);
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
  
  // Calculate file statistics
  const fileStats = {
    total: allFiles.length,
    images: allFiles.filter(f => f.kind === 'image').length,
    videos: allFiles.filter(f => f.kind === 'video').length,
    audios: allFiles.filter(f => f.kind === 'audio').length,
    documents: allFiles.filter(f => f.kind === 'document').length,
    others: allFiles.filter(f => !f.kind || f.kind === 'unknown').length,
  };

  // Get last 3 modified files (sorted by lastUpdated)
  const lastModifiedFiles = allFiles
    .sort((a, b) => new Date(b.lastUpdated || b.uploadedAt || '').getTime() - new Date(a.lastUpdated || a.uploadedAt || '').getTime())
    .slice(0, 3);
  
  // Calculate pagination
  const totalFiles = allFiles.length;
  const totalPages = Math.ceil(totalFiles / filesPerPage);
  const startIndex = currentPage * filesPerPage;
  const endIndex = startIndex + filesPerPage;
  const currentFiles = allFiles.slice(startIndex, endIndex);

  // Get file icon based on file type
  const getFileIcon = (kind?: string, size: number = 16) => {
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
    console.log(`${action} file:`, fileId);
    setShowActionsMenu(null);
    // TODO: Implement actual actions
  };

  // Toggle dropdown menu
  const toggleActionsMenu = (fileId: string) => {
    setShowActionsMenu(showActionsMenu === fileId ? null : fileId);
  };

  // Create table rows
  const tableRows: TableRow[] = currentFiles.map((file, index) => {
    const isLastItem = index === currentFiles.length - 1;
    
    return {
      id: file.id,
      cells: [
        // File name with icon
        <div className="flex items-center gap-2">
          {getFileIcon(file.kind)}
          {formatFileName(file.name)}
        </div>,
        // File size
        getFileSize(file.name),
        // Upload date
        formatDate(file.uploadedAt),
        // Last updated date
        formatDate(file.lastUpdated),
        // Actions dropdown
        <div className="flex items-center justify-end relative" ref={index === currentFiles.length - 1 ? dropdownRef : null}>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => toggleActionsMenu(file.id)}
          >
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showActionsMenu === file.id && (
            <div className={`absolute right-0 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 ${
              isLastItem ? 'bottom-8' : 'top-8'
            }`}>
              <div className="py-1">
                <button
                  onClick={() => handleAction('edit', file.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleAction('delete', file.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAction('download', file.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      ]
    };
  });

  if (loading) {
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
            <div className="text-center py-8">
              <div className="text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">No files yet</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                {lastModifiedFiles.map((file) => (
                  <div key={file.id} className="bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors border border-gray-200">
                    {/* Small file icon with gray background */}
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                      {getFileIcon(file.kind, 20)}
                    </div>
                    
                    {/* File name */}
                    <h3 className="font-medium text-gray-900 text-sm text-center mb-2 truncate" title={file.name}>
                      {file.name}
                    </h3>
                    
                    {/* Last updated date */}
                    <p className="text-xs text-gray-500 text-center">
                      {formatDate(file.lastUpdated)}
                    </p>
                  </div>
                ))}
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
            <div className="text-center py-8">
              <div className="text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm">No files yet</p>
              </div>
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
                      <div className="text-sm font-bold text-gray-900">{fileStats.images} Images</div>
                    </div>
                  )}
                  
                  {/* Videos */}
                  {fileStats.videos > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <VideoIcon size={20} className="text-purple-600" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">{fileStats.videos} Videos</div>
                    </div>
                  )}
                  
                  {/* Audios */}
                  {fileStats.audios > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <AudioIcon size={20} className="text-orange-600" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">{fileStats.audios} Audios</div>
                    </div>
                  )}
                  
                  {/* Documents */}
                  {fileStats.documents > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <DocIcon size={20} className="text-red-600" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">{fileStats.documents} Documents</div>
                    </div>
                  )}
                  
                  {/* Others */}
                  {fileStats.others > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileIcon size={20} className="text-gray-600" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">{fileStats.others} Others</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pie Chart - Right Side, aligned with details */}
              <div className="flex-shrink-0 ml-6">
                <PieChart 
                  data={{
                    images: fileStats.images,
                    videos: fileStats.videos,
                    audios: fileStats.audios,
                    documents: fileStats.documents,
                    others: fileStats.others,
                  }}
                  total={fileStats.total}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Files Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Files</h2>
        {allFiles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No files uploaded yet</p>
            </div>
          </div>
        ) : (
          <>
            <Table
              headers={['Name', 'Size', 'Upload Date', 'Last Updated', '']}
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
    </div>
  );
}
