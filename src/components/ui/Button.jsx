export default function Button({ children, variant = 'primary', onClick, disabled, className = '', size = 'md', type = 'button' }) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-accent text-white shadow-accent hover:bg-accent-dark hover:shadow-lg',
    secondary: 'bg-surface dark:bg-surface-border-dark text-ink dark:text-white hover:bg-gray-100 dark:hover:bg-surface-border-dark/80',
    ghost: 'text-ink-muted dark:text-ink-light hover:bg-surface dark:hover:bg-surface-border-dark hover:text-ink dark:hover:text-white',
    danger: 'bg-expense-light text-expense-dark hover:bg-red-100',
    outline: 'border border-gray-200 dark:border-surface-border-dark text-ink dark:text-white hover:border-accent hover:text-accent',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
