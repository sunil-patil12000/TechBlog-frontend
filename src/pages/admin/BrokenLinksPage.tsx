import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { linkChecker, BrokenLinkReport } from '../../utils/linkChecker';
import { ArrowRight, RefreshCw, Trash2, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const BrokenLinksPage: React.FC = () => {
  const navigate = useNavigate();
  const [brokenLinks, setBrokenLinks] = useState<BrokenLinkReport[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [fixedLinks, setFixedLinks] = useState<string[]>([]);
  
  // Get broken links on component mount
  useEffect(() => {
    getBrokenLinks();
  }, []);
  
  // Get broken links from the link checker
  const getBrokenLinks = () => {
    const links = linkChecker.getBrokenLinks();
    setBrokenLinks(links);
  };
  
  // Start a scan for broken links
  const startScan = async () => {
    setIsChecking(true);
    setScanMessage('Scanning for broken links... This may take a while.');
    
    // Enable link checking
    linkChecker.setEnabled(true);
    
    // Reset previous scan data
    linkChecker.reset();
    
    // Get all links from the sitemap or crawler
    // This is a simplified example - in a real application, 
    // you would use a crawler or sitemap to get all links
    const routes = [
      '/',
      '/blog',
      '/about',
      '/contact',
      '/categories',
      '/tags',
      '/author/1',
      '/author/2',
      '/blog/sample-post-1',
      '/blog/sample-post-2',
    ];
    
    // Check each route for broken links
    for (const route of routes) {
      setScanMessage(`Scanning ${route}...`);
      
      try {
        // In a real application, you would render the page and extract links
        // This is a simplified version that just makes HEAD requests
        await linkChecker.checkUrl(route, 'Crawler');
        
        // Simulate finding links on the page
        if (route.includes('blog')) {
          await linkChecker.checkUrl(`${route}/comments`, route);
          await linkChecker.checkUrl(`${route}/related`, route);
        }
        
        if (route.includes('author')) {
          await linkChecker.checkUrl(`${route}/posts`, route);
          await linkChecker.checkUrl(`${route}/bio`, route);
        }
      } catch (error) {
        console.error(`Error scanning ${route}:`, error);
      }
    }
    
    // Update the broken links list
    getBrokenLinks();
    setIsChecking(false);
    setScanMessage(`Scan completed. Found ${linkChecker.getBrokenLinks().length} broken links.`);
  };
  
  // Mark a link as fixed
  const markAsFixed = (url: string) => {
    setFixedLinks(prev => [...prev, url]);
  };
  
  // Clear all broken links
  const clearBrokenLinks = () => {
    linkChecker.clearBrokenLinks();
    setBrokenLinks([]);
    setFixedLinks([]);
    setScanMessage('');
  };
  
  return (
    <div className="p-6">
      <Helmet>
        <title>Broken Links | Admin Dashboard</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Broken Links Checker</h1>
        
        <div className="flex gap-3">
          <button
            onClick={startScan}
            disabled={isChecking}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={isChecking ? 'animate-spin' : ''} />
            {isChecking ? 'Scanning...' : 'Start Scan'}
          </button>
          
          <button
            onClick={clearBrokenLinks}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            Clear Results
          </button>
        </div>
      </div>
      
      {scanMessage && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-lg mb-6">
          {scanMessage}
        </div>
      )}
      
      {brokenLinks.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  URL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Found On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {brokenLinks.map((link) => (
                <tr key={link.url} className={fixedLinks.includes(link.url) ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {link.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {fixedLinks.includes(link.url) ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle size={16} className="mr-1" />
                        Fixed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <AlertTriangle size={16} className="mr-1" />
                        {link.statusCode === 404 ? '404 Not Found' : link.message}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      {link.foundOn.map((page, i) => (
                        <span key={i} className="inline-flex items-center">
                          {page}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          navigate(link.url);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => markAsFixed(link.url)}
                        disabled={fixedLinks.includes(link.url)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No broken links found.{' '}
            {!scanMessage && 'Run a scan to check for broken links.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BrokenLinksPage; 