import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PostList from '../components/PostList';
import { postAPI } from '../services/api';

const LatestPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postAPI.getPosts(1, 20, { sortBy: 'createdAt', order: 'desc' });
        setPosts(response.data.data);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Latest Posts | BlogFolio</title>
        <meta name="description" content="Check out our most recent articles and updates" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md h-40"></div>
            ))}
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </>
  );
};

export default LatestPostsPage;
