'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, Folder, Image as ImageIcon, X } from 'lucide-react';

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  folder?: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

interface MediaLibraryProps {
  onSelect?: (file: MediaFile) => void;
  multiple?: boolean;
  folder?: string;
}

export function MediaLibrary({ onSelect, multiple = false, folder }: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(folder || null);

  useEffect(() => {
    loadFiles();
  }, [selectedFolder]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedFolder) params.set('folder', selectedFolder);
      const response = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        if (selectedFolder) formData.append('folder', selectedFolder);

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          await loadFiles();
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
  });

  const filteredFiles = files.filter((file) => {
    if (searchQuery) {
      return (
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.altText?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">or click to select</p>
              </>
            )}
            {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedFolder && (
          <Button
            variant="outline"
            onClick={() => setSelectedFolder(null)}
          >
            <X className="h-4 w-4 mr-2" />
            Clear Folder
          </Button>
        )}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading media...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No media files found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelect && onSelect(file)}
            >
              <CardContent className="p-2">
                <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-2">
                  {file.thumbnailUrl ? (
                    <img
                      src={file.thumbnailUrl}
                      alt={file.altText || file.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium truncate" title={file.originalName}>
                  {file.originalName}
                </p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

