import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutUsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | BlogFolio</title>
        <meta name="description" content="Learn more about our mission, vision, and team" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              At BlogFolio, we're dedicated to providing insightful, educational content that empowers 
              developers, designers, and technology enthusiasts. Our mission is to share knowledge, 
              foster a community of lifelong learners, and help professionals stay ahead in the 
              rapidly evolving tech landscape.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Founded in 2023, BlogFolio began as a small personal blog and has grown into a 
              comprehensive platform for technology education and insights. What started as a passion 
              project has evolved into a valuable resource for thousands of monthly readers.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Our journey has been guided by a simple principle: complex topics can be made accessible 
              through clear, well-crafted content. We continue to uphold this principle in everything we publish.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <img 
                    src="https://via.placeholder.com/300" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Jane Doe</h3>
                <p className="text-indigo-600 dark:text-indigo-400">Founder & Editor-in-Chief</p>
              </div>
              
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <img 
                    src="https://via.placeholder.com/300" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">John Smith</h3>
                <p className="text-indigo-600 dark:text-indigo-400">Senior Developer & Writer</p>
              </div>
              
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <img 
                    src="https://via.placeholder.com/300" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Emily Johnson</h3>
                <p className="text-indigo-600 dark:text-indigo-400">Design Lead & Content Creator</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;
