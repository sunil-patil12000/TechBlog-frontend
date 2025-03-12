import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Avatar from '../shared/Avatar';
import { normalizeImageUrl } from '../../utils/contentProcessor';
import { DEFAULT_AVATAR } from '../../config/constants';

interface AuthorCardProps {
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  className?: string;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar 
          src={author.avatar ? normalizeImageUrl(author.avatar) : ''}
          alt={author.name}
          size="xl"
          className="border-2 border-gray-100 dark:border-gray-700"
          fallbackClassName="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
        />
        <div>
          <h3 className="text-xl font-bold mb-2">{author.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {author.bio || 'No author bio available.'}
          </p>
          <Link 
            to={`/author/${author.id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            View all posts <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard; 