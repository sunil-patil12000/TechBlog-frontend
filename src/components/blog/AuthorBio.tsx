import React from 'react';
import { motion } from 'framer-motion';
import { Star, Share2, Twitter, Github, Linkedin } from 'lucide-react';
import type { Author } from '../../types/blog';
import Avatar from '../shared/Avatar';

interface AuthorBioProps {
  author: Author;
  articleCount: number;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ author, articleCount }) => {
  const socialIcons = {
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white 
        dark:from-gray-800 dark:to-gray-900 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative">
          <Avatar
            src={author.avatar}
            alt={author.name}
            size="xl"
            className="rounded-lg"
            fallbackClassName="rounded-lg"
          />
          {author.role === 'admin' && (
            <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-medium rounded-full
              bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
              Admin
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {author.name}
            </h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Star className="w-4 h-4 mr-1" />
              {author.followers} followers
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{author.bio}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {author.expertise.map(skill => (
              <span key={skill} className="px-2 py-1 text-xs rounded-full
                bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {author.socialLinks.map(({ platform, url }) => {
              const Icon = socialIcons[platform as keyof typeof socialIcons];
              return Icon ? (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
                    text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400
                    transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ) : null;
            })}
            <button
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Profile
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AuthorBio;