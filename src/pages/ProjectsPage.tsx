import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Github, ExternalLink, Search, Filter, ChevronDown } from 'lucide-react';
import NewsletterForm from '../components/blog/NewsletterForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types/blog';

// Define animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    } 
  }
};

const projectVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const ProjectsPage: React.FC = () => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract all unique tags from projects
  const allTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  ).sort();

  // Handle search and filter
  useEffect(() => {
    const results = projects.filter(project => {
      const matchesSearch = !searchTerm || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => project.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
    
    setFilteredProjects(results);
  }, [searchTerm, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  return (
    <>
      <Helmet>
        <title>Projects Portfolio | Modern Tech Blog</title>
        <meta name="description" content="Explore our collection of software projects, open source contributions, and technical demonstrations." />
        <meta property="og:title" content="Projects Portfolio | Modern Tech Blog" />
        <meta property="og:description" content="Explore our collection of software projects, open source contributions, and technical demonstrations." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Project Showcase
            </motion.h1>
            <motion.p 
              className="text-lg text-indigo-100 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Explore our latest projects, experiments, and open-source contributions.
              From web applications to developer tools, discover what we've been building.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="w-full md:w-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-80 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter button (mobile) */}
            <button 
              className="flex md:hidden items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Desktop filters */}
            <div className="hidden md:flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Filter by:</span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile filters (collapsible) */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden mt-4"
              >
                <div className="flex flex-wrap gap-2 pb-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-[50vh]">
        <div className="container mx-auto px-4">
          {filteredProjects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl text-gray-600 dark:text-gray-400">
                No projects found matching your criteria
              </h3>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTags([]);
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
};

// Project Card Component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <motion.div
      variants={projectVariants}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Project Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {project.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span 
              key={tag} 
              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              <Github size={16} />
              <span>Code</span>
            </a>
          )}
          
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Original projects data
const projects: Project[] = [
  {
    id: '1',
    title: 'React Component Library',
    description: 'A collection of reusable React components built with TypeScript and styled with Tailwind CSS. Includes buttons, forms, cards, modals, and more.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Component Library'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
  },
  {
    id: '2',
    title: 'AI Image Generator',
    description: 'A web application that uses machine learning to generate images based on text descriptions. Built with React, Node.js, and TensorFlow.js.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
    tags: ['AI', 'Machine Learning', 'React', 'Node.js', 'TensorFlow.js'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
  },
  {
    id: '3',
    title: 'DevOps Toolkit',
    description: 'A collection of scripts and tools for automating development and deployment workflows. Includes Docker configurations, CI/CD pipelines, and monitoring tools.',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
    tags: ['DevOps', 'Docker', 'CI/CD', 'Automation'],
    githubUrl: 'https://github.com',
  },
  {
    id: '4',
    title: 'E-commerce API',
    description: 'A RESTful API for e-commerce applications built with Node.js, Express, and MongoDB. Includes authentication, product management, cart functionality, and order processing.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
    tags: ['API', 'Node.js', 'Express', 'MongoDB', 'E-commerce'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
  },
  {
    id: '5',
    title: 'Real-time Chat Application',
    description: 'A real-time chat application built with React, Socket.io, and Node.js. Features include private messaging, group chats, file sharing, and message history.',
    image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
    tags: ['React', 'Socket.io', 'Node.js', 'Real-time'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
  },
  {
    id: '6',
    title: 'Personal Finance Tracker',
    description: 'A web application for tracking personal finances, including income, expenses, budgets, and financial goals. Built with React, Chart.js, and Firebase.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
    tags: ['React', 'Chart.js', 'Firebase', 'Finance'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
  },
];

export default ProjectsPage;