import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle, Check, X } from 'lucide-react';
// Assuming we have a tagsAPI similar to other APIs in the project
// import { tagsAPI } from '../../api';

// Define Tag interface
interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

const TagsManagePage: React.FC = () => {
  // State for tags data
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for forms
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);
  
  // Form values
  const [formValues, setFormValues] = useState({
    name: '',
    slug: '',
    description: ''
  });
  
  // State for success/error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Fetch tags from API
  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Actual API call will replace this
      // const response = await tagsAPI.getTags();
      // setTags(response.data);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 800));
      setTags(generateMockTags());
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setError('Failed to load tags. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate mock data for development
  const generateMockTags = (): Tag[] => {
    return [
      { id: '1', name: 'JavaScript', slug: 'javascript', description: 'Posts about JavaScript language', postCount: 24 },
      { id: '2', name: 'React', slug: 'react', description: 'React framework posts', postCount: 18 },
      { id: '3', name: 'CSS', slug: 'css', description: 'Styling and CSS posts', postCount: 15 },
      { id: '4', name: 'TypeScript', slug: 'typescript', description: 'TypeScript language posts', postCount: 12 },
      { id: '5', name: 'Node.js', slug: 'nodejs', description: 'Server-side JavaScript', postCount: 10 },
      { id: '6', name: 'GraphQL', slug: 'graphql', description: 'API query language', postCount: 7 },
      { id: '7', name: 'NextJS', slug: 'nextjs', description: 'Next.js framework posts', postCount: 9 },
      { id: '8', name: 'Performance', slug: 'performance', description: 'Web performance optimization', postCount: 6 },
    ];
  };
  
  // Handle add tag
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form
    if (!formValues.name.trim()) {
      setFormError('Tag name is required');
      return;
    }
    
    try {
      const slug = formValues.slug.trim() || formValues.name.toLowerCase().replace(/\s+/g, '-');
      
      // Actual API call will replace this
      // const response = await tagsAPI.createTag({
      //   name: formValues.name.trim(),
      //   slug,
      //   description: formValues.description.trim()
      // });
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTag: Tag = {
        id: Date.now().toString(),
        name: formValues.name.trim(),
        slug,
        description: formValues.description.trim(),
        postCount: 0
      };
      
      setTags(prevTags => [newTag, ...prevTags]);
      setFormValues({ name: '', slug: '', description: '' });
      setShowAddForm(false);
      setSuccessMessage('Tag added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to add tag:', err);
      setFormError('Failed to add tag. Please try again.');
    }
  };
  
  // Handle edit tag
  const handleEditTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!currentTag) return;
    
    // Validate form
    if (!formValues.name.trim()) {
      setFormError('Tag name is required');
      return;
    }
    
    try {
      const slug = formValues.slug.trim() || formValues.name.toLowerCase().replace(/\s+/g, '-');
      
      // Actual API call will replace this
      // const response = await tagsAPI.updateTag(currentTag.id, {
      //   name: formValues.name.trim(),
      //   slug,
      //   description: formValues.description.trim()
      // });
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTags(prevTags => 
        prevTags.map(tag => 
          tag.id === currentTag.id
            ? {
                ...tag,
                name: formValues.name.trim(),
                slug,
                description: formValues.description.trim()
              }
            : tag
        )
      );
      
      setFormValues({ name: '', slug: '', description: '' });
      setCurrentTag(null);
      setShowEditForm(false);
      setSuccessMessage('Tag updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update tag:', err);
      setFormError('Failed to update tag. Please try again.');
    }
  };
  
  // Handle delete tag
  const handleDeleteTag = async (tagId: string) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;
    
    try {
      // Actual API call will replace this
      // await tagsAPI.deleteTag(tagId);
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
      setSuccessMessage('Tag deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to delete tag:', err);
      setError('Failed to delete tag. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Open edit form with tag data
  const openEditForm = (tag: Tag) => {
    setCurrentTag(tag);
    setFormValues({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || ''
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name if slug field is empty
    if (name === 'name' && !formValues.slug) {
      const generatedSlug = value.toLowerCase().replace(/\s+/g, '-');
      setFormValues(prev => ({ ...prev, slug: generatedSlug }));
    }
  };
  
  // Cancel form
  const cancelForm = () => {
    setFormValues({ name: '', slug: '', description: '' });
    setShowAddForm(false);
    setShowEditForm(false);
    setCurrentTag(null);
    setFormError(null);
  };
  
  // Filter tags based on search query
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Load tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Tags Management</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setShowEditForm(false);
            setFormValues({ name: '', slug: '', description: '' });
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add New Tag
        </button>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-start">
          <Check size={20} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-start">
          <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Add Tag Form */}
      {showAddForm && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Tag</h2>
            <button onClick={cancelForm} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          
          <form onSubmit={handleAddTag}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter tag name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug (auto-generated if empty)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formValues.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter slug"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter tag description"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Add Tag
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Edit Tag Form */}
      {showEditForm && currentTag && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Tag</h2>
            <button onClick={cancelForm} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          
          <form onSubmit={handleEditTag}>
            <div className="mb-4">
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag Name *
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter tag name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="edit-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                id="edit-slug"
                name="slug"
                value={formValues.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter slug"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter tag description"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Update Tag
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      {/* Tags List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading tags...</p>
        </div>
      ) : filteredTags.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
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
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {tag.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {tag.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {tag.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {tag.postCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditForm(tag)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'No tags match your search.' : 'No tags found. Add your first tag!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TagsManagePage; 