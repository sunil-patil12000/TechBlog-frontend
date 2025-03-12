import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, ThemeProvider, BlogProvider, FilterProvider, NotificationProvider } from './contexts';
import { NotificationsProvider } from './contexts/NotificationsContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import AuthLayout from './components/layout/AuthLayout';
import ScrollToTop from './components/utils/ScrollToTop';
import GlobalLoader from './components/ui/GlobalLoader';
import ErrorBoundary from './components/utils/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ArchivesPage from './pages/ArchivesPage';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AuthorPage from './pages/AuthorPage';
import CategoryPage from './pages/CategoryPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TagsPage from './pages/TagsPage';
import CategoriesPage from './pages/CategoriesPage';
import LatestPostsPage from './pages/LatestPostsPage';
import AboutUsPage from './pages/AboutUsPage';
import PostDetail from './pages/PostDetail';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import TestPage from './pages/TestPage';
import ImageDebugPage from './pages/ImageDebugPage';
import TestImagesPage from './pages/TestImagesPage';

// Admin pages and protected routes
import DashboardPage from './pages/admin/DashboardPage';
import PostsManagePage from './pages/admin/PostsManagePage';
import CreatePostPage from './pages/admin/CreatePostPage';
import TestUploadPage from './pages/admin/TestUploadPage';
import BrokenLinksPage from './pages/admin/BrokenLinksPage';
import CategoriesManagePage from './pages/admin/CategoriesManagePage';
import MediaLibraryPage from './pages/admin/MediaLibraryPage';
import CommentsManagePage from './pages/admin/CommentsManagePage';
import EventsManagePage from './pages/admin/EventsManagePage';
import CreateEventPage from './pages/admin/CreateEventPage';
import UsersManagePage from './pages/admin/UsersManagePage';
import CreateUserPage from './pages/admin/CreateUserPage';
import TagsManagePage from './pages/admin/TagsManagePage';
import ScheduledPostsPage from './pages/admin/ScheduledPostsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import PostAnalyticsPage from './pages/admin/PostAnalyticsPage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <BlogProvider>
              <FilterProvider>
                <NotificationProvider>
                  <NotificationsProvider>
                    <Suspense fallback={<GlobalLoader />}>
                      <Routes>
                        {/* Auth Routes - Minimal Layout */}
                        <Route element={<AuthLayout />}>
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        </Route>
                        
                        {/* Admin Routes - Admin Layout */}
                        <Route element={
                          <ProtectedRoute adminOnly={true}>
                            <AdminLayout />
                          </ProtectedRoute>
                        }>
                          <Route path="/admin" element={<DashboardPage />} />
                          <Route path="/admin/posts" element={<PostsManagePage />} />
                          <Route path="/admin/posts/new" element={<CreatePostPage />} />
                          <Route path="/admin/posts/edit/:id" element={<CreatePostPage />} />
                          <Route path="/admin/scheduled-posts" element={<ScheduledPostsPage />} />
                          <Route path="/admin/categories" element={<CategoriesManagePage />} />
                          <Route path="/admin/tags" element={<TagsManagePage />} />
                          <Route path="/admin/media" element={<MediaLibraryPage />} />
                          <Route path="/admin/comments" element={<CommentsManagePage />} />
                          <Route path="/admin/events" element={<EventsManagePage />} />
                          <Route path="/admin/events/new" element={<CreateEventPage />} />
                          <Route path="/admin/events/edit/:id" element={<CreateEventPage />} />
                          <Route path="/admin/users" element={<UsersManagePage />} />
                          <Route path="/admin/users/new" element={<CreateUserPage />} />
                          <Route path="/admin/users/edit/:id" element={<CreateUserPage />} />
                          <Route path="/admin/analytics" element={<AnalyticsPage />} />
                          <Route path="/admin/analytics/posts/:postId" element={<PostAnalyticsPage />} />
                          <Route path="/admin/broken-links" element={<BrokenLinksPage />} />
                          <Route path="/admin/test-upload" element={<TestUploadPage />} />
                        </Route>

                        {/* Public Routes - Main Layout */}
                        <Route element={<Layout />}>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/blog" element={<BlogPage />} />
                          <Route path="/blog/:slug" element={<BlogPostPage />} />
                          <Route path="/post/:slug" element={<PostDetail />} />
                          <Route path="/tech-news" element={<BlogPage />} />
                          <Route path="/tech-news/latest" element={<LatestPostsPage />} />
                          <Route path="/tech-news/featured" element={<BlogPage category="featured" />} />
                          <Route path="/tech-news/popular" element={<BlogPage category="popular" />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/about-us" element={<AboutUsPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/privacy" element={<PrivacyPage />} />
                          <Route path="/archives" element={<ArchivesPage />} />
                          <Route path="/projects" element={<ProjectsPage />} />
                          <Route path="/events" element={<EventsPage />} />
                          <Route path="/events/latest" element={<EventsPage filter="latest" />} />
                          <Route path="/events/featured" element={<EventsPage filter="featured" />} />
                          <Route path="/events/popular" element={<EventsPage filter="popular" />} />
                          <Route path="/events/:slug" element={<EventDetailPage />} />
                          <Route path="/test-images" element={<TestImagesPage />} />
                          <Route path="/test-categories" element={<TestPage />} />
                          <Route path="/image-debug" element={<ImageDebugPage />} />
                          <Route path="/category/:category" element={<CategoryPage />} />
                          <Route path="/categories" element={<CategoriesPage />} />
                          <Route path="/tag/:slug" element={<BlogPage />} />
                          <Route path="/latest" element={<LatestPostsPage />} />
                          <Route path="/author/:id" element={<AuthorPage />} />
                          
                          {/* Protected User Routes (still in main layout) */}
                          <Route path="/profile" element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          } />
                          <Route path="/settings" element={
                            <ProtectedRoute>
                              <SettingsPage />
                            </ProtectedRoute>
                          } />
                          
                          {/* Catch-all Route */}
                          <Route path="*" element={<NotFoundPage />} />
                        </Route>
                      </Routes>
                    </Suspense>
                  </NotificationsProvider>
                </NotificationProvider>
              </FilterProvider>
            </BlogProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;