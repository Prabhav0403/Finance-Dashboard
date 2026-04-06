export default function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div
      className={`
        bg-white dark:bg-surface-card-dark rounded-2xl shadow-card
        border border-transparent dark:border-surface-border-dark
        ${hover ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-default' : ''}
        ${padding ? 'p-5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
