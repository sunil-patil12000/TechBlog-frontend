import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  onShare?: (platform: string) => void;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  description = '',
  className = '',
  onShare
}) => {
  // Use the current URL if none provided
  const shareUrl = url || window.location.href;
  
  const handleShare = (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${shareUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
    
    if (shareLink && platform !== 'copy') {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
    
    // Call the onShare callback if provided
    if (onShare) {
      onShare(platform);
    }
  };
  
  return (
    <div className={`flex space-x-2 ${className}`}>
      <button 
        className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
        onClick={() => handleShare('facebook')}
        aria-label="Share on Facebook"
      >
        <Facebook className="w-5 h-5" />
      </button>
      
      <button 
        className="p-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50"
        onClick={() => handleShare('twitter')}
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </button>
      
      <button 
        className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
        onClick={() => handleShare('linkedin')}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </button>
      
      <button 
        className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
        onClick={() => handleShare('email')}
        aria-label="Share via Email"
      >
        <Mail className="w-5 h-5" />
      </button>
      
      <button 
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        onClick={() => handleShare('copy')}
        aria-label="Copy Link"
      >
        <LinkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SocialShareButtons; 