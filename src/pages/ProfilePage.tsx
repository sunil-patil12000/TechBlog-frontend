import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {user ? (
          <>
            <h2 className="text-xl mb-4">Welcome, {user.name}</h2>
            <div className="space-y-4">
              <p><strong>Email:</strong> {user.email}</p>
              {/* Add more profile information as needed */}
            </div>
          </>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
