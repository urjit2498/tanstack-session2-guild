import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/query-keys";
import { fetchUser, fetchAllPosts } from "../../lib/fetch-utils";
import {
  SectionHeader,
  CodeBlock,
  InfoCard,
  NavButton,
  StatusBadge,
} from "../../components/ui";

const PREFETCH_CODE = `// Prefetch on hover — data is ready before user clicks
function UserListItem({ user }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.users.detail(user.id),
      queryFn: () => fetchUser(user.id),
      staleTime: 1000 * 60,   // don't prefetch if fresh data exists
    });
  };

  return <li onMouseEnter={handleMouseEnter}>{user.name}</li>;
}`;

const STALE_CODE = `// staleTime  — how long data is considered fresh (no refetch)
// gcTime     — how long unused data stays in cache before garbage collected

const { data } = useQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => fetchUser(userId),
  staleTime: 1000 * 60 * 5,   // 5 minutes — great for slow-changing data
  gcTime: 1000 * 60 * 10,     // 10 minutes — keep in cache even if unmounted
});`;

const POLLING_CODE = `// refetchInterval — polling for live data
const { data } = useQuery({
  queryKey: queryKeys.stats.all,
  queryFn: fetchStats,
  refetchInterval: 5000,       // refetch every 5 seconds
  refetchIntervalInBackground: false, // pause when tab is hidden
});

// Dynamic interval — poll faster when something is processing
refetchInterval: (query) =>
  query.state.data?.status === 'processing' ? 1000 : false,`;

const USERS = [1, 2, 3];

