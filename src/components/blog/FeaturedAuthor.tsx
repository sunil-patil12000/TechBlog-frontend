import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Twitter, Linkedin } from 'lucide-react';
import { Github } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface FeaturedAuthorProps {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  articleCount: number;
  socialLinks: SocialLink[];
  expertise: string[];
}

const FeaturedAuthor: React.FC<FeaturedAuthorProps> = ({
  name,
  role,
  avatar,
  bio,
  articleCount,
  socialLinks,
  expertise
}) => {
  // Map social icons
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter size={16} />;
      case 'github':
        return <Github size={16} />;
      case 'linkedin':
        return <Linkedin size={16} />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
          />
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">{role}</p>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{bio}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {expertise.map((skill, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <FileText size={16} className="mr-2" />
          <span>{articleCount} articles published</span>
        </div>
        
        <div className="flex space-x-3 mt-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 
                         bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
              aria-label={`${name}'s ${link.platform}`}
            >
              {getSocialIcon(link.platform)}
            </a>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
        <Link 
          to={`/author/${name.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          View all articles
        </Link>
      </div>
    </motion.div>
  );
};

export default FeaturedAuthor; 