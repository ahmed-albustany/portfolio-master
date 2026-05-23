import { lazy, Suspense, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModeProvider, ModeContext } from '@/context/ModeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageLoader from '@/components/layout/PageLoader';

const Home = lazy(() => import('@/pages/Home'));
const Admin = lazy(() => import('@/pages/Admin'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function AppLayout() {
  const location = useLocation();
  const { isDeepSystem, isTransitioning } = useContext(ModeContext);

  const isAdmin = location.pathname.startsWith('/admin');
  const showChrome = !isAdmin && !isDeepSystem && !isTransitioning;

  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
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
