import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../../services/api';
import PostForm from '../../components/admin/PostForm';
import { Helmet } from 'react-helmet-async';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (postData: any) => {
    try {
      const response = await postAPI.createPost(postData);
      if (response.data.success) {
        navigate('/admin/posts');
      } else {
        throw new Error(response.data.message || 'Failed to create post');
      }
    } catch (error: any) {
      console.error('Failed to create post:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create post');
      throw error;
    }
  };

  return (
    <>
      <Helmet>
        <title>Create New Post | Admin Dashboard</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <PostForm onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default CreatePostPage;
