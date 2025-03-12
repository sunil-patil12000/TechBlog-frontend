import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, MessageCircle, Eye, Tag, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { mockPosts } from '../data/mockPosts';
import Comments from '../components/blog/Comments';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setIsLoading(true);
    try {
      // Find the post in mockPosts
      const foundPost = mockPosts.find(p => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Error loading post');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
            {error || 'Post not found'}
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">
            We couldn't find the post you're looking for.
          </p>
          <Link
            to="/blog"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Post Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime} min read</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{post.viewCount} views</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentCount} comments</span>
          </div>
        </div>
        
        <Link to={`/author/${post.author.id}`} className="flex items-center gap-3 mb-8">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{post.author.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Author</p>
          </div>
        </Link>
      </header>
      
      {/* Featured Image */}
      {post.thumbnail && (
        <figure className="mb-10">
          <img 
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-auto rounded-lg object-cover"
          />
          <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Featured image for {post.title}
          </figcaption>
        </figure>
      )}
      
      {/* Post Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* Placeholder for actual content */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          This is where the full article content would be displayed. In a real implementation, 
          this would likely be rendered using a markdown parser or rich text editor output.
        </p>
        
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          The content could include paragraphs, headings, lists, code blocks, images, and other 
          elements that make up a complete blog post.
        </p>
      </div>
      
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">Tags:</span>
            {post.tags.map((tag: any) => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Share */}
      <div className="flex items-center justify-center gap-4 mb-12 py-6">
        <span className="font-medium text-gray-700 dark:text-gray-300">Share this article:</span>
        <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
      
      {/* Comments */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>
        <Comments postId={post.id} />
      </div>
    </div>
  );
};

export default PostDetail;
