import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, XCircle, RefreshCw, CheckCircle, X } from 'lucide-react';
import { categoryAPI } from '../../services/api';
import { Helmet } from 'react-helmet-async';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

const CategoriesManagePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryAPI.getCategories();
      // Handle possible response formats
      const categoriesData = response?.data?.data || response?.data || [];
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      
      // For development: use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        setCategories(generateMockCategories(8));
      }
    } finally {
      setLoading(false);
    }
  };

  const generateMockCategories = (count: number): Category[] => {
    const categoryNames = [
      'Technology', 'Programming', 'Design', 'Business', 
      'Productivity', 'AI', 'Web Development', 'Mobile Apps'
    ];
    
    return Array.from({ length: Math.min(count, categoryNames.length) }).map((_, i) => ({
      id: `cat-${i + 1}`,
      name: categoryNames[i],
      slug: categoryNames[i].toLowerCase().replace(/\s+/g, '-'),
      description: `Articles about ${categoryNames[i].toLowerCase()}`,
      postCount: Math.floor(Math.random() * 30)
    }));
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormError(null);
    setFormSuccess(null);
    setShowAddForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setShowAddForm(false);
    setEditingCategory(category);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormDescription(category.description || '');
    setFormError(null);
    setFormSuccess(null);
  };

  const validateForm = (): boolean => {
    if (!formName.trim()) {
      setFormError('Category name is required');
      return false;
    }
    
    if (!formSlug.trim()) {
      // Auto-generate slug from name if not provided
      setFormSlug(formName.toLowerCase().replace(/\s+/g, '-'));
    }
    
    return true;
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    if (!validateForm()) return;
    
    try {
      const response = await categoryAPI.createCategory({
        name: formName,
        slug: formSlug,
        description: formDescription
      });
      
      const newCategory = response.data;
      setCategories(prev => [...prev, newCategory]);
      setShowAddForm(false);
      setFormSuccess('Category created successfully!');
      
      // Reset form
      setFormName('');
      setFormSlug('');
      setFormDescription('');
    } catch (err) {
      console.error('Error creating category:', err);
      setFormError('Failed to create category. Please try again.');
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    if (!editingCategory || !validateForm()) return;
    
    try {
      const response = await categoryAPI.updateCategory(editingCategory.id, {
        name: formName,
        slug: formSlug,
        description: formDescription
      });
      
      const updatedCategory = response.data;
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? updatedCategory : cat
      ));
      setEditingCategory(null);
      setFormSuccess('Category updated successfully!');
    } catch (err) {
      console.error('Error updating category:', err);
      setFormError('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This may affect posts using this category.')) {
      return;
    }
    
    try {
      await categoryAPI.deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Generate a slug from name
  const handleNameChange = (name: string) => {
    setFormName(name);
    // If the user hasn't manually edited the slug, or if it's empty, auto-generate it
    if (!formSlug.trim() || formSlug === editingCategory?.slug) {
      setFormSlug(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Categories | Admin Dashboard</title>
      </Helmet>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Categories</h1>
          <p className="text-gray-500 dark:text-gray-400">Organize your blog content with categories</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCategories}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button 
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle size={18} />
            Add Category
          </button>
        </div>
      </div>
      
      {/* Success Message */}
      {formSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
          <div className="flex">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <p className="text-green-700 dark:text-green-400">{formSuccess}</p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="flex">
            <XCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Category</h2>
            <button onClick={handleCancelForm} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            {formError && (
              <div className="text-red-600 text-sm">{formError}</div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500">
                The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
              </p>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Edit Category Form */}
      {editingCategory && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Edit Category: {editingCategory.name}</h2>
            <button onClick={handleCancelForm} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            {formError && (
              <div className="text-red-600 text-sm">{formError}</div>
            )}
            
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                type="text"
                id="edit-name"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug
              </label>
              <input
                type="text"
                id="edit-slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Update Category
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Categories Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading && categories.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No categories found</p>
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <PlusCircle size={18} className="mr-2" />
              Create your first category
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Posts
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {category.postCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagePage; 