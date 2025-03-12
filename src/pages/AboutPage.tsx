import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import TeamMemberCard from '../components/about/TeamMemberCard';
import { Globe, Mail, Phone, Users, BookOpen, Rocket, Newspaper, Calendar } from 'lucide-react';
import { getUnsplashImage } from '../utils/unsplash';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'Founder & Lead Developer',
      bio: 'Full-stack developer with 10+ years of experience in building scalable web applications.',
      avatar: getUnsplashImage('developer portrait', {
        width: 200,
        height: 200
      }),
      social: {
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    },
    {
      name: 'Sarah Johnson',
      role: 'Technical Writer',
      bio: 'Passionate about making complex technical concepts accessible to everyone.',
      avatar: getUnsplashImage('developer portrait', {
        width: 200,
        height: 200
      }),
      social: {
        twitter: 'https://twitter.com',
        medium: 'https://medium.com'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>About Us - TechBlog</title>
        <meta name="description" content="Learn about TechBlog's mission, team, and values in the tech community." />
      </Helmet>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 text-center"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Tracking Technology's Pulse
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Dedicated to bringing you real-time updates from the ever-evolving world of technology
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Newspaper className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Daily Updates</h3>
                <p className="text-gray-600 dark:text-gray-400">Fresh tech news coverage</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Global Events</h3>
                <p className="text-gray-600 dark:text-gray-400">Tracked worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamMemberCard 
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                avatar={member.avatar}
                social={member.social}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <Globe className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-400">Making tech education available to everyone</p>
              </div>
              <div className="p-6">
                <Mail className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                <p className="text-gray-600 dark:text-gray-400">Peer-reviewed, expert-curated content</p>
              </div>
              <div className="p-6">
                <Phone className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600 dark:text-gray-400">Building together with our readers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;