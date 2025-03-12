import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Filter,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Mock data for events
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  category: string;
  image?: string;
  status: 'published' | 'draft' | 'archived';
  attendeeCount: number;
  createdAt: string;
  updatedAt: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Annual technology conference featuring the latest innovations',
    date: '2024-08-15',
    time: '09:00-18:00',
    location: 'Tech Center',
    address: '123 Innovation Ave, Tech City',
    category: 'Conference',
    image: '/images/events/tech-conference.jpg',
    status: 'published',
    attendeeCount: 250,
    createdAt: '2023-12-10T14:30:00Z',
    updatedAt: '2024-02-15T09:20:00Z'
  },
  {
    id: '2',
    title: 'Web Development Workshop',
    description: 'Hands-on workshop for modern web development techniques',
    date: '2024-07-20',
    time: '10:00-16:00',
    location: 'Code Academy',
    address: '456 Learning Blvd, Developer Town',
    category: 'Workshop',
    image: '/images/events/web-dev-workshop.jpg',
    status: 'published',
    attendeeCount: 50,
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-03-01T11:30:00Z'
  },
  {
    id: '3',
    title: 'AI Ethics Panel Discussion',
    description: 'Expert discussion on ethical considerations in artificial intelligence',
    date: '2024-09-05',
    time: '14:00-16:30',
    location: 'Future Institute',
    address: '789 Innovation Way, Smart City',
    category: 'Panel',
    image: '/images/events/ai-ethics.jpg',
    status: 'draft',
    attendeeCount: 0,
    createdAt: '2024-04-10T08:15:00Z',
    updatedAt: '2024-04-10T08:15:00Z'
  },
  {
    id: '4',
    title: 'Blockchain Hackathon',
    description: '48-hour hackathon focused on blockchain applications',
    date: '2024-10-10',
    time: '09:00-09:00 (+2 days)',
    location: 'Crypto Hub',
    address: '101 Blockchain Street, Crypto Valley',
    category: 'Hackathon',
    image: '/images/events/blockchain-hackathon.jpg',
    status: 'published',
    attendeeCount: 120,
    createdAt: '2024-02-20T16:05:00Z',
    updatedAt: '2024-03-15T14:10:00Z'
  },
  {
    id: '5',
    title: 'UX Design Masterclass',
    description: 'Advanced techniques for creating exceptional user experiences',
    date: '2024-06-30',
    time: '13:00-17:00',
    location: 'Design Studio',
    address: '202 Creative Lane, Designer District',
    category: 'Workshop',
    image: '/images/events/ux-design.jpg',
    status: 'archived',
    attendeeCount: 35,
    createdAt: '2023-11-05T09:30:00Z',
    updatedAt: '2024-01-20T13:15:00Z'
  }
];

const EventsManagePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // Fetch events
  useEffect(() => {
    // Simulate API call
    const fetchEvents = () => {
      setIsLoading(true);
      setTimeout(() => {
        setEvents(mockEvents);
        setIsLoading(false);
      }, 800);
    };
    
    fetchEvents();
  }, []);

  // Get unique categories from events
  const categories = [...new Set(events.map(event => event.category))];

  // Filter events based on search term, status, and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? event.status === selectedStatus : true;
    const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle delete confirmation
  const confirmDelete = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  // Handle actual deletion
  const handleDelete = () => {
    if (eventToDelete) {
      // In a real app, you would call an API endpoint here
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete.id));
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Events | Admin Dashboard</title>
      </Helmet>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Events</h1>
            <Link
              to="/admin/events/new"
              className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search */}
                <div className="relative w-full lg:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Button */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {(selectedStatus || selectedCategory) && (
                      <span className="ml-1 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-1.5 py-0.5 rounded-full">
                        {(selectedStatus ? 1 : 0) + (selectedCategory ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter Options */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedStatus(null)}
                            className={`px-3 py-1 text-sm rounded-full ${
                              selectedStatus === null
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setSelectedStatus('published')}
                            className={`px-3 py-1 text-sm rounded-full ${
                              selectedStatus === 'published'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Published
                          </button>
                          <button
                            onClick={() => setSelectedStatus('draft')}
                            className={`px-3 py-1 text-sm rounded-full ${
                              selectedStatus === 'draft'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Draft
                          </button>
                          <button
                            onClick={() => setSelectedStatus('archived')}
                            className={`px-3 py-1 text-sm rounded-full ${
                              selectedStatus === 'archived'
                                ? 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Archived
                          </button>
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1 text-sm rounded-full ${
                              selectedCategory === null
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            All
                          </button>
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className={`px-3 py-1 text-sm rounded-full ${
                                selectedCategory === category
                                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Events Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="py-12 flex justify-center items-center">
                  <div className="spinner"></div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Event
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date/Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Attendees
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {event.image ? (
                                <img 
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={event.image}
                                  alt={event.title}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {event.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatDate(event.date)}
                            </div>
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {event.time}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                            <div className="text-sm text-gray-900 dark:text-white">
                              {event.location}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 ml-5">
                            {event.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(event.status)}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                            <div className="text-sm text-gray-900 dark:text-white">
                              {event.attendeeCount}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              onClick={() => {}}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              onClick={() => confirmDelete(event)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center">
                  <div className="flex justify-center">
                    <AlertCircle className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm || selectedStatus || selectedCategory
                      ? 'Try adjusting your filters'
                      : 'Get started by creating a new event'}
                  </p>
                  {!searchTerm && !selectedStatus && !selectedCategory && (
                    <div className="mt-6">
                      <Link
                        to="/admin/events/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md m-3 z-10 relative"
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Event</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventsManagePage; 