import Modal from '../ui/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ErrorMessage from '../ui/ErrorMessage';
import useUiStore from '../../store/uiStore';
import useAuth from '../../hooks/useAuth';

const TABS = [
  { id: 'login', label: 'Sign in' },
  { id: 'register', label: 'Create account' },
];

export default function AuthModal() {
  const { isAuthModalOpen, activeAuthTab, closeAuthModal, setActiveAuthTab } = useUiStore();
  const { login, register, isLoading, error, clearError } = useAuth();

  const handleClose = () => {
    clearError();
    closeAuthModal();
  };

  const switchTab = (tabId) => {
    clearError();
    setActiveAuthTab(tabId);
  };

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
      closeAuthModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (data) => {
    try {
      await register(data.name, data.email, data.password);
      closeAuthModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={handleClose} title="Welcome to GeoMoment">
      <div className="flex bg-white/4 rounded-full p-1 gap-1 mb-6 border border-white/6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchTab(tab.id)}
            className={[
              'flex-1 py-2 text-[13px] font-medium rounded-full transition-all duration-200 cursor-pointer',
              activeAuthTab === tab.id
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} />}

      {activeAuthTab === 'login' ? (
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      ) : (
        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
      )}
    </Modal>
  );
}
