import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import FileUploadButton from '../ui/FileUploadButton';

interface PostFormProps {
  onSubmit: (postData: any) => Promise<void>;
  initialData?: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    images: any[];
    published: boolean;
  };
  categories: Array<{
    _id: string;
    name: string;
  }>;
  isSubmitting: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ 
  onSubmit, 
  initialData = {
    title: '',
    content: '',
    category: '',
    tags: [],
    images: [],
    published: false
  },
  categories = [],
  isSubmitting
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [category, setCategory] = useState(initialData.category);
  const [tags, setTags] = useState<string[]>(initialData.tags);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [published, setPublished] = useState(initialData.published);
  const [submitting, setSubmitting] = useState(isSubmitting);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const editorRef = useRef<any>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<number | null>(null);

  // Handle image files selection
  const handleImageChange = (files: FileList) => {
    const selectedFiles = Array.from(files);
    
    // Validate that the files are actually images
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/'));
      
    if (validFiles.length !== selectedFiles.length) {
      setErrors(prev => ({
        ...prev, 
        images: 'All uploaded files must be images'
      }));
    } else {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.images;
        return newErrors;
      });
    }
    
    setImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);

    // If no thumbnail is selected yet, set the first uploaded image as thumbnail
    if (selectedThumbnail === null && validFiles.length > 0) {
      setSelectedThumbnail(images.length); // Index of the first new image
    }
    
    // Add thumbnail warning if needed
    if (images.length === 0 && validFiles.length === 0) {
      setErrors(prev => ({
        ...prev,
        thumbnailWarning: 'No images available for thumbnail. Post will be created without a thumbnail.'
      }));
    } else {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.thumbnailWarning;
        return newErrors;
      });
    }
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    // If removing the selected thumbnail, reset the selection
    if (selectedThumbnail === index) {
      setSelectedThumbnail(null);
    } 
    // If removing an image before the thumbnail, adjust the thumbnail index
    else if (selectedThumbnail !== null && selectedThumbnail > index) {
      setSelectedThumbnail(selectedThumbnail - 1);
    }
    
    setImages(images.filter((_, i) => i !== index));
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input key press (add tag on Enter)
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Get content from the editor
    const editorContent = editorRef.current?.getContent() || content;
    
    if (!editorContent.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    } else if (categories.length > 0 && !categories.some(cat => cat._id === category)) {
      // Validate that the selected category exists in the categories list
      newErrors.category = 'Please select a valid category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Select an image as thumbnail
  const selectAsThumbnail = (index: number) => {
    setSelectedThumbnail(index);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Make sure to get the latest content from the editor
      const currentContent = editorRef.current?.getContent() || content;
      
      // Create FormData object for multipart/form-data submission
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', currentContent);
      
      // Log category value for debugging
      console.log('Category being submitted:', category);
      
      // Make sure category is not empty and is a valid ID
      if (!category) {
        throw new Error('Category is required');
      }
      
      // Additional check for category validity
      if (categories.length > 0 && !categories.some(cat => cat._id === category)) {
        throw new Error('Selected category is not valid');
      }
      
      formData.append('category', category);
      formData.append('published', String(published));
      
      // Add tags as JSON string
      formData.append('tags', JSON.stringify(tags));
      
      // Add thumbnailIndex if we have a selected thumbnail
      if (selectedThumbnail !== null) {
        console.log('Setting thumbnailIndex:', selectedThumbnail);
        formData.append('thumbnailIndex', String(selectedThumbnail));
      }
      
      // Append all image files
      if (images.length > 0) {
        console.log(`Appending ${images.length} images to form data`);
        images.forEach((file, i) => {
          console.log(`Adding image ${i}: ${file.name}`);
          formData.append('images', file);
        });
      } else {
        console.log('No images to upload');
      }
      
      // Log form data entries for debugging
      console.log('Form data entries:');
      for (const pair of formData.entries()) {
        // Don't log the actual file contents
        if (pair[0] === 'images' && pair[1] instanceof File) {
          console.log(`${pair[0]}: [File ${pair[1].name}]`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      
      // Submit the form
      await onSubmit(formData);
      
      // Clear the form after successful submission
      setImages([]);
      setPreviewImages([]);
      setSelectedThumbnail(null);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to submit the form. Please try again.'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.title ? 'border-red-500' : ''
          }`}
          placeholder="Post title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>
      
      {/* Category Select */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.category ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select a category</option>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))
          ) : (
            <option value="" disabled>No categories available - please create categories first</option>
          )}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        {categories.length === 0 && (
          <p className="mt-1 text-sm text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No categories available. Please create categories in the admin panel first.
          </p>
        )}
      </div>
      
      {/* Tags Input */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="flex items-center">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagKeyPress}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Add tags and press Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>
      
      {/* Images Upload - Replace existing image upload with FileUploadButton */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <div className="mt-1 flex items-center">
          <FileUploadButton
            onFilesSelected={handleImageChange}
            multiple
            accept="image/*"
            buttonText="Upload Images"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-500">
            {images.length > 0 ? `${images.length} file(s) selected` : 'No files selected'}
          </span>
        </div>
        
        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
        {errors.thumbnailWarning && (
          <p className="mt-1 text-sm text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.thumbnailWarning}
          </p>
        )}
        
        {/* Add note about thumbnails */}
        {previewImages.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Click on an image to set it as the post thumbnail
              {selectedThumbnail !== null && (
                <span className="ml-2 text-green-600 font-medium">
                  (Thumbnail selected)
                </span>
              )}
            </p>
          </div>
        )}
        
        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {previewImages.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className={`h-24 w-24 object-cover rounded-md cursor-pointer ${
                    selectedThumbnail === index 
                      ? 'ring-4 ring-indigo-500 ring-offset-2' 
                      : 'hover:opacity-80'
                  }`}
                  onClick={() => selectAsThumbnail(index)}
                />
                {selectedThumbnail === index && (
                  <div className="absolute -top-2 -left-2 bg-indigo-500 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Content Editor */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content <span className="text-red-500">*</span>
        </label>
        <div className={errors.content ? 'border border-red-500 rounded-md' : ''}>
          <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            apiKey="de10ptx41tdqr4xhvous2k4soayceyg58pgxlw42s9l6qvy9" // Replace with your TinyMCE API key
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                'imagetools'
              ],
              toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'image media | removeformat | help',
              images_upload_url: '/api/posts/upload-image', // Your image upload endpoint
              images_upload_handler: async function (blobInfo, progress) {
                return new Promise((resolve, reject) => {
                  const formData = new FormData();
                  formData.append('image', blobInfo.blob(), blobInfo.filename());
                  
                  // Get token for authentication
                  const token = localStorage.getItem('token');
                  
                  fetch('/api/posts/upload-image', {
                    method: 'POST',
                    body: formData,
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    credentials: 'include'
                  })
                    .then(response => {
                      if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                      }
                      return response.text();
                    })
                    .then(text => {
                      try {
                        const data = JSON.parse(text);
                        if (data.success) {
                          console.log('Image uploaded successfully:', data.location);
                          
                          // If no thumbnail is selected and this is the first image,
                          // automatically use it as thumbnail
                          if (images.length === 0 && selectedThumbnail === null && 
                              previewImages.length === 0) {
                            console.log('Setting first uploaded TinyMCE image as default thumbnail');
                            // This won't actually set the thumbnail but provides context
                            // for the backend to know this is the first image
                          }
                          
                          resolve(data.location);
                        } else {
                          throw new Error(data.message || 'Upload failed');
                        }
                      } catch (e) {
                        console.error('Error parsing response:', e);
                        reject('Image upload failed: Invalid server response');
                      }
                    })
                    .catch(error => {
                      console.error('Image upload error:', error);
                      reject(`Image upload failed: ${error.message}`);
                    });
                });
              },
              file_picker_types: 'image',
              /* enable title field in the Image dialog*/
              image_title: true,
              /* enable automatic uploads of images represented by blob or data URIs*/
              automatic_uploads: true,
              file_picker_callback: function (cb, value, meta) {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                input.onchange = function () {
                  if (!input.files?.length) return;
                  const file = input.files[0];

                  const reader = new FileReader();
                  reader.onload = function () {
                    const id = 'blobid' + (new Date()).getTime();
                    const blobCache =  editorRef.current.editorUpload.blobCache;
                    const base64 = (reader.result as string).split(',')[1];
                    const blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri(), { title: file.name });
                  };
                  reader.readAsDataURL(file);
                };

                input.click();
              }
            }}
          />
        </div>
        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
      </div>
      
      {/* Published Toggle */}
      <div className="flex items-center">
        <input
          id="published"
          name="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
          Publish immediately
        </label>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
