import React from 'react';
import { Helmet } from 'react-helmet-async';
import { authors } from '../data/posts';
import NewsletterForm from '../components/blog/NewsletterForm';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | TechBlog</title>
        <meta name="description" content="Learn more about the team behind TechBlog and our mission." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">About TechBlog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A modern tech blog focused on web development, AI, DevOps, and everything in between.
            Our mission is to share knowledge, inspire innovation, and build a community of tech enthusiasts.
          </p>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  TechBlog was founded in 2023 with a simple mission: to create a platform where technology enthusiasts could share knowledge, learn from each other, and stay updated on the latest trends and innovations in the tech world.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  What started as a small personal blog has grown into a community-driven platform with contributors from around the globe, covering a wide range of topics from web development and AI to DevOps and system architecture.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  We believe in the power of open knowledge sharing and continuous learning. Our goal is to make complex technical concepts accessible to everyone, regardless of their background or experience level.
                </p>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
                  alt="Team collaboration"
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author) => (
              <div key={author.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{author.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{author.bio}</p>
                  <div className="flex space-x-4">
                    {author.twitter && (
                      <a
                        href={`https://twitter.com/${author.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        aria-label={`${author.name}'s Twitter`}
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {author.github && (
                      <a
                        href={`https://github.com/${author.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        aria-label={`${author.name}'s GitHub`}
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {author.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${author.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
                        aria-label={`${author.name}'s LinkedIn`}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Knowledge Sharing</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We believe in the power of sharing knowledge freely and openly. Our contributors are passionate about teaching others and helping them grow in their technical journey.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quality Content</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We are committed to creating high-quality, well-researched, and practical content that provides real value to our readers. We focus on clarity, accuracy, and relevance.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Community</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We foster an inclusive and supportive community where everyone feels welcome to learn, contribute, and grow together. We value diverse perspectives and experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Have questions, feedback, or want to contribute to TechBlog? We'd love to hear from you! Fill out the form or reach out to us directly through our social media channels.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">contact@techblog.com</span>
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
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

export default AboutPage;