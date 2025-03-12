import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

// Use the same Event interface from EventsPage
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
}

const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, fetch the event data from an API
    // For now, simulate API call with mock data and timeout
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in a real app, you'd fetch this from an API
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Web Development Workshop',
            description: 'Learn the fundamentals of modern web development with React, Node.js, and more. This full-day workshop will cover everything from setting up your development environment to deploying your first full-stack application.\n\nYou\'ll get hands-on experience building a real application, with personalized guidance from experienced instructors. By the end of the day, you\'ll have a solid foundation in web development concepts and practical skills you can apply to your own projects.\n\nTopics covered include:\n- Modern JavaScript fundamentals\n- React component architecture\n- State management strategies\n- RESTful API integration\n- Database basics\n- Deployment workflows',
            date: '2023-08-15',
            time: '10:00 AM - 3:00 PM',
            location: 'Tech Hub Conference Center',
            address: '123 Innovation Drive, San Francisco, CA',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            category: 'Workshop',
            attendees: 75,
            slug: 'web-development-workshop-2023'
          },
          {
            id: '2',
            title: 'Machine Learning Conference',
            description: 'Explore the latest advances in AI and machine learning at our annual conference. Join industry leaders, researchers, and practitioners for a day of keynotes, panel discussions, and networking opportunities.\n\nOur expert speakers will share insights on cutting-edge technologies, practical applications, and the future of AI. Whether you\'re a seasoned machine learning engineer or just exploring the field, you\'ll find valuable content and connections.\n\nHighlights include:\n- Keynote presentation on large language models\n- Panel discussion on ethical AI development\n- Technical sessions on computer vision, NLP, and more\n- Hands-on workshops with popular ML frameworks\n- Networking opportunities with industry professionals',
            date: '2023-09-20',
            time: '9:00 AM - 6:00 PM',
            location: 'Grand City Convention Center',
            address: '500 Main Street, New York, NY',
            image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            category: 'Conference',
            attendees: 450,
            slug: 'machine-learning-conference-2023'
          },
          {
            id: '3',
            title: 'Design Systems Meetup',
            description: 'Join fellow designers to discuss strategies for creating and maintaining design systems. This informal meetup is perfect for designers, developers, and product managers working with design systems or interested in implementing one.\n\nWe\'ll have short presentations from local design leaders followed by open discussion and Q&A. Come prepared to share your experiences, challenges, and solutions with the community.\n\nAgenda:\n- Welcome and introductions\n- Lightning talks from local design leaders\n- Open discussion on scaling design systems\n- Networking and refreshments',
            date: '2023-07-28',
            time: '6:30 PM - 8:30 PM',
            location: 'Creative Workspace',
            address: '87 Design Avenue, Austin, TX',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
            category: 'Meetup',
            attendees: 35,
            slug: 'design-systems-meetup'
          },
          {
            id: '4',
            title: 'Mobile Development Hackathon',
            description: 'Build a mobile app in 48 hours and compete for prizes at our annual hackathon. This event challenges developers, designers, and product managers to form teams and create innovative mobile solutions for real-world problems.\n\nBeginners and experts alike are welcome! We provide mentors, food, and all the caffeine you need to turn your ideas into working prototypes. Present your creation to our panel of judges for a chance to win cash prizes and development resources.\n\nWhat to expect:\n- Team formation and ideation sessions\n- 48 hours of intense development\n- Mentorship from industry professionals\n- Judging and awards ceremony\n- Networking with tech recruiters',
            date: '2023-10-05',
            time: '9:00 AM (48 hours)',
            location: 'Innovation Campus',
            address: '200 Technology Parkway, Boston, MA',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            category: 'Hackathon',
            attendees: 120,
            slug: 'mobile-dev-hackathon-2023'
          },
          {
            id: '5',
            title: 'Cybersecurity Training',
            description: 'Intensive training on protecting systems and networks from digital attacks. This one-day workshop will cover essential cybersecurity concepts and practical techniques for identifying and mitigating common vulnerabilities.\n\nLed by experienced security professionals, this training is ideal for IT professionals, developers, and anyone responsible for managing digital systems. You\'ll learn through a combination of presentations, demonstrations, and hands-on exercises.\n\nTopics include:\n- Security fundamentals and threat modeling\n- Common attack vectors and defense strategies\n- Secure coding practices\n- Network security essentials\n- Security testing methodology\n- Incident response procedures',
            date: '2023-08-28',
            time: '10:00 AM - 4:00 PM',
            location: 'Security Institute',
            address: '750 Encryption Blvd, Washington, DC',
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            category: 'Training',
            attendees: 60,
            slug: 'cybersecurity-training-2023'
          },
          {
            id: '6',
            title: 'Women in Tech Networking',
            description: 'Network with women professionals in technology fields and discuss industry challenges and opportunities. This evening event brings together women at all stages of their tech careers for meaningful connections and conversations.\n\nOur featured speakers will share their career journeys and insights, followed by structured networking activities designed to help you build valuable professional relationships. All genders are welcome to attend as allies.\n\nEvent highlights:\n- Keynote from a senior tech leader\n- Panel discussion on navigating tech careers\n- Structured networking activities\n- Refreshments and light appetizers\n- Optional mentorship matching',
            date: '2023-09-12',
            time: '5:30 PM - 8:00 PM',
            location: 'Cityview Lounge',
            address: '42 Skyline Drive, Seattle, WA',
            image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            category: 'Networking',
            attendees: 85,
            slug: 'women-in-tech-networking-2023'
          }
        ];
        
        // Find the event that matches the slug
        const foundEvent = mockEvents.find(e => e.slug === slug);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle share button click
  const handleShare = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => console.error('Could not copy text: ', err));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Event Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/events" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16">
      <Helmet>
        <title>{event.title} | Event Details</title>
        <meta name="description" content={event.description.substring(0, 160)} />
      </Helmet>
      
      {/* Hero Section with Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <div className="container mx-auto px-4 py-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white mb-4">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center text-gray-200 gap-4 md:gap-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {event.time}
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {event.attendees} attending
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <Link 
                  to="/events" 
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </Link>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About This Event</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {event.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <hr className="my-8 border-gray-200 dark:border-gray-700" />
              
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Location</h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">{event.location}</p>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{event.address}</p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-3 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                      >
                        View on Google Maps
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-6"
            >
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Event Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Date</p>
                    <p className="text-gray-600 dark:text-gray-300">{formatDate(event.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Time</p>
                    <p className="text-gray-600 dark:text-gray-300">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                    <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                    <p className="text-gray-600 dark:text-gray-300">{event.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Attendees</p>
                    <p className="text-gray-600 dark:text-gray-300">{event.attendees} people attending</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">
                Register Now
              </button>
              
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                Limited spots available. Register soon!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 