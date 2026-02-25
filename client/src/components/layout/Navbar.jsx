import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';
import Button from '../ui/Button';
import ProfileMenu from '../auth/ProfileMenu';

const NAV_LINKS = [
  { to: '/', label: 'Map' },
  { to: '/explore', label: 'Explore' },
];

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <NavLink to="/" className="text-[18px] md:text-[20px] text-white z-50 relative">
          <span className="text-green-400">Geo</span>
          <span className="text-white">Moment</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-6 relative">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.to} link={link} end={link.to === '/'} />
          ))}

          {isAuthenticated && <NavItem link={{ to: '/my-moments', label: 'My Moments' }} />}
        </div>

        <div className="flex items-center gap-3 z-50 relative">
          {isAuthenticated ? (
            <>
              <ProfileMenu />
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => openAuthModal('login')}
              className="text-black bg-white hover:bg-neutral-200 hover:scale-[0.97] active:scale-[0.95] transition-all duration-200 rounded-full flex items-center shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              Sign in
            </Button>
          )}

          <button
            className="md:hidden p-2 -mr-2 text-white/70 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-14 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-[16px] font-medium p-3 rounded-xl transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                to="/my-moments"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-[16px] font-medium p-3 rounded-xl transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`
                }
              >
                My Moments
              </NavLink>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavItem({ link, end }) {
  return (
    <NavLink to={link.to} end={end} className="relative py-1 text-[14px]">
      {({ isActive }) => (
        <>
          <span
            className={`transition-colors duration-200 ${
              isActive ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {link.label}
          </span>

          <motion.div
            layoutId="underline"
            className="absolute left-0 right-0 -bottom-[6px] h-[2px] bg-white"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scaleX: isActive ? 1 : 0.5,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
            style={{ originX: 0 }}
          />
        </>
      )}
    </NavLink>
  );
}
