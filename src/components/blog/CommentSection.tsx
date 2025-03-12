import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../../services/api';

interface Author {
  _id: string;
  name: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: Author;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  comments?: Comment[]; // Make comments optional
  isAuthenticated: boolean;
  onCommentAdded: (comment: Comment) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, 
  comments = [], // Provide empty array as default
  isAuthenticated,
  onCommentAdded
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await postAPI.addComment(postId, { content: commentText });
      onCommentAdded(response.data.data);
      setCommentText('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="mt-8 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
      
      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Leave a comment
            </label>
            <textarea
              id="comment"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
            ></textarea>
          </div>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-8">
          <p className="text-gray-700">
            Please <Link to="/login" className="text-blue-600 hover:text-blue-800">log in</Link> to leave a comment.
          </p>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  {comment.author.avatar ? (
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.name} 
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{comment.author.name}</p>
                  <p className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
              <div className="pl-13 mt-2">
                <p className="text-gray-800">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
