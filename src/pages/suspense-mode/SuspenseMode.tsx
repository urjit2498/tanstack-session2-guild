import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { queryKeys } from "../../lib/query-keys";
import { fetchAllUsers, fetchStats } from "../../lib/fetch-utils";
import {
  SectionHeader,
  CodeBlock,
  ComparePanel,
  InfoCard,
  NavButton,
} from "../../components/ui";

/* ─── Suspense-enabled data components ─── */
function UserList() {
  const { data: users } = useSuspenseQuery({
    queryKey: queryKeys.users.all,
    queryFn: fetchAllUsers,
  });

  return (
    <div>
      {(users as any[]).map((u: any) => (
        <div
          key={u.id}
          style={{
            padding: "10px 14px",
            marginBottom: 8,
            background: "#0a0a0f",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 14, color: "#e8e6f0", fontWeight: 500 }}>{u.name}</span>
          <span style={{ fontSize: 12, color: "#888096" }}>{u.email}</span>
        </div>
      ))}
    </div>
  );
}

function StatsList() {
  const { data: stats } = useSuspenseQuery({
    queryKey: queryKeys.stats.all,
    queryFn: fetchStats,
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
      {(stats as any[]).map((s: any) => (
        <div
          key={s.id}
          style={{
            padding: "16px 20px",
            background: "#0a0a0f",
            border: "1px solid rgba(244,63,94,0.2)",
            borderRadius: 10,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: "#f43f5e", fontFamily: "var(--mono)" }}>
            {s.value.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: "#888096", marginTop: 4 }}>{s.metric}</div>
        </div>
      ))}
    </div>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div
      style={{
        padding: 20,
        background: "rgba(244,63,94,0.1)",
        border: "1px solid rgba(244,63,94,0.3)",
        borderRadius: 12,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 14, color: "#f43f5e", marginBottom: 12 }}>
        {error.message}
      </div>
      <button
        onClick={resetErrorBoundary}
        style={{
          padding: "8px 18px",
          background: "#f43f5e",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "var(--sans)",
        }}
      >
        Retry
      </button>
    </div>
  );
}

function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 42,
            marginBottom: 8,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10,
            animation: "shimmer 1.5s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

const BAD_CODE = `// ❌ Imperative loading checks scattered everywhere
function Dashboard() {
  const usersQuery = useQuery({ queryKey: ..., queryFn: fetchUsers });
  const statsQuery = useQuery({ queryKey: ..., queryFn: fetchStats });

  if (usersQuery.isLoading || statsQuery.isLoading) return <Spinner />;
  if (usersQuery.isError) return <Error error={usersQuery.error} />;
  if (statsQuery.isError) return <Error error={statsQuery.error} />;

  return <div>...</div>;
}`;

const GOOD_CODE = `// ✅ Declarative — data components never touch loading/error state
function UserList() {
  const { data } = useSuspenseQuery({   // throws a Promise when loading
    queryKey: queryKeys.users.all,      // throws an Error when it fails
    queryFn: fetchUsers,
  });
  return <ul>{data.map(u => <li>{u.name}</li>)}</ul>;
}

// Loading + Error handled declaratively at the boundary level:
<ErrorBoundary fallback={<ErrorUI />}>
  <Suspense fallback={<Skeleton />}>
    <UserList />     {/* data is always ready here */}
    <StatsList />
  </Suspense>
</ErrorBoundary>`;

