import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  initialLiked?: boolean;
  count?: number;
  onLike?: (isLiked: boolean) => void;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  initialLiked = false,
  count = 0,
  onLike,
  className = ''
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(count);
  
  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
    
    if (onLike) {
      onLike(newLikedState);
    }
  };
  
  return (
    <button 
      className={`flex items-center gap-1 ${
        isLiked 
          ? 'text-red-500 dark:text-red-400' 
          : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
      } ${className}`}
      onClick={handleLike}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      <span className="text-sm">{likeCount}</span>
    </button>
  );
};

export default LikeButton; 