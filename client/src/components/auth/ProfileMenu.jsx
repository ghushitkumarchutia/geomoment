import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';

export default function ProfileMenu() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-[34px] h-[34px] rounded-full bg-white/10 border-[0.5px] border-white/20 flex items-center justify-center text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
      >
        {user?.name?.charAt(0).toUpperCase()}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/8 rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] ring-1 ring-white/2 overflow-hidden"
          >
            <div className="px-4 py-2.5 text-[12px] font-medium text-white/50 border-b border-white/6 bg-white/2">
              {user?.name}
            </div>

            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-[13px] text-white/70 hover:bg-white/6 hover:text-white transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
