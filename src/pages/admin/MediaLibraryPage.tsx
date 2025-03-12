import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Grid, 
  List, 
  Upload, 
  X, 
  Search,
  RefreshCw,
  CheckCircle,
  Filter,
  Info,
  ExternalLink,
  XCircle
} from 'lucide-react';
import { uploadAPI } from '../../services/api';
import { Helmet } from 'react-helmet-async';
import { getRandomUnsplashImage, getUnsplashImage } from '../../utils/unsplash';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  dimensions?: {
    width: number;
    height: number;
  };
  alt?: string;
}

const MediaLibraryPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUnsplashModalOpen, setIsUnsplashModalOpen] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashImages, setUnsplashImages] = useState<any[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the API to get media items
      // Replace with actual API once implemented
      // For now, use mock data
      if (process.env.NODE_ENV === 'development') {
        setMediaItems(generateMockMediaItems(20));
      } else {
        // Placeholder for actual API call
        const response = await fetch('/api/media');
        const data = await response.json();
        setMediaItems(data);
      }
    } catch (err) {
      console.error('Error fetching media items:', err);
      setError('Failed to load media. Please try again.');
      
      // Always use mock data for now
      setMediaItems(generateMockMediaItems(20));
    } finally {
      setLoading(false);
    }
  };

  const generateMockMediaItems = (count: number): MediaItem[] => {
    const types = ['image/jpeg', 'image/png', 'image/webp'];
    const names = [
      'hero-background.jpg',
      'profile-picture.png',
      'blog-thumbnail.webp',
      'logo.png',
      'header-image.jpg',
      'product-showcase.webp',
      'team-photo.jpg',
      'infographic.png'
    ];
    
    return Array.from({ length: count }).map((_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const nameIndex = i % names.length;
      const width = Math.floor(Math.random() * 800) + 400;
      const height = Math.floor(Math.random() * 600) + 300;
      
      return {
        id: `media-${i + 1}`,
        url: `https://source.unsplash.com/random/${width}x${height}?sig=${i}`,
        name: names[nameIndex],
        type,
        size: Math.floor(Math.random() * 5000000) + 100000, // Size in bytes
        uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        dimensions: {
          width,
          height
        },
        alt: `Description for ${names[nameIndex]}`
      };
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);
    
    const validFiles = Array.from(files).filter(file => {
      // Check if file is an image
      return file.type.startsWith('image/');
    });
    
    if (validFiles.length === 0) {
      setUploadError('Only image files are allowed.');
      setIsUploading(false);
      return;
    }
    
    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(uploadInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      // Process each file
      for (const file of validFiles) {
        try {
          // In a real implementation, use the upload API
          // await uploadAPI.uploadImage(file);
          
          // For now, just simulate the upload
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Add the new item to the list
          const newItem: MediaItem = {
            id: `media-${Date.now()}`,
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            dimensions: {
              width: 800, // Placeholder
              height: 600 // Placeholder
            }
          };
          
          setMediaItems(prev => [newItem, ...prev]);
        } catch (uploadError) {
          console.error('Error uploading file:', file.name, uploadError);
        }
      }
      
      // Complete the upload
      clearInterval(uploadInterval);
      setUploadProgress(100);
      setUploadSuccess(`Successfully uploaded ${validFiles.length} files.`);
      
      // Reset the progress after a delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Error during upload:', err);
      setUploadError('An error occurred during upload. Please try again.');
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }
    
    try {
      // In a real implementation, use the delete API
      // await uploadAPI.deleteImage(itemId);
      
      // For now, just remove from state
      setMediaItems(prev => prev.filter(item => item.id !== itemId));
      
      if (selectedItem?.id === itemId) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const searchUnsplash = async () => {
    if (!unsplashQuery.trim()) return;
    
    setUnsplashLoading(true);
    try {
      // Use the fallback method instead
      const results = Array.from({ length: 6 }).map((_, index) => {
        const url = getUnsplashImage(unsplashQuery, { 
          width: 400, 
          height: 300,
          slug: `${unsplashQuery}-${index}` // Add a unique identifier per image
        });
        
        return {
          url,
          photographer: {
            name: 'Unsplash',
            username: 'unsplash',
            profileUrl: 'https://unsplash.com'
          },
          description: unsplashQuery
        };
      });
      
      setUnsplashImages(results);
    } catch (err) {
      console.error('Error searching Unsplash:', err);
    } finally {
      setUnsplashLoading(false);
    }
  };

  const handleAddUnsplashImage = async (image: any) => {
    // In a real implementation, you would download the image and upload it to your server
    // For now, just add it directly to the media items
    
    const newItem: MediaItem = {
      id: `unsplash-${Date.now()}`,
      url: image.url,
      name: `unsplash-${unsplashQuery}-${Date.now()}.jpg`,
      type: 'image/jpeg',
      size: 500000, // Placeholder
      uploadedAt: new Date().toISOString(),
      dimensions: {
        width: 800, // Placeholder
        height: 600 // Placeholder
      },
      alt: image.description || unsplashQuery
    };
    
    setMediaItems(prev => [newItem, ...prev]);
    setIsUnsplashModalOpen(false);
    setUnsplashImages([]);
    setUnsplashQuery('');
    setUploadSuccess('Unsplash image added to media library.');
  };

  const filteredItems = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Media Library | Admin Dashboard</title>
      </Helmet>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your images and media assets</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsUnsplashModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <ImageIcon size={18} />
            Add from Unsplash
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Upload size={18} />
            Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
      </div>
      
      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 dark:text-blue-400 font-medium">Uploading...</span>
            <span className="text-blue-700 dark:text-blue-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {uploadSuccess && !isUploading && (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
          <div className="flex">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <p className="text-green-700 dark:text-green-400">{uploadSuccess}</p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {(uploadError || error) && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="flex">
            <XCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700 dark:text-red-400">{uploadError || error}</p>
          </div>
        </div>
      )}
      
      {/* Drop zone */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center 
          ${dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload size={36} className="text-gray-400 mb-4" />
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-2">
            {dragActive ? 'Drop your files here' : 'Drag and drop files here'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Browse Files
          </button>
        </div>
      </div>
      
      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
          >
            <List size={20} />
          </button>
          <button
            onClick={fetchMediaItems}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {/* Media Items Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center p-12">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No media found</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Upload your first image
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`relative overflow-hidden rounded-lg group ${selectedItem?.id === item.id ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.alt || item.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(item.size)}</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.url);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Copy size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preview
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dimensions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedItem?.id === item.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img 
                          src={item.url} 
                          alt={item.alt || item.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.dimensions ? `${item.dimensions.width} × ${item.dimensions.height}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatBytes(item.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.uploadedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.url, '_blank');
                          }}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.url);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Selected Item Details */}
      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Media Details</h2>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.alt || selectedItem.name} 
                  className="max-w-full max-h-96 object-contain" 
                />
              </div>
              
              <div className="md:w-1/2 p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">File Name</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedItem.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">URL</h3>
                    <div className="mt-1 flex items-center">
                      <div className="flex-1 truncate text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        {selectedItem.url}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(selectedItem.url)}
                        className="ml-2 p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">MIME Type</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedItem.type}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dimensions</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedItem.dimensions ? `${selectedItem.dimensions.width} × ${selectedItem.dimensions.height} pixels` : 'Unknown'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">File Size</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatBytes(selectedItem.size)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploaded</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(selectedItem.uploadedAt)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Alt Text</h3>
                    <input
                      type="text"
                      value={selectedItem.alt || ''}
                      placeholder="Add alt text for accessibility"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      // In a real app, you'd handle updating the alt text
                      onChange={() => {}} 
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Add alt text to describe the image for screen readers and SEO.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Unsplash Modal */}
      {isUnsplashModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Add From Unsplash</h2>
              <button 
                onClick={() => {
                  setIsUnsplashModalOpen(false);
                  setUnsplashImages([]);
                  setUnsplashQuery('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Search for images..."
                  value={unsplashQuery}
                  onChange={(e) => setUnsplashQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') searchUnsplash();
                  }}
                />
                <button
                  onClick={searchUnsplash}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700"
                  disabled={unsplashLoading}
                >
                  {unsplashLoading ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
              
              {unsplashLoading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : unsplashImages.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {unsplashImages.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative rounded-lg overflow-hidden group cursor-pointer"
                        onClick={() => handleAddUnsplashImage(image)}
                      >
                        <img 
                          src={image.url} 
                          alt={image.description} 
                          className="w-full h-40 object-cover transition-transform group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-sm">
                            Click to add
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white text-xs">
                          Photo by {image.photographer.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    <p>Photos provided by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Unsplash</a></p>
                    <p>Please respect the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Unsplash License</a></p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
                    <ImageIcon size={96} stroke="currentColor" strokeWidth={1} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Search for images on Unsplash to add to your media library
                  </p>
                  <div className="flex justify-center gap-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Info size={14} className="mr-1" />
                    <p>You can search for topics like "nature", "technology", or "people"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage; 