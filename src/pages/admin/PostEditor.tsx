import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Save, 
  Eye, 
  Upload, 
  Image, 
  Tag, 
  Settings2, 
  XCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { useDropzone } from 'react-dropzone';

const PostEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image/*': []},
    onDrop: (files) => setFeaturedImage(URL.createObjectURL(files[0]))
  });

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputTag.trim()) {
      setTags([...tags, inputTag.trim()]);
      setInputTag('');
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>New Post - TechNews Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Post
        </h2>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Save className="w-5 h-5 mr-2" />
            Save Draft
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
              placeholder="Enter post title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <div className="border rounded-lg overflow-hidden">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                height={500}
                preview="edit"
              />
            </div>
          </div>
        </div>

        {/* Settings Column */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <input {...getInputProps()} />
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="rounded-lg mb-2"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeaturedImage(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 1200x630px
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Post Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publish Date
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                />
                <CalendarIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="ml-2 text-indigo-400 hover:text-indigo-500"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tag..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SEO Description
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                placeholder="Enter SEO description..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor; 