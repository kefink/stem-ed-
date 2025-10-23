"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Image from "next/image";

type MediaFile = {
  id: number;
  filename: string;
  original_filename: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  title: string | null;
};

type MediaFolder = {
  id: number;
  name: string;
  parent_folder_id: number | null;
  file_count: number;
  subfolder_count: number;
};

interface MediaPickerProps {
  onSelect: (file: MediaFile) => void;
  onCancel: () => void;
  fileType?: "image" | "document" | "all";
}

export default function MediaPicker({
  onSelect,
  onCancel,
  fileType = "all",
}: MediaPickerProps) {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [currentFolderId, searchQuery, page, fileType]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load folders
      const foldersUrl = currentFolderId
        ? `/api/v1/admin/media/folders?parent_folder_id=${currentFolderId}`
        : `/api/v1/admin/media/folders`;
      const foldersRes = await fetchWithAuth(foldersUrl);
      const foldersData = await foldersRes.json();
      setFolders(foldersData.items);

      // Load files
      let filesUrl = `/api/v1/admin/media/files?page=${page}&page_size=20`;
      if (currentFolderId !== null) {
        filesUrl += `&folder_id=${currentFolderId}`;
      }
      if (fileType !== "all") {
        filesUrl += `&file_type=${fileType}`;
      }
      if (searchQuery) {
        filesUrl += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const filesRes = await fetchWithAuth(filesUrl);
      const filesData = await filesRes.json();
      setFiles(filesData.items);
      setTotalPages(filesData.total_pages);
    } catch (error) {
      console.error("Error loading media:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bebas text-navy">Select Media</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Search and Navigation */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-lato"
            />
            {currentFolderId && (
              <button
                onClick={() => setCurrentFolderId(null)}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 font-montserrat"
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
            </div>
          ) : (
            <>
              {/* Folders */}
              {folders.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bebas text-navy mb-3">Folders</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => setCurrentFolderId(folder.id)}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all text-center"
                      >
                        <div className="text-3xl mb-1">📁</div>
                        <p className="font-montserrat text-sm truncate">
                          {folder.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {folder.file_count} files
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files Grid */}
              <div>
                <h3 className="text-lg font-bebas text-navy mb-3">
                  Files ({files.length})
                </h3>
                {files.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No files found</p>
                    <p className="text-sm">
                      Try a different folder or search term
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {files.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => onSelect(file)}
                        className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-orange hover:shadow-lg transition-all group"
                      >
                        {file.file_type === "image" ? (
                          <div className="aspect-square mb-2 relative bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={`http://localhost:8000${file.file_url}`}
                              alt={file.alt_text || file.original_filename}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="aspect-square mb-2 flex items-center justify-center bg-gray-100 rounded text-4xl">
                            📄
                          </div>
                        )}
                        <p
                          className="font-montserrat text-xs truncate"
                          title={file.original_filename}
                        >
                          {file.original_filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.file_size)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-montserrat"
            >
              Previous
            </button>
            <span className="px-4 py-2 font-montserrat">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-montserrat"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
