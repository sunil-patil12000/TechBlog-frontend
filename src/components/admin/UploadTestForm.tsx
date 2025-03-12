import React, { useState, useRef } from 'react';

const UploadTestForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Make sure to respect proxy configuration
      const response = await fetch('/api/test/upload', {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      });
      
      const responseText = await response.text();
      setResponse(responseText);
      
      // First check if we have response text before trying to parse
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response received from server');
      }
      
      try {
        const data = JSON.parse(responseText);
        if (data.success) {
          alert('Upload successful! See console for details.');
          console.log('Upload successful:', data);
        } else {
          setError(data.message || 'Upload failed');
        }
      } catch (e) {
        console.error('Error parsing server response:', e);
        console.error('Raw response:', responseText);
        
        // Check if it's an HTML error page
        if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
          setError('Server returned HTML instead of JSON - check server logs');
        } else {
          setError('Invalid server response');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Test Image Upload</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-gray-700 border border-gray-300 rounded py-2 px-4"
          />
        </div>
        
        {preview && (
          <div className="mb-4">
            <p className="text-gray-700 mb-2">Preview:</p>
            <img src={preview} alt="Preview" className="max-h-40 rounded" />
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !file}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
      
      {response && (
        <div className="mt-6">
          <p className="text-gray-700 font-semibold mb-2">Server Response:</p>
          <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
};

export default UploadTestForm;
