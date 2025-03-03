import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface AuthorBioProps {
  name: string;
  bio: string;
  avatar: string;
  socialLinks?: SocialLink[];
}

const AuthorBio: React.FC<AuthorBioProps> = ({ name, bio, avatar, socialLinks = [] }) => {
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-indigo-900/30 rounded-xl p-8 backdrop-blur-sm shadow-lg border border-white/50 dark:border-gray-700/30">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <img 
          src={avatar} 
          alt={name} 
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-md ring-4 ring-white dark:ring-indigo-900/50"
        />
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{bio}</p>
          
          {socialLinks.length > 0 && (
            <div className="flex justify-center md:justify-start gap-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                >
                  {renderSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;