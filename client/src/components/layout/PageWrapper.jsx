export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`pt-14 min-h-dvh bg-black text-white ${className}`}>
      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
    </main>
  );
}
