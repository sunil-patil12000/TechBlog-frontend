import React, { useState, useEffect } from 'react';
import NormalizedImage from '../ui/NormalizedImage';
import { normalizeImageUrl } from '../../utils/contentProcessor';

interface ImageInfo {
  url: string;
  title: string;
  status: 'loading' | 'loaded' | 'error';
}

const ImageTest: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    // Test images from our script
    const testImages = [
      '/uploads/test-image-red.svg',
      '/uploads/test-image-blue.svg',
      '/uploads/test-image-green.svg',
      '/uploads/test-image-purple.svg',
      '/uploads/test-image-orange.svg',
      // Add the specific image the user is having trouble with
      '../../uploads/image-1741725168688-653605000.png'
    ].map(url => ({
      url,
      title: url.split('/').pop() || '',
      status: 'loading' as const
    }));

    setImages(testImages);
  }, []);

  const handleImageLoad = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: 'loaded' };
      return updated;
    });
  };

  const handleImageError = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: 'error' };
      return updated;
    });
  };

  const addCustomImage = () => {
    if (!customUrl) return;
    
    setImages(prev => [
      ...prev, 
      { 
        url: customUrl,
        title: customUrl.split('/').pop() || '',
        status: 'loading'
      }
    ]);
    
    setCustomUrl('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image Loading Test</h1>
      
      <div className="mb-6">
        <div className="flex">
          <input 
            type="text" 
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="Enter image URL to test"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          />
          <button
            onClick={addCustomImage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          >
            Test
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Example: /uploads/test-image-red.svg or ../../uploads/image.png
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={`${image.url}-${index}`} className="border rounded-lg p-4 bg-white">
            <h2 className="font-medium mb-2 truncate">{image.title}</h2>
            
            <div className="relative aspect-video bg-gray-100 flex items-center justify-center mb-2">
              {image.status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              
              <NormalizedImage
                src={image.url}
                alt={image.title}
                onLoad={() => handleImageLoad(index)}
                onImageError={() => handleImageError(index)}
                className={`w-full h-full object-contain ${image.status === 'loading' ? 'opacity-0' : 'opacity-100'}`}
              />
              
              {image.status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                  <p className="text-red-500">Failed to load image</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                image.status === 'loaded' ? 'bg-green-500' : 
                image.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></span>
              <span>{image.status}</span>
            </div>
            
            <p className="text-sm text-gray-500 mt-2 break-all">
              Original: {image.url}<br/>
              Normalized: {normalizeImageUrl(image.url)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest; 