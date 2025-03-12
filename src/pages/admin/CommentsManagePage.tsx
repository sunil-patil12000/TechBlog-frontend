import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Check, 
  X, 
  AlertTriangle, 
  MoreHorizontal,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar: string;
  };
  post: {
    id: string;
    title: string;
    slug: string;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  replies?: number;
}

const CommentsManagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'spam' | 'trash'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionDropdown, setActionDropdown] = useState<string | null>(null);

  // Mock data
  const comments: Comment[] = [
    {
      id: '1',
      content: "Great article! I learned a lot about React hooks that I didn't know before. Would be great to see a follow-up on custom hooks.",
      author: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      post: {
        id: '101',
        title: 'Understanding React Hooks',
        slug: 'understanding-react-hooks',
      },
      createdAt: '2023-06-10T15:30:22Z',
      status: 'pending',
    },
    {
      id: '2',
      content: "I disagree with point #3. TypeScript definitely has more advantages than what you've listed here.",
      author: {
        name: 'Emily Johnson',
        email: 'emily.j@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      post: {
        id: '102',
        title: 'TypeScript vs JavaScript in 2023',
        slug: 'typescript-vs-javascript-2023',
      },
      createdAt: '2023-06-09T08:45:10Z',
      status: 'pending',
      replies: 2,
    },
    {
      id: '3',
      content: 'Buy luxury watches at discount prices! Check out our website for more info.',
      author: {
        name: 'SpamUser123',
        email: 'spam@example.com',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      },
      post: {
        id: '103',
        title: 'The Future of Web Development',
        slug: 'future-web-development',
      },
      createdAt: '2023-06-08T22:10:05Z',
      status: 'spam',
    },
    {
      id: '4',
      content: "Thanks for sharing these insights! I've been using Tailwind CSS for my projects and it has definitely improved my workflow.",
      author: {
        name: 'Alex Rodriguez',
        email: 'alex.rod@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      },
      post: {
        id: '104',
        title: 'Why We Chose Tailwind CSS',
        slug: 'why-we-chose-tailwind',
      },
      createdAt: '2023-06-07T14:22:18Z',
      status: 'approved',
    },
    {
      id: '5',
      content: "I've been following your blog for months now and the quality just keeps getting better. Keep up the great work!",
      author: {
        name: 'Sophie Miller',
        email: 'sophie.m@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
      post: {
        id: '101',
        title: 'Understanding React Hooks',
        slug: 'understanding-react-hooks',
      },
      createdAt: '2023-06-06T09:15:42Z',
      status: 'approved',
    },
    {
      id: '6',
      content: 'This comment has been flagged for violating community guidelines.',
      author: {
        name: 'DeletedUser',
        email: 'deleted@example.com',
        avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
      },
      post: {
        id: '105',
        title: 'Building a Community Around Your Product',
        slug: 'building-community-product',
      },
      createdAt: '2023-06-05T17:33:09Z',
      status: 'trash',
    },
  ];

  const filteredComments = comments.filter(comment => 
    comment.status === activeTab && 
    (searchQuery === '' || 
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedComments(filteredComments.map(comment => comment.id));
    } else {
      setSelectedComments([]);
    }
  };

  const handleSelectComment = (commentId: string) => {
    if (selectedComments.includes(commentId)) {
      setSelectedComments(selectedComments.filter(id => id !== commentId));
    } else {
      setSelectedComments([...selectedComments, commentId]);
    }
  };

  const handleApprove = (commentId: string) => {
    // In a real app, you'd call an API here
    console.log(`Approving comment: ${commentId}`);
    setActionDropdown(null);
  };

  const handleMarkAsSpam = (commentId: string) => {
    // In a real app, you'd call an API here
    console.log(`Marking comment as spam: ${commentId}`);
    setActionDropdown(null);
  };

  const handleTrash = (commentId: string) => {
    // In a real app, you'd call an API here
    console.log(`Trashing comment: ${commentId}`);
    setActionDropdown(null);
  };

  const handleBulkAction = (action: 'approve' | 'spam' | 'trash') => {
    // In a real app, you'd call an API here
    console.log(`Bulk action ${action} on comments:`, selectedComments);
    setSelectedComments([]);
  };

  const toggleActionDropdown = (commentId: string) => {
    if (actionDropdown === commentId) {
      setActionDropdown(null);
    } else {
      setActionDropdown(commentId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comment Moderation</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and respond to comments across your blog</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-3 border-b-2 font-medium text-sm px-1 ${
              activeTab === 'pending'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Pending
            <span className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full px-2 py-0.5 text-xs">
              {comments.filter(c => c.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`py-3 border-b-2 font-medium text-sm px-1 ${
              activeTab === 'approved'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Approved
            <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full px-2 py-0.5 text-xs">
              {comments.filter(c => c.status === 'approved').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('spam')}
            className={`py-3 border-b-2 font-medium text-sm px-1 ${
              activeTab === 'spam'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Spam
            <span className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full px-2 py-0.5 text-xs">
              {comments.filter(c => c.status === 'spam').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`py-3 border-b-2 font-medium text-sm px-1 ${
              activeTab === 'trash'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Trash
            <span className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
              {comments.filter(c => c.status === 'trash').length}
            </span>
          </button>
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          {selectedComments.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve ({selectedComments.length})
              </button>
              <button
                onClick={() => handleBulkAction('spam')}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm flex items-center"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Mark as Spam
              </button>
              <button
                onClick={() => handleBulkAction('trash')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Trash
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  onChange={handleSelectAll}
                  checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Comment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                In Response To
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <motion.tr 
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => handleSelectComment(comment.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-200">
                      {comment.content.length > 100 
                        ? `${comment.content.substring(0, 100)}...` 
                        : comment.content
                      }
                    </div>
                    {comment.replies && (
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                        {comment.replies} replies
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          className="h-8 w-8 rounded-full" 
                          src={comment.author.avatar} 
                          alt={comment.author.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{comment.author.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{comment.author.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={`/blog/${comment.post.slug}`} 
                      className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {comment.post.title}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative flex justify-end">
                      {activeTab === 'pending' && (
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleActionDropdown(comment.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {actionDropdown === comment.id && (
                        <div className="absolute right-0 top-8 z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            <button
                              onClick={() => handleApprove(comment.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              <Check className="w-4 h-4 mr-3 text-green-500" />
                              Approve
                            </button>
                            <a
                              href={`/blog/${comment.post.slug}#comment-${comment.id}`}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="w-4 h-4 mr-3 text-blue-500" />
                              View on Site
                            </a>
                            <button
                              onClick={() => console.log('Edit comment')}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              <Edit className="w-4 h-4 mr-3 text-gray-500" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleMarkAsSpam(comment.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              <AlertTriangle className="w-4 h-4 mr-3 text-yellow-500" />
                              Mark as Spam
                            </button>
                            <button
                              onClick={() => handleTrash(comment.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              <Trash2 className="w-4 h-4 mr-3 text-red-500" />
                              Trash
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-base">No comments found</p>
                  <p className="text-sm">
                    {searchQuery 
                      ? 'Try a different search term or filter' 
                      : `There are no ${activeTab} comments at the moment`
                    }
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredComments.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{filteredComments.length}</span> of{' '}
            <span className="font-medium">{filteredComments.length}</span> comments
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={true} // This would normally check if we're on the last page
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsManagePage; 