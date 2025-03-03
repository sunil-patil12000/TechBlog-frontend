import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import { Helmet } from 'react-helmet-async';

interface Post {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
  author: {
    name: string;
  };
}

const ArchivesPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getPosts();
      const publishedPosts = response.data.data
        .filter(post => post.status === 'published')
        .sort((a: Post, b: Post) => (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      setPosts(publishedPosts);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <>
      <Helmet>
        <title>Archives | All Posts</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Archives</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post._id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h2>
                  <div className="text-sm text-gray-600 mt-1">
                    By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Read →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && !error && (
          <p className="text-center text-gray-600">No posts found.</p>
        )}
      </div>
    </>
  );
};

export default ArchivesPage;