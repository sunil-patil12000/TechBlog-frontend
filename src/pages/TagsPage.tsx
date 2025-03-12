import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Hash } from 'lucide-react';
import { mockPosts } from '../data/mockPosts';
import { Helmet } from 'react-helmet-async';

interface TagCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract tags from posts and count their occurrences
    setIsLoading(true);
    const tagCounts: Record<string, TagCount> = {};
    
    mockPosts.forEach(post => {
      post.tags?.forEach(tag => {
        if (tagCounts[tag.id]) {
          tagCounts[tag.id].count += 1;
        } else {
          tagCounts[tag.id] = {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            count: 1
          };
        }
      });
    });
    
    // Convert to array and sort by count (descending)
    const sortedTags = Object.values(tagCounts).sort((a, b) => b.count - a.count);
    
    setTags(sortedTags);
    setIsLoading(false);
  }, []);

  // Function to determine tag size based on count
  const getTagSize = (count: number) => {
    const maxCount = Math.max(...tags.map(t => t.count));
    const minCount = Math.min(...tags.map(t => t.count));
    const range = maxCount - minCount || 1;
    const ratio = (count - minCount) / range;
    
    // Scale between 0.8 and 2
    return 0.8 + (ratio * 1.2);
  };

  // Function to determine tag color based on count
  const getTagColor = (count: number): string => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    ];
    
    // Seed based on count to maintain consistency
    const seed = count % colors.length;
    return colors[seed];
  };

  return (
    <>
      <Helmet>
        <title>All Tags | BlogFolio</title>
        <meta name="description" content="Browse all topics and tags used across our articles" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Tags
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl">
            Browse all topics and tags used across our articles
          </p>
          <div className="h-1 w-20 bg-indigo-600 mt-4"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            {tags.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No tags found</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {tags.map(tag => (
                  <Link
                    key={tag.id}
                    to={`/tag/${tag.slug}`}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium
                      hover:shadow-md transition-all duration-200
                      ${getTagColor(tag.count)}
                    `}
                    style={{
                      fontSize: `${getTagSize(tag.count)}rem`
                    }}
                  >
                    <Hash className="w-3 h-3" />
                    {tag.name}
                    <span className="text-xs opacity-70 ml-1">({tag.count})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TagsPage;
