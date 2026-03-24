import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/query-keys";
import { fetchUser, fetchPostsByUser, fetchTeam } from "../../lib/fetch-utils";
import {
  SectionHeader,
  CodeBlock,
  ComparePanel,
  InfoCard,
  NavButton,
  StatusBadge,
} from "../../components/ui";

const BAD_CODE = `// ❌ Race condition + double useEffect hell
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(\`/users/\${userId}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);

  useEffect(() => {
    // ⚠ runs before user is loaded!
    if (user?.id) {
      fetch(\`/posts?userId=\${user.id}\`)
        .then(r => r.json())
        .then(setPosts);
    }
  }, [user]); // fragile dependency
}`;

const GOOD_CODE = `// ✅ Dependent query with enabled flag
function UserProfile({ userId }) {
  const userQuery = useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => fetchUser(userId),
  });

  const postsQuery = useQuery({
    queryKey: queryKeys.users.posts(userQuery.data?.id),
    queryFn: () => fetchPostsByUser(userQuery.data!.id),
    enabled: !!userQuery.data?.id,  // 👈 the magic
  });
}`;

export function DependentQueries() {
  const [selectedUser, setSelectedUser] = useState(1);

  const userQuery = useQuery({
    queryKey: queryKeys.users.detail(selectedUser),
    queryFn: () => fetchUser(selectedUser),
  });

  const teamQuery = useQuery({
    queryKey: queryKeys.teams.detail(userQuery.data?.teamId),
    queryFn: () => fetchTeam(userQuery.data!.teamId),
    enabled: !!userQuery.data?.teamId,
  });

  const postsQuery = useQuery({
    queryKey: queryKeys.users.posts(selectedUser),
    queryFn: () => fetchPostsByUser(selectedUser),
    enabled: !!userQuery.data?.id,
  });

  const userStatus = userQuery.isLoading
    ? "loading"
    : userQuery.isError
    ? "error"
    : "success";

  const teamStatus = !userQuery.data?.teamId
    ? "idle"
    : teamQuery.isLoading
    ? "loading"
    : teamQuery.isError
    ? "error"
    : "success";

  const postsStatus = !userQuery.data?.id
    ? "idle"
    : postsQuery.isLoading
    ? "loading"
    : postsQuery.isError
    ? "error"
    : "success";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px clamp(14px, 4vw, 24px)" }}>
      <SectionHeader
        number="01"
        topic="Dependent Queries"
        title="Chain queries with the enabled flag"
        subtitle="Sometimes query B depends on the result of query A. The enabled option lets you hold a query back until you have what you need."
        color="#7c6af5"
      />

      {/* Concept */}
      <InfoCard title="The Core Idea" color="#7c6af5" icon="💡">
        The <code style={{ fontFamily: "var(--mono)", color: "#a992ff" }}>enabled</code> option
        accepts a boolean. When false, the query won't run — it just sits in <strong>idle</strong>{" "}
        state. The moment it becomes true (because the first query resolved), TanStack Query
        automatically fires the dependent query. Zero useEffect, zero race conditions.
      </InfoCard>

      <div style={{ marginTop: 32, marginBottom: 48 }}>
        <ComparePanel
          before={{ label: "Without TanStack Query", code: BAD_CODE }}
          after={{ label: "With enabled flag", code: GOOD_CODE }}
          highlight="enabled"
        />
      </div>

      {/* Live Demo */}
      <div
        style={{
          background: "#12121a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#e8e6f0",
            }}
          >
            Live Demo — Chain: User → Team + Posts
          </h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[1, 2, 3].map((id) => (
              <button
                key={id}
                onClick={() => setSelectedUser(id)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: `1px solid ${
                    selectedUser === id
                      ? "rgba(124,106,245,0.6)"
                      : "rgba(255,255,255,0.1)"
                  }`,
                  background:
                    selectedUser === id
                      ? "rgba(124,106,245,0.2)"
                      : "transparent",
                  color: selectedUser === id ? "#a992ff" : "#888096",
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                User {id}
              </button>
            ))}
          </div>
        </div>

        {/* Query chain visualiser */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "1. Fetch User", status: userStatus, data: userQuery.data?.name },
            { label: "2. Fetch Team (needs user.teamId)", status: teamStatus, data: teamQuery.data?.name },
            { label: "3. Fetch Posts (needs user.id)", status: postsStatus, data: postsQuery.data ? `${postsQuery.data.length} posts` : undefined },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                padding: 20,
                background: "#0a0a0f",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 12, color: "#888096", marginBottom: 10, fontFamily: "var(--mono)" }}>
                {step.label}
              </div>
              <StatusBadge status={step.status as any} />
              {step.data && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    color: "#22c55e",
                    fontWeight: 600,
                  }}
                >
                  {step.data}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User card result */}
        {userQuery.data && (
          <div
            style={{
              padding: 20,
              background: "rgba(124,106,245,0.07)",
              border: "1px solid rgba(124,106,245,0.2)",
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div>
                <span style={{ fontSize: 12, color: "#888096" }}>User</span>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#e8e6f0" }}>
                  {userQuery.data.name}
                </div>
              </div>
              {teamQuery.data && (
                <div>
                  <span style={{ fontSize: 12, color: "#888096" }}>Team</span>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#2dd4bf" }}>
                    {teamQuery.data.name}
                  </div>
                </div>
              )}
              {postsQuery.data && (
                <div>
                  <span style={{ fontSize: 12, color: "#888096" }}>Posts</span>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#f59e0b" }}>
                    {postsQuery.data.map((p: any) => p.title).join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CodeBlock
        label="Key pattern — enabled as a boolean gate"
        code={`const teamQuery = useQuery({
  queryKey: queryKeys.teams.detail(userQuery.data?.teamId),
  queryFn: () => fetchTeam(userQuery.data!.teamId),
  enabled: !!userQuery.data?.teamId,   // falsy → idle, truthy → fires
});

// Check both statuses in your UI:
const isReady = userQuery.isSuccess && teamQuery.isSuccess;
const isLoading = userQuery.isLoading || teamQuery.isLoading;`}
        highlight="enabled"
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, gap: 10, flexWrap: "wrap" }}>
        <NavButton to="/" label="Home" direction="prev" />
        <NavButton to="/parallel-queries" label="Parallel Queries" color="#2dd4bf" />
      </div>
    </div>
  );
}
