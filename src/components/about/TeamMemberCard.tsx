import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { MediumIcon } from '../icons/MediumIcon';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  name, 
  role, 
  bio, 
  avatar, 
  social 
}) => {
  const socialIcons = {
    twitter: Twitter,
    linkedin: Linkedin,
    github: Github,
    email: Mail,
    medium: MediumIcon,
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-start space-x-4">
        <img 
          src={avatar} 
          alt={name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 dark:border-gray-700"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-indigo-600 dark:text-indigo-400 text-sm mb-2">{role}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{bio}</p>
          <div className="flex space-x-3 mt-4">
            {Object.entries(social).map(([platform, url]) => {
              const Icon = socialIcons[platform as keyof typeof socialIcons];
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard; 