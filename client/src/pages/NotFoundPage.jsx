import { NavLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="min-h-dvh bg-black flex flex-col items-center justify-center p-4 pt-14 text-white">
      <div className="text-center relative z-10">
        <div className="text-[80px] font-bold text-white/5 mb-2 leading-none">404</div>
        <h1 className="text-[24px] font-semibold text-white tracking-tight mb-2">Page not found</h1>
        <p className="text-[14px] text-white/50 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <NavLink
          to="/"
          className="inline-flex items-center px-6 py-2.5 text-[14px] font-medium text-black bg-white rounded-full hover:bg-neutral-200 hover:scale-[0.97] active:scale-[0.95] shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200"
        >
          Back to map
        </NavLink>
      </div>
    </main>
  );
}
