import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/query-keys";
import { fetchComments, addComment, deleteComment } from "../../lib/fetch-utils";
import {
  SectionHeader,
  CodeBlock,
  InfoCard,
  NavButton,
  StatusBadge,
} from "../../components/ui";

const POST_ID = 101;

const LIFECYCLE_CODE = `useMutation({
  mutationFn: addComment,

  onMutate: async (newComment) => {
    // 1. Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey });

    // 2. Snapshot the previous value
    const previous = queryClient.getQueryData(queryKey);

    // 3. Optimistically update the cache
    queryClient.setQueryData(queryKey, old => [...old, newComment]);

    // 4. Return context for rollback
    return { previous };
  },

  onError: (err, newComment, context) => {
    // 5. Roll back on error
    queryClient.setQueryData(queryKey, context?.previous);
  },

  onSettled: () => {
    // 6. Always refetch to sync with server
    queryClient.invalidateQueries({ queryKey });
  },
});`;

const STATES_CODE = `const { mutate, isPending, isSuccess, isError, reset } = useMutation(...);

// UI feedback from mutation state
{isPending && <Spinner />}
{isError   && <ErrorBanner onRetry={reset} />}
{isSuccess && <SuccessBadge />}

// Trigger the mutation
mutate({ postId: 101, author: "You", body: "Nice post!" });`;