export function Prefetching() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [prefetched, setPrefetched] = useState<number[]>([]);
  const [pollingEnabled, setPollingEnabled] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  const userQuery = useQuery({
    queryKey: selectedUser
      ? queryKeys.users.detail(selectedUser)
      : ["none"],
    queryFn: () => fetchUser(selectedUser!),
    enabled: selectedUser !== null,
  });

  // Polling demo
  useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: async () => {
      setPollCount((c) => c + 1);
      return fetchAllPosts();
    },
    refetchInterval: pollingEnabled ? 3000 : false,
    enabled: pollingEnabled,
  });

  const handleHover = (userId: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.users.detail(userId),
      queryFn: () => fetchUser(userId),
      staleTime: 1000 * 60,
    });
    if (!prefetched.includes(userId)) {
      setPrefetched((prev) => [...prev, userId]);
    }
  };

  const handleClick = (userId: number) => {
    setSelectedUser(userId);
  };

  const userStatus = !selectedUser
    ? "idle"
    : userQuery.isLoading
    ? "loading"
    : userQuery.isError
    ? "error"
    : "success";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px clamp(14px, 4vw, 24px)" }}>
      <SectionHeader
        number="04"
        topic="Prefetching & Background Updates"
        title="Make your app feel instant"
        subtitle="Prefetch data before the user needs it. Tune staleTime and gcTime to avoid redundant requests. Poll live endpoints with refetchInterval."
        color="#22c55e"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 40 }}>
        {[
          { label: "prefetchQuery", desc: "Load data into cache before navigation or click", color: "#22c55e" },
          { label: "staleTime", desc: "Window where cached data is used without a refetch", color: "#2dd4bf" },
          { label: "refetchInterval", desc: "Automatic polling for real-time data", color: "#7c6af5" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: 20,
              background: "#12121a",
              border: `1px solid ${item.color}33`,
              borderRadius: 12,
            }}
          >
            <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: item.color, fontWeight: 700, display: "block", marginBottom: 8 }}>
              {item.label}
            </code>
            <p style={{ fontSize: 13, color: "#888096", lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Prefetch on hover demo */}
      <div
        style={{
          background: "#12121a",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 16,
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#22c55e", marginBottom: 4 }}>
          Demo 1 — Prefetch on Hover
        </h2>
        <p style={{ fontSize: 13, color: "#888096", marginBottom: 24 }}>
          Hover over a user to prefetch, then click. Notice the data loads instantly — it's already in cache.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {/* User list */}
          <div>
            <div style={{ fontSize: 12, color: "#888096", marginBottom: 12, fontFamily: "var(--mono)" }}>
              HOVER TO PREFETCH · CLICK TO VIEW
            </div>
            {USERS.map((id) => {
              const wasPrefetched = prefetched.includes(id);
              return (
                <div
                  key={id}
                  onMouseEnter={() => handleHover(id)}
                  onClick={() => handleClick(id)}
                  style={{
                    padding: "14px 18px",
                    marginBottom: 8,
                    background: selectedUser === id ? "rgba(34,197,94,0.1)" : "#0a0a0f",
                    border: `1px solid ${
                      selectedUser === id
                        ? "rgba(34,197,94,0.4)"
                        : wasPrefetched
                        ? "rgba(34,197,94,0.2)"
                        : "rgba(255,255,255,0.07)"
                    }`,
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#e8e6f0", fontWeight: 500 }}>
                    User {id}
                  </span>
                  {wasPrefetched && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "#22c55e",
                        fontFamily: "var(--mono)",
                        fontWeight: 700,
                      }}
                    >
                      ✓ prefetched
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Result panel */}
          <div
            style={{
              padding: 20,
              background: "#0a0a0f",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#888096", fontFamily: "var(--mono)" }}>
                SELECTED USER
              </span>
              <StatusBadge status={userStatus} />
            </div>

            {!selectedUser && (
              <p style={{ fontSize: 14, color: "#888096", fontStyle: "italic" }}>
                Click a user to view
              </p>
            )}

            {userQuery.data && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#e8e6f0", marginBottom: 4 }}>
                  {userQuery.data.name}
                </div>
                <div style={{ fontSize: 14, color: "#888096" }}>
                  {userQuery.data.email}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CodeBlock label="Prefetch on hover pattern" code={PREFETCH_CODE} highlight="prefetchQuery" />

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <CodeBlock label="staleTime vs gcTime" code={STALE_CODE} highlight="staleTime|gcTime" />
      </div>

      {/* Polling demo */}
      <div
        style={{
          background: "#12121a",
          border: "1px solid rgba(124,106,245,0.2)",
          borderRadius: 16,
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#7c6af5", marginBottom: 4 }}>
          Demo 2 — Polling with refetchInterval
        </h2>
        <p style={{ fontSize: 13, color: "#888096", marginBottom: 24 }}>
          Toggle polling to see refetchInterval automatically re-running the query every 3 seconds.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div
            onClick={() => setPollingEnabled((v) => !v)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: pollingEnabled ? "#7c6af5" : "rgba(255,255,255,0.1)",
              position: "relative",
              cursor: "pointer",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 4,
                left: pollingEnabled ? 23 : 4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
              }}
            />
          </div>
          <span style={{ fontSize: 14, color: pollingEnabled ? "#a992ff" : "#888096", fontWeight: 600 }}>
            {pollingEnabled ? "Polling active — every 3s" : "Polling disabled"}
          </span>
          {pollingEnabled && (
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                color: "#7c6af5",
                background: "rgba(124,106,245,0.15)",
                padding: "4px 12px",
                borderRadius: 100,
              }}
            >
              refetch #{pollCount}
            </span>
          )}
        </div>

        <CodeBlock label="Polling setup" code={POLLING_CODE} highlight="refetchInterval" />
      </div>

      <InfoCard title="The golden staleTime rule" color="#22c55e" icon="✨">
        Most apps should set a <code style={{ fontFamily: "var(--mono)", color: "#22c55e" }}>staleTime</code> greater
        than 0. The default (0ms) means every mount triggers a background refetch — often unnecessary.
        Start with <strong style={{ color: "#e8e6f0" }}>30 seconds for user data</strong>,{" "}
        <strong style={{ color: "#e8e6f0" }}>5 minutes for reference data</strong>, and{" "}
        <strong style={{ color: "#e8e6f0" }}>Infinity for static config</strong>.
      </InfoCard>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, gap: 10, flexWrap: "wrap" }}>
        <NavButton to="/advanced-mutations" label="Advanced Mutations" direction="prev" />
        <NavButton to="/suspense-mode" label="Suspense Mode" color="#f43f5e" />
      </div>
    </div>
  );
}