export function SuspenseMode() {
  const [showDemo, setShowDemo] = useState(false);
  const [demoKey, setDemoKey] = useState(0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px clamp(14px, 4vw, 24px)" }}>
      <SectionHeader
        number="05"
        topic="Suspense Mode"
        title="Declarative loading states"
        subtitle="Instead of checking isLoading everywhere, let React's Suspense and ErrorBoundary handle it. Your data components just assume data is ready."
        color="#f43f5e"
      />

      {/* Mental model shift */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 40 }}>
        <div
          style={{
            padding: 20,
            background: "#12121a",
            border: "1px solid rgba(244,63,94,0.2)",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f43f5e", marginBottom: 12 }}>
            Without Suspense
          </div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {[
              "Every component checks isLoading",
              "Every component checks isError",
              "Loading state logic mixed with render logic",
              "N queries = N if-checks",
            ].map((text) => (
              <li key={text} style={{ fontSize: 13, color: "#888096", marginBottom: 6, lineHeight: 1.6 }}>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            padding: 20,
            background: "#12121a",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", marginBottom: 12 }}>
            With Suspense
          </div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {[
              "Data components assume data is ready",
              "Loading handled by nearest Suspense boundary",
              "Errors handled by nearest ErrorBoundary",
              "N queries = still 1 Suspense wrapper",
            ].map((text) => (
              <li key={text} style={{ fontSize: 13, color: "#888096", marginBottom: 6, lineHeight: 1.6 }}>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ComparePanel
        before={{ label: "Imperative (useQuery)", code: BAD_CODE }}
        after={{ label: "Declarative (useSuspenseQuery)", code: GOOD_CODE }}
        highlight="useSuspenseQuery|Suspense|ErrorBoundary"
      />

      <div style={{ marginTop: 40, marginBottom: 40 }}>
        <InfoCard title="How useSuspenseQuery works" color="#f43f5e" icon="🎭">
          When the data isn't ready yet, <code style={{ fontFamily: "var(--mono)", color: "#f43f5e" }}>useSuspenseQuery</code>{" "}
          <strong style={{ color: "#e8e6f0" }}>throws a Promise</strong> — React catches it and renders
          the nearest <code style={{ fontFamily: "var(--mono)", color: "#f43f5e" }}>&lt;Suspense fallback&gt;</code>.
          When it fails, it <strong style={{ color: "#e8e6f0" }}>throws an Error</strong> — React catches that
          and renders the nearest <code style={{ fontFamily: "var(--mono)", color: "#f43f5e" }}>&lt;ErrorBoundary fallback&gt;</code>.
          Your data component never has to handle either case.
        </InfoCard>
      </div>

      {/* Live demo */}
      <div
        style={{
          background: "#12121a",
          border: "1px solid rgba(244,63,94,0.2)",
          borderRadius: 16,
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: 40,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f43f5e", marginBottom: 4 }}>
          Live Demo — ErrorBoundary + Suspense wrapping two data components
        </h2>
        <p style={{ fontSize: 13, color: "#888096", marginBottom: 24 }}>
          Both UserList and StatsList use useSuspenseQuery. One Suspense, one ErrorBoundary handles both.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => { setShowDemo(true); setDemoKey((k) => k + 1); }}
            style={{
              padding: "10px 22px",
              background: "#f43f5e",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--sans)",
            }}
          >
            {showDemo ? "Re-mount (see skeleton again)" : "Mount Components"}
          </button>
        </div>

        {showDemo && (
          <div key={demoKey}>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setDemoKey((k) => k + 1)}>
              <Suspense fallback={
                <div>
                  <div style={{ fontSize: 12, color: "#888096", marginBottom: 12, fontFamily: "var(--mono)" }}>
                    SUSPENSE FALLBACK RENDERING…
                  </div>
                  <LoadingSkeleton rows={3} />
                  <div style={{ marginTop: 12 }}>
                    <LoadingSkeleton rows={1} />
                  </div>
                </div>
              }>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "#f43f5e", fontFamily: "var(--mono)", marginBottom: 8 }}>
                    &lt;UserList /&gt; — uses useSuspenseQuery
                  </div>
                  <UserList />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#f43f5e", fontFamily: "var(--mono)", marginBottom: 8, marginTop: 16 }}>
                    &lt;StatsList /&gt; — uses useSuspenseQuery
                  </div>
                  <StatsList />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        )}
      </div>

      <CodeBlock
        label="The complete setup"
        code={`import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// In your data component — no isLoading, no isError checks
function UserList() {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.users.all,
    queryFn: fetchAllUsers,
  });
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// In your layout — loading + error handled here once
function Dashboard() {
  return (
    <ErrorBoundary fallback={<ErrorUI />}>
      <Suspense fallback={<Skeleton />}>
        <UserList />
        <StatsList />
      </Suspense>
    </ErrorBoundary>
  );
}`}
        highlight="useSuspenseQuery|Suspense|ErrorBoundary"
      />

      <div
        style={{
          marginTop: 32,
          padding: 20,
          background: "rgba(244,63,94,0.06)",
          border: "1px solid rgba(244,63,94,0.2)",
          borderRadius: 12,
          fontSize: 13,
          color: "#888096",
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: "#f43f5e" }}>Gotcha:</strong>{" "}
        <code style={{ fontFamily: "var(--mono)", color: "#c9c0f0" }}>useSuspenseQuery</code> always
        returns <code style={{ fontFamily: "var(--mono)", color: "#c9c0f0" }}>data</code> — it's never
        undefined. This means TypeScript is happy without extra null checks. But the tradeoff is
        that you must wrap in Suspense — otherwise React will error. Also install{" "}
        <code style={{ fontFamily: "var(--mono)", color: "#c9c0f0" }}>react-error-boundary</code>{" "}
        for the ErrorBoundary component (React doesn't ship a default one).
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, gap: 10, flexWrap: "wrap" }}>
        <NavButton to="/prefetching" label="Prefetching" direction="prev" />
        <NavButton to="/" label="Back to Home" color="#7c6af5" />
      </div>
    </div>
  );
}
