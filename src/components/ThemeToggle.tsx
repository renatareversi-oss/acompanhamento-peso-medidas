import { useTheme } from '../store/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      className="fixed top-4 right-4 z-40 w-11 h-11 flex items-center justify-center rounded-full bg-[var(--color-surface)]/90 backdrop-blur border border-[var(--color-border)] shadow-md hover:scale-110 transition-transform text-lg"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
