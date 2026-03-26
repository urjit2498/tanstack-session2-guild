import { useEffect, useState } from 'react';

const SESSIONS = [
  {
    number: '01',
    title: 'Dependent Queries',
    subtitle: 'Chain queries with the enabled flag',
    path: '/dependent-queries',
    color: '#7c6af5',
  },
  {
    number: '02',
    title: 'Parallel Queries',
    subtitle: 'useQueries for dynamic lists',
    path: '/parallel-queries',
    color: '#2dd4bf',
  },
  {
    number: '03',
    title: 'Advanced Mutations',
    subtitle: 'Full lifecycle & rollback strategies',
    path: '/advanced-mutations',
    color: '#f59e0b',
  },
  {
    number: '04',
    title: 'Prefetching',
    subtitle: 'Make your app feel instant',
    path: '/prefetching',
    color: '#22c55e',
  },
  {
    number: '05',
    title: 'Suspense Mode',
    subtitle: 'Declarative loading states',
    path: '/suspense-mode',
    color: '#f43f5e',
  },
];

export function Home() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', onChange);
    setIsMobile(mediaQuery.matches);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: isMobile ? '72px 14px' : '80px 24px',
        maxWidth: 900,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      {/* Hero */}
      <div
        style={{
          marginBottom: 80,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 16px',
            background: 'rgba(124,106,245,0.12)',
            border: '1px solid rgba(124,106,245,0.3)',
            borderRadius: 100,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: '#7c6af5',
              fontWeight: 600,
              letterSpacing: '0.1em',
            }}
          >
            TANSTACK QUERY · GUILD SESSION 2
          </span>
        </div>

        <h1
          style={{
            fontSize: isMobile ? 'clamp(32px, 10vw, 44px)' : 'clamp(36px, 7vw, 72px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 20,
          }}
        >
          Beyond the{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #7c6af5, #2dd4bf)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Basics
          </span>
        </h1>

        <p
          style={{
            fontSize: isMobile ? 16 : 18,
            color: 'var(--muted)',
            lineHeight: 1.7,
            maxWidth: 680,
            marginBottom: 32,
          }}
        >
          Session 1 gave you the foundation. Now we cover the patterns that separate good
          TanStack Query code from great TanStack Query code. Five topics, one hour.
        </p>

        <div
          style={{
            display: 'grid',
            gap: isMobile ? 8 : 12,
            gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(4, max-content)',
            justifyContent: 'center',
            overflowX: 'visible',
            maxWidth: isMobile ? 320 : '100%',
            paddingBottom: 4,
            margin: '0 auto',
          }}
        >
          {SESSIONS.map((session, index) => (
            <span
              key={session.number}
              style={{
                padding: isMobile ? '7px 11px' : '8px 14px',
                background: `color-mix(in srgb, ${session.color} 10%, var(--bg2))`,
                border: `1px solid color-mix(in srgb, ${session.color} 35%, var(--border2))`,
                borderRadius: 100,
                fontSize: isMobile ? 12 : 13,
                color: 'var(--text)',
                fontFamily: 'var(--mono)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: `0 0 0 1px color-mix(in srgb, ${session.color} 10%, transparent) inset`,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                width: isMobile ? '100%' : undefined,
                justifyContent: isMobile ? 'center' : undefined,
                gridColumn: !isMobile && index === 4 ? '2 / span 2' : undefined,
                justifySelf: !isMobile && index === 4 ? 'center' : undefined,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: session.color,
                  boxShadow: `0 0 12px ${session.color}aa`,
                }}
              />
              <strong style={{ color: session.color, fontWeight: 700 }}>
                {session.number}
              </strong>
              {session.title}
            </span>
          ))}
        </div>
      </div>

      {/* Session cards */}
      <div
        style={{
          display: 'grid',
          gap: 16,
        }}
      >
        {SESSIONS.map((s) => (
          <a
            key={s.number}
            href={s.path}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr auto' : 'auto 1fr auto',
              alignItems: 'center',
              columnGap: 12,
              rowGap: 2,
              padding: isMobile ? '16px 16px' : '22px 28px',
              background: '#12121a',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = `${s.color}55`;
              e.currentTarget.style.background = '#16161f';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.background = '#12121a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                gridColumn: isMobile ? '1' : '1 / span 2',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: isMobile ? 13 : 14,
                    color: s.color,
                    fontWeight: 700,
                    minWidth: 26,
                    borderRadius: 6,
                    padding: isMobile ? '4px 8px' : '5px 10px',
                    border: `1px solid color-mix(in srgb, ${s.color} 35%, var(--border2))`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {s.number}
                </span>
                <div
                  style={{
                    fontSize: isMobile ? 16 : 17,
                    fontWeight: 600,
                    color: '#e8e6f0',
                  }}
                >
                  {s.title}
                </div>
              </div>
              <div
                style={{
                  fontSize: isMobile ? 13 : 14,
                  color: 'var(--muted)',
                  marginLeft: isMobile ? 0 : 44,
                }}
              >
                {s.subtitle}
              </div>
            </div>
            <span
              style={{
                gridColumn: '3',
                gridRow: '1 / span 2',
                color: 'var(--muted)',
                flexShrink: 0,
                textAlign: 'right',
                fontSize: isMobile ? 16 : 18,
                alignSelf: 'center',
              }}
            >
              →
            </span>
          </a>
        ))}
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: 60,
          padding: isMobile ? '16px 14px' : '20px 24px',
          background: 'rgba(124,106,245,0.07)',
          border: '1px solid rgba(124,106,245,0.2)',
          borderRadius: 12,
          fontSize: 14,
          color: 'var(--text)',
          lineHeight: 1.7,
          textAlign: 'center',
        }}
      >
        <strong style={{ color: 'var(--accent)' }}>Before you start:</strong> Run{' '}
        <code
          style={{
            fontFamily: 'var(--mono)',
            background: 'color-mix(in srgb, var(--accent) 16%, transparent)',
            padding: '2px 8px',
            borderRadius: 6,
            color: 'var(--accent)',
          }}
        >
          npm run server
        </code>{' '}
        to start the mock API on port 5000, then{' '}
        <code
          style={{
            fontFamily: 'var(--mono)',
            background: 'color-mix(in srgb, var(--accent) 16%, transparent)',
            padding: '2px 8px',
            borderRadius: 6,
            color: 'var(--accent)',
          }}
        >
          npm run dev
        </code>{' '}
        in another terminal. Open DevTools → React Query tab to watch the cache live.
      </div>

      <div
        style={{
          marginTop: 56,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: isMobile ? 16 : 18,
            fontWeight: 600,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          Open DevTools to explore queries in real-time
        </span>
        <p
          style={{
            fontSize: 14,
            color: 'var(--muted)',
            marginBottom: 12,
          }}
        >
          Look for the floating TanStack Query icon at the bottom of the screen
        </p>
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <a
            className="ui-outline-btn"
            href="https://tanstack.com/query/latest"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              borderRadius: 999,
              background: '#0b0b10',
              color: '#ffffff',
              border: '1px solid color-mix(in srgb, var(--text) 18%, var(--border2))',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              width: isMobile ? '100%' : undefined,
              justifyContent: 'center',
            }}
          >
            <span role="img" aria-label="books">
              📚
            </span>
            Official Docs
          </a>
          <a
            className="ui-outline-btn"
            href="https://github.com/TanStack/query"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              borderRadius: 999,
              background: 'transparent',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid var(--border2)',
              width: isMobile ? '100%' : undefined,
              justifyContent: 'center',
            }}
          >
            <span role="img" aria-label="star">
              ⭐
            </span>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
