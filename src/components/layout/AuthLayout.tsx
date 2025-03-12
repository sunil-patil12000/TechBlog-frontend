import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-header">
        <Link to="/" className="auth-logo">
          My Blog
        </Link>
      </div>
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