export function AdvancedMutations() {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [authorName] = useState("You");
  const [simulateError, setSimulateError] = useState(false);

  const commentsKey = queryKeys.posts.comments(POST_ID);

  const commentsQuery = useQuery({
    queryKey: commentsKey,
    queryFn: () => fetchComments(POST_ID),
  });

  const addMutation = useMutation({
    mutationFn: async (comment: { postId: number; author: string; body: string }) => {
      if (simulateError) {
        await new Promise((_, rej) => setTimeout(rej, 800, new Error("Server rejected comment")));
      }
      return addComment(comment);
    },

    onMutate: async (newCommentData) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });
      const previous = queryClient.getQueryData(commentsKey);

      const optimistic = {
        id: Date.now(),
        ...newCommentData,
        _optimistic: true,
      };

      queryClient.setQueryData(commentsKey, (old: any[] = []) => [
        ...old,
        optimistic,
      ]);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(commentsKey, context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });
      const previous = queryClient.getQueryData(commentsKey);
      queryClient.setQueryData(commentsKey, (old: any[] = []) =>
        old.filter((c) => c.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(commentsKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });

  const handleAdd = () => {
    if (!newComment.trim()) return;
    addMutation.mutate({ postId: POST_ID, author: authorName, body: newComment });
    setNewComment("");
  };

  const mutationStatus: "loading" | "success" | "error" | "idle" = addMutation.isPending
    ? "loading"
    : addMutation.isSuccess
    ? "success"
    : addMutation.isError
    ? "error"
    : "idle";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px clamp(14px, 4vw, 24px)" }}>
      <SectionHeader
        number="03"
        topic="Advanced Mutations"
        title="The full mutation lifecycle"
        subtitle="onMutate, onError, onSettled — understand what each hook does and when to use manual cache updates vs invalidation."
        color="#f59e0b"
      />

      {/* Lifecycle diagram */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 40,
        }}
      >
        {[
          {
            step: "onMutate",
            desc: "Fires before the request. Snapshot the old value. Optimistically update the cache. Return context.",
            color: "#7c6af5",
          },
          {
            step: "onError",
            desc: "Fires if the server rejects. Use context.previous to roll back the optimistic update.",
            color: "#f43f5e",
          },
          {
            step: "onSettled",
            desc: "Fires after success OR error — always. The right place to invalidate and sync with server.",
            color: "#22c55e",
          },
        ].map((item) => (
          <div
            key={item.step}
            style={{
              padding: 20,
              background: "#12121a",
              border: `1px solid ${item.color}33`,
              borderTop: `3px solid ${item.color}`,
              borderRadius: 12,
            }}
          >
            <code
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                color: item.color,
                fontWeight: 700,
                display: "block",
                marginBottom: 8,
              }}
            >
              {item.step}
            </code>
            <p style={{ fontSize: 13, color: "#888096", lineHeight: 1.6 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <CodeBlock label="Full mutation lifecycle" code={LIFECYCLE_CODE} highlight="onMutate|onError|onSettled" />

      <div style={{ marginTop: 16, marginBottom: 40 }}>
        <CodeBlock label="Mutation state in your UI" code={STATES_CODE} highlight="isPending|isSuccess|isError" />
      </div>

      {/* Live demo */}
      <div
        style={{
          background: "#12121a",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 16,
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: 40,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f59e0b" }}>
            Live Demo — Optimistic Comments with Rollback
          </h2>
          <StatusBadge status={mutationStatus} />
        </div>
        <p style={{ fontSize: 13, color: "#888096", marginBottom: 24 }}>
          Post comments optimistically. Toggle "Simulate Error" to see the rollback in action.
        </p>

        {/* Error toggle */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            cursor: "pointer",
          }}
        >
          <div
            onClick={() => setSimulateError((v) => !v)}
            style={{
              width: 40,
              height: 22,
              borderRadius: 11,
              background: simulateError ? "#f43f5e" : "rgba(255,255,255,0.1)",
              position: "relative",
              transition: "background 0.2s",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: simulateError ? 21 : 3,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: simulateError ? "#f43f5e" : "#888096", fontWeight: 600 }}>
            Simulate Server Error (forces rollback)
          </span>
        </label>

        {/* Comment list */}
        <div style={{ marginBottom: 20 }}>
          {commentsQuery.isLoading && (
            <div style={{ fontSize: 13, color: "#888096", fontStyle: "italic" }}>
              Loading comments...
            </div>
          )}
          {commentsQuery.data?.map((comment: any) => (
            <div
              key={comment.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "12px 16px",
                marginBottom: 8,
                background: comment._optimistic
                  ? "rgba(245,158,11,0.07)"
                  : "#0a0a0f",
                border: comment._optimistic
                  ? "1px solid rgba(245,158,11,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                transition: "all 0.2s",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: comment._optimistic ? "#f59e0b" : "#7c6af5",
                    marginRight: 8,
                  }}
                >
                  {comment.author}
                  {comment._optimistic && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 10,
                        color: "#f59e0b",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      [optimistic]
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 14, color: "#e8e6f0" }}>
                  {comment.body}
                </span>
              </div>
              <button
                onClick={() => deleteMutation.mutate(comment.id)}
                disabled={deleteMutation.isPending}
                style={{
                  fontSize: 12,
                  color: "#888096",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add comment */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a comment…"
            style={{
              flex: 1,
              padding: "10px 16px",
              background: "#0a0a0f",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "#e8e6f0",
              fontSize: 14,
              fontFamily: "var(--sans)",
              outline: "none",
            }}
          />
          <button
            onClick={handleAdd}
            disabled={addMutation.isPending || !newComment.trim()}
            style={{
              padding: "10px 22px",
              background: addMutation.isPending ? "rgba(245,158,11,0.3)" : "#f59e0b",
              color: "#0a0a0f",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: addMutation.isPending ? "not-allowed" : "pointer",
              fontFamily: "var(--sans)",
              transition: "background 0.15s",
            }}
          >
            {addMutation.isPending ? "Posting…" : "Post"}
          </button>
        </div>

        {addMutation.isError && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 16px",
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.3)",
              borderRadius: 10,
              fontSize: 13,
              color: "#f43f5e",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Server rejected — comment rolled back!</span>
            <button
              onClick={() => addMutation.reset()}
              style={{
                fontSize: 12,
                color: "#f43f5e",
                background: "transparent",
                border: "1px solid rgba(244,63,94,0.4)",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <InfoCard title="Invalidation vs Manual Update" color="#f59e0b" icon="🔄">
        <strong style={{ color: "#e8e6f0" }}>Manual cache update</strong> (setQueryData) — instant
        UI feedback, no network trip. Use for optimistic updates.{" "}
        <strong style={{ color: "#e8e6f0" }}>Invalidation</strong> (invalidateQueries) — marks data
        stale and triggers a background refetch. Use in onSettled to confirm the server state.
        The pattern: <em>update manually in onMutate → always invalidate in onSettled</em>.
      </InfoCard>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, gap: 10, flexWrap: "wrap" }}>
        <NavButton to="/parallel-queries" label="Parallel Queries" direction="prev" />
        <NavButton to="/prefetching" label="Prefetching" color="#22c55e" />
      </div>
    </div>
  );
}
