import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedPage: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <Helmet>
        <title>Unauthorized Access | BlogFolio</title>
        <meta name="description" content="You don't have permission to access this page" />
      </Helmet>
      
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-xl mb-8">You don't have permission to access this page.</p>
        
        <div className="space-y-4">
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            Return to Home
          </Link>
          
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
        </div>
        
        {showDebug && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Authentication Debug Info</h2>
            <div className="space-y-2">
              <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</p>
              <p><strong>Role:</strong> {user?.role || 'No role'}</p>
              <p className="mt-4 text-amber-600">
                <strong>Note:</strong> If you're logged in but don't have admin access, you need to update your user role to 'admin' in the database.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedPage;
