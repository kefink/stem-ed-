"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Image from "next/image";
import ImageEditor from "@/components/ImageEditor";

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
  folder_id: number | null;
  alt_text: string | null;
  title: string | null;
  description: string | null;
  created_at: string;
};

type MediaFolder = {
  id: number;
  name: string;
  parent_folder_id: number | null;
  file_count: number;
  subfolder_count: number;
};

export default function MediaLibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [editingImage, setEditingImage] = useState<MediaFile | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role;
    if (status === "unauthenticated" || role !== "admin") {
      router.replace("/login?next=/admin/media");
      return;
    }
    loadData();
  }, [status, session, router, currentFolderId, filterType, searchQuery, page]);

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
      if (filterType) {
        filesUrl += `&file_type=${filterType}`;
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

  const uploadFiles = async (filesToUpload: FileList | File[]) => {
    if (!filesToUpload || filesToUpload.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(filesToUpload)) {
        const formData = new FormData();
        formData.append("file", file);
        if (currentFolderId) {
          formData.append("folder_id", String(currentFolderId));
        }

        const response = await fetchWithAuth("/api/v1/admin/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          alert(`Failed to upload ${file.name}: ${error.detail}`);
        }
      }
      loadData();
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      await uploadFiles(uploadedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      await uploadFiles(droppedFiles);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetchWithAuth("/api/v1/admin/media/folders", {
        method: "POST",
        body: JSON.stringify({
          name: newFolderName,
          parent_folder_id: currentFolderId,
        }),
      });

      if (response.ok) {
        setNewFolderName("");
        setShowNewFolderModal(false);
        loadData();
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const deleteFile = async (fileId: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetchWithAuth(
        `/api/v1/admin/media/files/${fileId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSelectedFile(null);
        loadData();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const copyUrl = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert("URL copied to clipboard!");
  };

  const handleSaveEditedImage = async (blob: Blob, filename: string) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, filename);
      if (currentFolderId) {
        formData.append("folder_id", String(currentFolderId));
      }

      const response = await fetchWithAuth("/api/v1/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setEditingImage(null);
        loadData();
        alert("Edited image saved successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.detail}`);
      }
    } catch (error: any) {
      alert(`Save failed: ${error.message}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bebas text-navy mb-2">Media Library</h1>
          <p className="text-gray-600 font-lato">
            Upload and manage images, documents, and other media files
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 font-montserrat font-semibold disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "📤 Upload Files"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 font-montserrat font-semibold"
              >
                📁 New Folder
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg font-lato"
              >
                <option value="">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg font-lato"
              />

              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={`Switch to ${
                  viewMode === "grid" ? "list" : "grid"
                } view`}
              >
                {viewMode === "grid" ? "📋" : "🔲"}
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        {currentFolderId && (
          <div className="mb-4">
            <button
              onClick={() => setCurrentFolderId(null)}
              className="text-orange hover:underline font-montserrat"
            >
              ← Back to Root
            </button>
          </div>
        )}

        {/* Folders */}
        {folders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bebas text-navy mb-3">Folders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-all text-center"
                >
                  <div className="text-5xl mb-2">📁</div>
                  <p className="font-montserrat font-semibold text-navy truncate">
                    {folder.name}
                  </p>
                  <p className="text-xs text-gray-500 font-lato">
                    {folder.file_count} files
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Files Grid/List */}
        <div
          className="mb-6 relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-orange/20 border-4 border-dashed border-orange rounded-xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📤</div>
                <p className="text-2xl font-bebas text-navy">
                  Drop files here to upload
                </p>
              </div>
            </div>
          )}

          <h2 className="text-xl font-bebas text-navy mb-3">
            Files ({files.length})
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className="bg-white rounded-lg p-3 shadow hover:shadow-lg transition-all"
                >
                  {file.file_type === "image" ? (
                    <div className="aspect-square mb-2 relative bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={`http://localhost:8000${file.file_url}`}
                        alt={
                          file.alt_text || file.title || file.original_filename
                        }
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="aspect-square mb-2 flex items-center justify-center bg-gray-100 rounded text-4xl">
                      📄
                    </div>
                  )}
                  <p
                    className="text-xs font-montserrat truncate"
                    title={file.original_filename}
                  >
                    {file.original_filename}
                  </p>
                  <p className="text-xs text-gray-500 font-lato">
                    {formatFileSize(file.file_size)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Preview
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Filename
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Type
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Size
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Date
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="font-lato">
                  {files.map((file, idx) => (
                    <tr
                      key={file.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-4">
                        {file.file_type === "image" ? (
                          <div className="w-12 h-12 relative bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={`http://localhost:8000${file.file_url}`}
                              alt={file.alt_text || file.original_filename}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded text-2xl">
                            📄
                          </div>
                        )}
                      </td>
                      <td className="p-4">{file.original_filename}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">
                          {file.file_type}
                        </span>
                      </td>
                      <td className="p-4">{formatFileSize(file.file_size)}</td>
                      <td className="p-4">
                        {new Date(file.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedFile(file)}
                          className="text-orange hover:underline text-sm font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 font-montserrat">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* New Folder Modal */}
        {showNewFolderModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bebas text-navy mb-4">
                Create New Folder
              </h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 font-lato"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowNewFolderModal(false);
                    setNewFolderName("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-montserrat"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 font-montserrat font-semibold"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Details Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bebas text-navy">File Details</h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedFile.file_type === "image" && (
                <div className="mb-4 relative w-full h-64 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={`http://localhost:8000${selectedFile.file_url}`}
                    alt={
                      selectedFile.alt_text || selectedFile.original_filename
                    }
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              <div className="space-y-3 font-lato">
                <div>
                  <label className="font-semibold text-navy">Filename:</label>
                  <p className="text-gray-700">
                    {selectedFile.original_filename}
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-navy">Type:</label>
                  <p className="text-gray-700">{selectedFile.mime_type}</p>
                </div>
                <div>
                  <label className="font-semibold text-navy">Size:</label>
                  <p className="text-gray-700">
                    {formatFileSize(selectedFile.file_size)}
                  </p>
                </div>
                {selectedFile.width && selectedFile.height && (
                  <div>
                    <label className="font-semibold text-navy">
                      Dimensions:
                    </label>
                    <p className="text-gray-700">
                      {selectedFile.width} × {selectedFile.height}
                    </p>
                  </div>
                )}
                <div>
                  <label className="font-semibold text-navy">URL:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`http://localhost:8000${selectedFile.file_url}`}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-100 rounded border border-gray-300"
                    />
                    <button
                      onClick={() => copyUrl(selectedFile.file_url)}
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-montserrat"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                {selectedFile.file_type === "image" && (
                  <button
                    onClick={() => {
                      setEditingImage(selectedFile);
                      setSelectedFile(null);
                    }}
                    className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 font-montserrat font-semibold"
                  >
                    ✂️ Edit
                  </button>
                )}
                <button
                  onClick={() => deleteFile(selectedFile.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-montserrat font-semibold"
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `http://localhost:8000${selectedFile.file_url}`,
                      "_blank"
                    )
                  }
                  className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 font-montserrat font-semibold"
                >
                  🔗 Open
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Editor */}
        {editingImage && (
          <ImageEditor
            imageUrl={`http://localhost:8000${editingImage.file_url}`}
            onSave={handleSaveEditedImage}
            onCancel={() => setEditingImage(null)}
          />
        )}
      </div>
    </div>
  );
}
