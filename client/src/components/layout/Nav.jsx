import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';

const NAV_LINKS = [
  { to: '/', label: 'Map' },
  { to: '/explore', label: 'Explore' },
  { to: '/compare', label: 'Compare' },
];

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);

  const links = [...NAV_LINKS];
  if (isAuthenticated) {
    links.push({ to: '/my-moments', label: 'My Moments' });
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex items-center justify-between p-1.5 pr-2 bg-black backdrop-blur-2xl border border-white/8 rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] w-full max-w-4xl ring-1 ring-white/2"
      >
        <div className="shrink-0 pl-5 pr-6 flex items-center h-[42px] sm:w-[160px]">
          <NavLink
            to="/"
            className="text-[15px] font-semibold text-white tracking-tight flex items-center gap-2 outline-none group opacity-90 hover:opacity-100 transition-opacity"
          >
            <span>
              <span className="text-green-400">Geo</span>
              <span className="text-white font-medium tracking-normal">Moment</span>
            </span>
          </NavLink>
        </div>

        <div
          className="hidden sm:flex items-center h-[44px] px-1.5 rounded-full border border-white/4 bg-white/2"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {links.map((link) => {
            const isActive =
              link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredPath(link.to)}
                onClick={() => setHoveredPath(link.to)}
                className="relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-200 outline-none flex items-center justify-center -translate-y-[0.5px]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span
                  className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/50 hover:text-white/90'}`}
                >
                  {link.label}
                </span>

                {hoveredPath === link.to && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white/4 rounded-full z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white/10 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] z-0 box-border border-b border-black/30"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="shrink-0 flex items-center h-[42px] gap-2 sm:w-[160px] justify-end">
          {isAuthenticated ? (
            <div className="flex items-center gap-1">
              <div className="items-center justify-center bg-white/4 border border-white/6 px-3 h-8 rounded-full hidden sm:flex">
                <span className="text-[12px] font-medium text-white/70 max-w-[90px] truncate">
                  {user?.name.charAt(0) || 'User'.charAt(0)}
                </span>
              </div>
              <button
                onClick={logout}
                className="h-8 px-4 text-[12px] font-medium text-white/60 hover:text-white bg-transparent hover:bg-white/6 border border-transparent hover:border-white/10 transition-all duration-200 rounded-full flex items-center justify-center cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="h-[34px] px-5 text-[13px] font-medium text-black bg-white hover:bg-neutral-200 hover:scale-[0.97] active:scale-[0.95] transition-all duration-200 rounded-full flex items-center shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
