import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TableOfContents: React.FC<{ contentSelector?: string }> = ({ 
  contentSelector = '.prose' 
}) => {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const content = document.querySelector(contentSelector);
    const headings = Array.from(content?.querySelectorAll('h2, h3') || []) as HTMLHeadingElement[];
    setHeadings(headings);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -50% 0px' }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [contentSelector]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block sticky top-24 self-start w-64 ml-8 text-sm"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Contents</h3>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block py-1 px-2 rounded-md transition-colors ${
                  activeId === heading.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {heading.textContent}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TableOfContents;