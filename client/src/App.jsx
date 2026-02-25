import { useEffect, lazy, Suspense, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { SnackbarProvider } from 'notistack';
import useAuthStore from './store/authStore';
import useUiStore from './store/uiStore';
import Navbar from './components/layout/Navbar';
import AuthModal from './components/auth/AuthModal';
import TagSubmitModal from './components/map/TagSubmitModal';
import Spinner from './components/ui/Spinner';
import HomePage from './pages/HomePage';

const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const MyMomentsPage = lazy(() => import('./pages/MyMomentsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-slate-950 px-4">
          <div className="max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-danger/10 flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-danger)"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-100 mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-400 mb-6">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function AppShell() {
  const rehydrate = useAuthStore((s) => s.rehydrate);
  const logout = useAuthStore((s) => s.logout);
  const openAuthModal = useUiStore((s) => s.openAuthModal);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    const handleExpired = () => {
      logout();
      openAuthModal('login');
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [logout, openAuthModal]);

  return (
    <>
      <Navbar />
      <AuthModal />
      <TagSubmitModal />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/my-moments" element={<MyMomentsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </APIProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  );
}
