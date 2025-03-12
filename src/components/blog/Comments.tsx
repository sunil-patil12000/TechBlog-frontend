import React, { useState, useEffect } from 'react';

interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  date: string;
  avatar: string;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: '',
  });

  useEffect(() => {
    // In a real app, fetch comments from API
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setComments([
        {
          id: '1',
          name: 'Jane Cooper',
          email: 'jane@example.com',
          content: 'Great article! This was really helpful for my project.',
          date: '2023-08-15T14:30:00Z',
          avatar: '/images/placeholder-avatar.svg',
        },
        {
          id: '2',
          name: 'Robert Johnson',
          email: 'robert@example.com',
          content: 'I found this really insightful. Have you considered covering X topic as well?',
          date: '2023-08-16T09:15:00Z',
          avatar: '/images/placeholder-avatar.svg',
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, [postId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, post to API
    const newCommentObj: Comment = {
      id: `temp-${Date.now()}`,
      name: newComment.name,
      email: newComment.email,
      content: newComment.content,
      date: new Date().toISOString(),
      avatar: '/images/placeholder-avatar.svg',
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewComment({ name: '', email: '', content: '' });
  };

  return (
    <div className="comments-section">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Leave a comment</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newComment.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newComment.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comment
          </label>
          <textarea
            id="content"
            name="content"
            value={newComment.content}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Post Comment
        </button>
      </form>
      
      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <img
                  src={comment.avatar}
                  alt={comment.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{comment.name}</h4>
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.date).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;