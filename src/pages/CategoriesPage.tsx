import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { postAPI } from '../services/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Assuming you have a categories endpoint
        const response = await postAPI.getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback for demo purposes
        setCategories([
          { id: '1', name: 'Technology', slug: 'technology', postCount: 12 },
          { id: '2', name: 'Programming', slug: 'programming', postCount: 8 },
          { id: '3', name: 'Design', slug: 'design', postCount: 5 },
          { id: '4', name: 'Business', slug: 'business', postCount: 3 },
          { id: '5', name: 'Personal Development', slug: 'personal-development', postCount: 7 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>Categories | BlogFolio</title>
        <meta name="description" content="Browse articles by category" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Categories</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md h-40"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <Link 
                key={category.id}
                to={`/categories/${category.slug}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-3">{category.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{category.postCount} posts</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesPage;
