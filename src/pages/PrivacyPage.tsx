import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Privacy Policy - TechBlog</title>
        <meta name="description" content="Read TechBlog's privacy policy to understand how we handle your data." />
      </Helmet>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mb-6">
                <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose dark:prose-invert">
              <h2>Introduction</h2>
              <p>
                At TechBlog, we are committed to protecting your privacy. This policy outlines our practices
                regarding data collection, use, and disclosure when you use our service.
              </p>

              <h2>Data We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>Personal identification information (name, email address)</li>
                <li>Usage data and analytics</li>
                <li>Cookies and tracking technologies</li>
              </ul>

              <h2>How We Use Your Data</h2>
              <p>Your data helps us to:</p>
              <ul>
                <li>Provide and maintain our service</li>
                <li>Improve user experience</li>
                <li>Communicate with users</li>
                <li>Analyze service usage</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data, including encryption
                and access controls. However, no method of electronic transmission is 100% secure.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                We may use third-party services that collect information to monitor and analyze service usage.
                These third parties have access to your data only to perform specific tasks on our behalf.
              </p>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Request correction or deletion</li>
                <li>Object to processing</li>
                <li>Request data portability</li>
              </ul>

              <h2>Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy periodically. We will notify you of changes by posting
                the new policy on this page.
              </p>

              <h2>Contact Us</h2>
              <p>
                For questions about this policy, contact us at{' '}
                <a href="mailto:privacy@techblog.com" className="text-indigo-600 dark:text-indigo-400">
                  privacy@techblog.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default PrivacyPage; 