import { Menu, Moon, Sun, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigation } from '../navigation/NavigationContext';

const LINKS = [
  { id: 'home', to: '/', label: 'Home' },
  { id: 'dependent', to: '/dependent-queries', label: '01 · Dependent' },
  { id: 'parallel', to: '/parallel-queries', label: '02 · Parallel' },
  { id: 'mutations', to: '/advanced-mutations', label: '03 · Mutations' },
  { id: 'prefetching', to: '/prefetching', label: '04 · Prefetching' },
  { id: 'suspense', to: '/suspense-mode', label: '05 · Suspense' },
];

type Theme = 'dark' | 'light';
const THEME_QUERY_KEY = ['ui-theme'];

function getPreferredTheme(): Theme {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export function Nav() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [isThemeIconAnimating, setIsThemeIconAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: theme = 'dark' } = useQuery<Theme>({
    queryKey: THEME_QUERY_KEY,
    queryFn: async () => getPreferredTheme(),
    initialData: () => {
      const initialTheme = getPreferredTheme();
      applyTheme(initialTheme);
      return initialTheme;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', onChange);
    setIsMobile(mediaQuery.matches);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [navigation?.activeSection, isMobile]);

  const toggleTheme = () => {
    setIsThemeIconAnimating(false);
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-animating');
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-animating');
    }, 300);
    queryClient.setQueryData(THEME_QUERY_KEY, nextTheme);
    applyTheme(nextTheme);
    setIsThemeIconAnimating(true);
    window.setTimeout(() => setIsThemeIconAnimating(false), 330);
  };

  if (isMobile) {
    return (
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '8px 10px',
          background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 13,
              color: 'var(--accent)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            TanStack Query · S2
          </span>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="ui-outline-btn"
              type="button"
              onClick={toggleTheme}
              style={{
                fontSize: 12,
                color: 'var(--muted)',
                background: 'transparent',
                padding: '6px 10px',
                border: '1px solid var(--border2)',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              <span
                style={{
                  display: 'inline-flex',
                  animation: isThemeIconAnimating ? 'theme-icon-switch 320ms ease' : 'none',
                  transformOrigin: 'center',
                  color: 'var(--icon-strong)',
                }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </span>
            </button>

            <button
              className="ui-outline-btn"
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              style={{
                color: 'var(--muted)',
                background: 'transparent',
                padding: '6px 10px',
                border: '1px solid var(--border2)',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            style={{
              display: 'grid',
              gap: 6,
              padding: '6px 0 2px',
            }}
          >
            {LINKS.map((link) => {
              const active = navigation?.activeSection === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => navigation?.navigateTo(link.to)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    color: active ? 'var(--text)' : 'var(--muted)',
                    background: active
                      ? 'color-mix(in srgb, var(--accent) 22%, transparent)'
                      : 'transparent',
                    border: active
                      ? '1px solid color-mix(in srgb, var(--accent) 45%, transparent)'
                      : '1px solid var(--border)',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </button>
              );
            })}
            <a
              className="ui-outline-btn"
              href="https://tanstack.com/query/latest"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                color: 'var(--muted)',
                textDecoration: 'none',
                padding: '8px 10px',
                border: '1px solid var(--border2)',
                borderRadius: 8,
              }}
            >
              Docs ↗
            </a>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 18,
            color: 'var(--accent)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          TanStack Query · Session 2
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {LINKS.map((link) => {
              const active = navigation?.activeSection === link.id;
            return (
                <button
                key={link.id}
                  type="button"
                  onClick={() => navigation?.navigateTo(link.to)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                    cursor: 'pointer',
                  color: active ? 'var(--text)' : 'var(--muted)',
                  background: active
                    ? 'color-mix(in srgb, var(--accent) 22%, transparent)'
                    : 'transparent',
                  border: active
                    ? '1px solid color-mix(in srgb, var(--accent) 45%, transparent)'
                    : '1px solid transparent',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                  aria-current={active ? 'page' : undefined}
              >
                {link.label}
                </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
        <a
          className="ui-outline-btn"
          href="https://tanstack.com/query/latest"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            color: 'var(--muted)',
            textDecoration: 'none',
            padding: '6px 12px',
            border: '1px solid var(--border2)',
            borderRadius: 8,
          }}
        >
          Docs ↗
        </a>
        <button
          className="ui-outline-btn"
          type="button"
          onClick={toggleTheme}
          style={{
            fontSize: 12,
            color: 'var(--muted)',
            background: 'transparent',
            padding: '6px 12px',
            border: '1px solid var(--border2)',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <span
            style={{
              display: 'inline-flex',
              animation: isThemeIconAnimating ? 'theme-icon-switch 320ms ease' : 'none',
              transformOrigin: 'center',
              color: 'var(--icon-strong)',
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </span>
        </button>
      </div>
    </nav>
  );
}
