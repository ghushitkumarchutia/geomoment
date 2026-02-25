import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAuthStore from '../store/authStore';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ErrorMessage from '../components/ui/ErrorMessage';

const TABS = [
  { id: 'login', label: 'Sign in' },
  { id: 'register', label: 'Create account' },
];

export default function LoginPage() {
  const { login, register, isLoading, error, clearError } = useAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [tab, setTab] = useState('login');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const switchTab = (id) => {
    clearError();
    setTab(id);
  };

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (data) => {
    try {
      await register(data.name, data.email, data.password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-dvh bg-black flex items-center justify-center p-4 pt-14 text-white">
      <div className="w-full max-w-sm bg-black/50 backdrop-blur-xl border border-white/8 rounded-[28px] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] ring-1 ring-white/2 p-7">
        <h1 className="text-[20px] font-semibold text-white tracking-tight text-center mb-6">
          Welcome to <span className="text-green-400">Geo</span>Moment
        </h1>

        <div className="flex bg-white/4 rounded-full p-1 gap-1 mb-6 border border-white/6">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => switchTab(t.id)}
              className={[
                'flex-1 py-2 text-[13px] font-medium rounded-full transition-all duration-200 cursor-pointer',
                tab === t.id
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && <ErrorMessage message={error} />}

        {tab === 'login' ? (
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        ) : (
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        )}
      </div>
    </main>
  );
}
