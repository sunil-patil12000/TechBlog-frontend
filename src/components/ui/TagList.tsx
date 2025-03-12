import React from 'react';
import Tag from './Tag';

interface TagListProps {
  tags: string[];
  linkTags?: boolean;
  onTagClick?: (tag: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TagList: React.FC<TagListProps> = ({
  tags,
  linkTags = true,
  onTagClick,
  className = '',
  size = 'sm'
}) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          text={tag}
          link={linkTags && !onTagClick}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
          size={size}
        />
      ))}
    </div>
  );
};

export default TagList;
