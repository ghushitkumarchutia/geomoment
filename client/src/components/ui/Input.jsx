import ErrorMessage from './ErrorMessage';

export default function Input({
  label,
  type = 'text',
  error,
  id,
  name,
  ref,
  className = '',
  ...props
}) {
  const inputId = id || name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-white/70 ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        className={[
          'w-full bg-white/2 border border-white/6 rounded-full px-4 py-2.5 text-[13px] text-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]',
          'placeholder:text-white/30',
          'focus:outline-none transition-all duration-200',
          error
            ? 'border-red-500/40 focus:border-red-500/60 focus:bg-red-500/5 text-red-200'
            : 'focus:border-white/20 focus:bg-white/4',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
