import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import ArchivesPage from './pages/ArchivesPage';
import ProjectsPage from './pages/ProjectsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/utils/ScrollToTop';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import PostsManagePage from './pages/admin/PostsManagePage';
import CreatePostPage from './pages/admin/CreatePostPage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/archives" element={<ArchivesPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Dashboard Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/posts" element={
                    <ProtectedRoute adminOnly>
                      <PostsManagePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/posts/new" element={
                    <ProtectedRoute adminOnly>
                      <CreatePostPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;