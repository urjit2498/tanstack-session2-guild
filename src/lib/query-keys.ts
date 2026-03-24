export const queryKeys = {
  users: {
    all: ["users"] as const,
    detail: (id: number) => ["users", id] as const,
    posts: (id: number) => ["users", id, "posts"] as const,
  },
  teams: {
    detail: (id: number) => ["teams", id] as const,
  },
  posts: {
    all: ["posts"] as const,
    comments: (postId: number) => ["posts", postId, "comments"] as const,
  },
  stats: {
    all: ["stats"] as const,
  },
};
