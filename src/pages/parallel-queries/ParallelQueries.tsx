import { useQueries } from "@tanstack/react-query";
import { queryKeys } from "../../lib/query-keys";
import { fetchUser, fetchStats, fetchAllPosts } from "../../lib/fetch-utils";
import {
  SectionHeader,
  CodeBlock,
  InfoCard,
  NavButton,
  StatusBadge,
} from "../../components/ui";

const USER_IDS = [1, 2, 3];

const STATIC_CODE = `// Static parallel — just call useQuery twice
const usersQuery = useQuery({ queryKey: queryKeys.users.all, queryFn: fetchAllUsers });
const statsQuery = useQuery({ queryKey: queryKeys.stats.all, queryFn: fetchStats });
// Fine when you know the exact queries at compile time`;

const DYNAMIC_CODE = `// Dynamic parallel — number of queries not known ahead of time
const userQueries = useQueries({
  queries: userIds.map(id => ({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => fetchUser(id),
    staleTime: 1000 * 60,
  })),
});

// Results come back as an array in the same order
const allLoaded = userQueries.every(q => q.isSuccess);
const users = userQueries.map(q => q.data).filter(Boolean);`;

export function ParallelQueries() {
  // Static parallel — two independent queries
  const statsQuery = {
    queryKey: queryKeys.stats.all,
    queryFn: fetchStats,
    staleTime: 1000 * 30,
  };

  const postsQuery = {
    queryKey: queryKeys.posts.all,
    queryFn: fetchAllPosts,
  };

  const [statsResult, postsResult] = useQueries({
    queries: [statsQuery, postsQuery],
  });

  // Dynamic parallel — fetch N users
  const userQueries = useQueries({
    queries: USER_IDS.map((id) => ({
      queryKey: queryKeys.users.detail(id),
      queryFn: () => fetchUser(id),
      staleTime: 1000 * 60,
    })),
  });

  const allUsersLoaded = userQueries.every((q) => q.isSuccess);
  const users = userQueries.map((q) => q.data).filter(Boolean);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px clamp(14px, 4vw, 24px)" }}>
      <SectionHeader
        number="02"
        topic="Parallel Queries"
        title="Fetch everything at once"
        subtitle="When queries are independent, run them simultaneously. useQueries handles dynamic lists where you don't know the count at compile time."
        color="#2dd4bf"
      />

      <InfoCard title="Static vs Dynamic" color="#2dd4bf" icon="⚡">
        <strong style={{ color: "#e8e6f0" }}>Static parallel</strong> — you know the queries
        at build time, just write two <code style={{ fontFamily: "var(--mono)", color: "#2dd4bf" }}>useQuery</code> calls.
        TanStack Query fires them simultaneously automatically.{" "}
        <strong style={{ color: "#e8e6f0" }}>Dynamic parallel</strong> — the list of queries depends
        on runtime data (e.g., an array of IDs). Use{" "}
        <code style={{ fontFamily: "var(--mono)", color: "#2dd4bf" }}>useQueries</code> for this.
      </InfoCard>

      <div style={{ marginTop: 32, marginBottom: 40 }}>
        <CodeBlock label="Static parallel (2 useQuery calls)" code={STATIC_CODE} />
        <div style={{ marginTop: 16 }}>
          <CodeBlock label="Dynamic parallel (useQueries)" code={DYNAMIC_CODE} highlight="useQueries" />
        </div>
      </div>

      {/* Dashboard demo — static parallel */}
      <div
        style={{
          background: "#12121a",
          border: "1px solid rgba(45,212,191,0.2)",
          borderRadius: 16,
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#2dd4bf", marginBottom: 4 }}>
          Demo 1 — Static parallel (Dashboard)
        </h2>
        <p style={{ fontSize: 13, color: "#888096", marginBottom: 24 }}>
          Stats and Posts fire at the same time — watch both load in parallel in DevTools
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          {/* Stats */}
          <div
            style={{
              padding: 20,
              background: "#0a0a0f",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#888096" }}>Stats Query</span>
              <StatusBadge
                status={
                  statsResult.isLoading
                    ? "loading"
                    : statsResult.isError
                    ? "error"
                    : "success"
                }
              />
            </div>
            {statsResult.data?.map((s: any) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 13, color: "#888096" }}>{s.metric}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e6f0", fontFamily: "var(--mono)" }}>
                  {s.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Posts */}
          <div
            style={{
              padding: 20,
              background: "#0a0a0f",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#888096" }}>Posts Query</span>
              <StatusBadge
                status={
                  postsResult.isLoading
                    ? "loading"
                    : postsResult.isError
                    ? "error"
                    : "success"
                }
              />
            </div>
            {postsResult.data?.map((p: any) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 13, color: "#888096", flex: 1, marginRight: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                <span style={{ fontSize: 12, color: "#2dd4bf", fontFamily: "var(--mono)", flexShrink: 0 }}>
                  {p.views.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic demo */}
      <div
        style={{
          background: "#12121a",
          border: "1px solid rgba(45,212,191,0.2)",
          borderRadius: 16,
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: 40,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#2dd4bf", marginBottom: 4 }}>
          Demo 2 — Dynamic parallel (useQueries)
        </h2>
        <p style={{ fontSize: 13, color: "#888096", marginBottom: 24 }}>
          Fetching {USER_IDS.length} users simultaneously — results come back as an array
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
          {userQueries.map((q, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: "#0a0a0f",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 11, color: "#888096", marginBottom: 8, fontFamily: "var(--mono)" }}>
                queries[{i}]
              </div>
              <StatusBadge
                status={
                  q.isLoading ? "loading" : q.isError ? "error" : "success"
                }
              />
              {q.data && (
                <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: "#e8e6f0" }}>
                  {q.data.name}
                </div>
              )}
            </div>
          ))}
        </div>

        {allUsersLoaded && (
          <div
            style={{
              padding: 16,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 10,
              fontSize: 14,
              color: "#22c55e",
              fontFamily: "var(--mono)",
            }}
          >
            ✓ All {users.length} users loaded — userQueries.every(q =&gt; q.isSuccess) === true
          </div>
        )}
      </div>

      <CodeBlock
        label="Combining useQueries results"
        code={`const userQueries = useQueries({
  queries: userIds.map(id => ({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => fetchUser(id),
  })),
});

// Derived state — computed from the array
const isAnyLoading = userQueries.some(q => q.isLoading);
const allLoaded    = userQueries.every(q => q.isSuccess);
const hasAnyError  = userQueries.some(q => q.isError);
const users        = userQueries.map(q => q.data).filter(Boolean);`}
        highlight="useQueries"
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, gap: 10, flexWrap: "wrap" }}>
        <NavButton to="/dependent-queries" label="Dependent Queries" direction="prev" />
        <NavButton to="/advanced-mutations" label="Advanced Mutations" color="#f59e0b" />
      </div>
    </div>
  );
}
