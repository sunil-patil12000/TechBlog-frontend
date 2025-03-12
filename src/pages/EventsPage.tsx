import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ChevronRight, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  image: string;
  category: string;
  attendees: number;
  slug: string;
  featured?: boolean;
  popular?: boolean;
}

interface EventsPageProps {
  filter?: 'latest' | 'featured' | 'popular';
}

const EventsPage: React.FC<EventsPageProps> = ({ filter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock data for events
  const events: Event[] = [
    {
      id: '1',
      title: 'Web Development Workshop',
      description: 'Learn the fundamentals of modern web development with React, Node.js, and more.',
      date: '2023-08-15',
      time: '10:00 AM - 3:00 PM',
      location: 'Tech Hub Conference Center',
      address: '123 Innovation Drive, San Francisco, CA',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      category: 'Workshop',
      attendees: 75,
      slug: 'web-development-workshop-2023',
      featured: true,
      popular: true
    },
    {
      id: '2',
      title: 'Machine Learning Conference',
      description: 'Explore the latest advances in AI and machine learning at our annual conference.',
      date: '2023-09-20',
      time: '9:00 AM - 6:00 PM',
      location: 'Grand City Convention Center',
      address: '500 Main Street, New York, NY',
      image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      category: 'Conference',
      attendees: 450,
      slug: 'machine-learning-conference-2023',
      featured: true,
      popular: true
    },
    {
      id: '3',
      title: 'Design Systems Meetup',
      description: 'Join fellow designers to discuss strategies for creating and maintaining design systems.',
      date: '2023-07-28',
      time: '6:30 PM - 8:30 PM',
      location: 'Creative Workspace',
      address: '87 Design Avenue, Austin, TX',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      category: 'Meetup',
      attendees: 35,
      slug: 'design-systems-meetup',
      featured: true,
      popular: true
    },
    {
      id: '4',
      title: 'Mobile Development Hackathon',
      description: 'Build a mobile app in 48 hours and compete for prizes at our annual hackathon.',
      date: '2023-10-05',
      time: '9:00 AM (48 hours)',
      location: 'Innovation Campus',
      address: '200 Technology Parkway, Boston, MA',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      category: 'Hackathon',
      attendees: 120,
      slug: 'mobile-dev-hackathon-2023',
      featured: true,
      popular: true
    },
    {
      id: '5',
      title: 'Cybersecurity Training',
      description: 'Intensive training on protecting systems and networks from digital attacks.',
      date: '2023-08-28',
      time: '10:00 AM - 4:00 PM',
      location: 'Security Institute',
      address: '750 Encryption Blvd, Washington, DC',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      category: 'Training',
      attendees: 60,
      slug: 'cybersecurity-training-2023',
      featured: true,
      popular: true
    },
    {
      id: '6',
      title: 'Women in Tech Networking',
      description: 'Network with women professionals in technology fields and discuss industry challenges and opportunities.',
      date: '2023-09-12',
      time: '5:30 PM - 8:00 PM',
      location: 'Cityview Lounge',
      address: '42 Skyline Drive, Seattle, WA',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      category: 'Networking',
      attendees: 85,
      slug: 'women-in-tech-networking-2023',
      featured: true,
      popular: true
    }
  ];

  // Get all unique categories from events
  const categories = ['all', ...Array.from(new Set(events.map(event => event.category)))];

  // Get filtered events
  const filteredEvents = events.filter(event => {
    // Apply category filter
    if (selectedCategory !== 'all' && event.category !== selectedCategory) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && 
        !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply filter prop
    if (filter === 'featured' && !event.featured) {
      return false;
    }
    
    if (filter === 'popular' && !event.popular) {
      return false;
    }
    
    return true;
  });
  
  // Sort events based on filter
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filter === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get page title based on filter
  const getPageTitle = () => {
    if (filter === 'featured') return 'Featured Tech Events';
    if (filter === 'popular') return 'Popular Tech Events';
    if (filter === 'latest') return 'Latest Tech Events';
    return 'Upcoming Tech Events';
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
      <Helmet>
        <title>{getPageTitle()} | TechPulse</title>
        <meta name="description" content="Browse and register for upcoming technology events, conferences, workshops, and meetups." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{getPageTitle()}</h1>
            <p className="text-xl text-indigo-200 mb-8">
              Discover and connect with the best technology events from around the world
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-300" />
              </div>
              <input
                type="text"
                placeholder="Search events by title, description, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg border-none focus:ring-2 focus:ring-white/50 bg-indigo-700/50 text-white placeholder-indigo-200"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="mr-4 text-sm font-medium text-gray-500 dark:text-gray-400">Filter by:</span>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 text-sm whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Event Image */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {event.category}
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  {/* Event Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attendees} attending
                    </div>
                  </div>
                  
                  <Link 
                    to={`/events/${event.slug}`}
                    className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">No events found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any events matching your search. Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="container mx-auto px-4 mt-16">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Want to host your own event?</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            If you're interested in organizing a tech event, workshop, or meetup, we'd love to collaborate with you and help promote it to our community.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 