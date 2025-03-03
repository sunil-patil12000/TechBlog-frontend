import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import { Helmet } from 'react-helmet-async';

interface Post {
  _id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  author: {
    name: string;
  };
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPosts();
      setPosts(response.data.data.filter(post => post.status === 'published'));
    } catch (err: any) {
      setError('Failed to load posts');
      console.error(err);
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
        <title>Tech Blog | Latest Posts</title>
      </Helmet>

      {/* Modern Hero Section - without wave design */}
      <section
        className="relative h-[90vh] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-20 text-center px-4">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
              Tech Blog
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Your premier destination for cutting-edge technology insights, development tips, and innovative trends in programming.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/archives"
              className="px-8 py-3 bg-white text-blue-700 rounded-full font-medium hover:bg-blue-100 transition duration-300 shadow-lg border border-blue-200"
            >
              Browse Articles
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:text-blue-600 transition duration-300 shadow-lg"
            >
              Discover More
            </Link>
          </div>
        </div>
        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-10 w-full flex justify-center">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {/* Wave Separator removed */}
      </section>

      {/* Featured Posts Section - header color updated */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-indigo-900">
            Latest Articles
          </h2>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition duration-300">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    <Link to={`/blog/${post.slug}`} className="text-gray-900 hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h2>
                  <div className="text-gray-600 mb-4 text-sm">
                    <span>By {post.author?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="prose line-clamp-3 text-gray-600 mb-4" 
                    dangerouslySetInnerHTML={{ 
                      __html: post.content.substring(0, 150) + '...' 
                    }} 
                  />
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read more 
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && !error && (
            <p className="text-center text-gray-600">No posts found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;