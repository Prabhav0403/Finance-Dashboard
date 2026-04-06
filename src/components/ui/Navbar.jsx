import { Sun, Moon, Shield, Eye } from 'lucide-react';
import { useApp } from '../../context/useApp';

export default function Navbar() {
  const { role, setRole, darkMode, setDarkMode } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200/60 dark:border-surface-border-dark/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center shadow-accent">
            <span className="text-white font-display font-black text-sm">F</span>
          </div>
          <span className="font-display font-black text-ink dark:text-white text-lg tracking-tight">
            Fin<span className="text-accent">lens</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Role Switcher */}
          <div className="flex items-center gap-1 bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-surface-border-dark rounded-xl p-1 shadow-card">
            <button
              onClick={() => setRole('viewer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'viewer'
                  ? 'bg-ink text-white dark:bg-white dark:text-ink shadow'
                  : 'text-ink-muted dark:text-ink-light hover:text-ink dark:hover:text-white'
              }`}
            >
              <Eye size={12} />
              Viewer
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-accent text-white shadow-accent'
                  : 'text-ink-muted dark:text-ink-light hover:text-ink dark:hover:text-white'
              }`}
            >
              <Shield size={12} />
              Admin
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-surface-border-dark shadow-card text-ink-muted dark:text-ink-light hover:text-accent dark:hover:text-accent transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-display font-bold text-sm shadow-accent select-none">
            {role === 'admin' ? 'A' : 'V'}
          </div>
        </div>
      </div>
    </header>
  );
}
