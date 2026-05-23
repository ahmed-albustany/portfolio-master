import { lazy, Suspense, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModeProvider, ModeContext } from '@/context/ModeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Home = lazy(() => import('@/pages/Home'));
const Admin = lazy(() => import('@/pages/Admin'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const { isImmersive, isTransitioning } = useContext(ModeContext);

  const isAdmin = location.pathname.startsWith('/admin');

  // Hide Navbar/Footer on admin pages and in immersive mode
  const showChrome = !isAdmin && !isImmersive && !isTransitioning;

  return (
    <div className="min-h-screen bg-light dark:bg-dark transition-theme">
      {showChrome && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {showChrome && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <AppLayout />
      </ModeProvider>
    </ThemeProvider>
  );
}
