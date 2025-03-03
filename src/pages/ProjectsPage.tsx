import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Github, ExternalLink } from 'lucide-react';
import NewsletterForm from '../components/blog/NewsletterForm';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
}

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

const ProjectsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Projects | TechBlog</title>
        <meta name="description" content="Explore our open-source projects, tools, and tutorials." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Our Projects</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our open-source projects, tools, and tutorials. Feel free to use them in your own projects or contribute to their development.
          </p>
        </section>

        {/* Projects Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Github className="w-5 h-5 mr-1" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 mr-1" />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contribute Section */}
        <section className="mb-16">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Want to Contribute?</h2>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                We welcome contributions to our open-source projects. Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Fork the Repository</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Start by forking the repository on GitHub and cloning it to your local machine.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Make Your Changes</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Implement your changes, following the project's coding standards and guidelines.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Submit a Pull Request</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Push your changes and submit a pull request for review by the project maintainers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section>
          <NewsletterForm />
        </section>
      </div>
    </>
  );
};

export default ProjectsPage;