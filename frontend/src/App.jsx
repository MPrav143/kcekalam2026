import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GlobalConfigProvider } from './context/GlobalConfigContext';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import GlobalNavigationLoader from './components/GlobalNavigationLoader';
import PageBackground, { useHasPageBackground } from './components/PageBackground';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminSignup = lazy(() => import('./pages/AdminSignup'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ManageEvents = lazy(() => import('./pages/ManageEvents'));
const ManageImages = lazy(() => import('./pages/ManageImages'));
const ManagePasses = lazy(() => import('./pages/ManagePasses'));
const ManageContent = lazy(() => import('./pages/ManageContent'));
const ManageSheets = lazy(() => import('./pages/ManageSheets'));
const Passes = lazy(() => import('./pages/Passes'));
const RegisterEvent = lazy(() => import('./pages/RegisterEvent'));
const EventSelection = lazy(() => import('./pages/EventSelection'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup';
  const hasBg = useHasPageBackground();

  return (
    <div className={`min-h-screen ${!isAdminRoute && hasBg ? 'bg-transparent' : 'bg-[#14050E]'} text-white selection:bg-[#D62C76] selection:text-white font-body relative`}>
      {!isAdminRoute && <PageBackground />}
      <Suspense fallback={<Loader text="Loading KALAM 2026..." />}>
        <Routes>
          {/* Public Routes - Single Page Continuous Scroll */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Navigate to="/#technical-events" replace />} />
          <Route path="/passes" element={<Passes embed={false} />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/register/:eventId" element={<RegisterEvent />} />
          <Route path="/select-events" element={<EventSelection />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            {[
              { path: 'dashboard', element: <AdminDashboard /> },
              { path: 'events', element: <ManageEvents /> },
              { path: 'events/:category', element: <ManageEvents /> },
              { path: 'events/:category/:subcategory', element: <ManageEvents /> },
              { path: 'images', element: <ManageImages /> },
              { path: 'passes', element: <ManagePasses /> },
              { path: 'content', element: <ManageContent /> },
              { path: 'sheets', element: <ManageSheets /> },
            ].map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <GlobalConfigProvider>
        <GlobalNavigationLoader>

          <AppContent />

        </GlobalNavigationLoader>
      </GlobalConfigProvider>
    </Router>
  );
}

export default App;
