import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Manage Posts"
          description="Create, edit, and delete blog posts"
          link="/admin/posts"
          icon="📝"
        />
        <DashboardCard
          title="Manage Users"
          description="View and manage user accounts"
          link="/admin/users"
          icon="👥"
        />
        <DashboardCard
          title="Site Statistics"
          description="View site analytics and metrics"
          link="/admin/stats"
          icon="📊"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, link, icon }) => (
  <Link to={link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </Link>
);

export default DashboardPage;
