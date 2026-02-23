import Spinner from './Spinner';

const VARIANTS = {
  primary:
    'bg-white text-black hover:bg-neutral-200 hover:scale-[0.97] active:scale-[0.95] shadow-[0_0_15px_rgba(255,255,255,0.15)]',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 active:scale-[0.97]',
  ghost:
    'bg-transparent text-white/60 hover:text-white hover:bg-white/6 border border-transparent hover:border-white/10 active:scale-[0.97]',
};

const SIZES = {
  sm: 'px-4 py-1.5 text-[12px] h-8',
  md: 'px-5 py-2 text-[13px] h-[34px]',
  lg: 'px-6 py-2.5 text-[14px] h-[42px]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 cursor-pointer select-none',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        isDisabled ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
