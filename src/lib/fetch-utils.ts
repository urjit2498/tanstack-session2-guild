/** JSON-server base URL. Local default below; production: set in Netlify env (see README). */
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

export async function fetchUser(userId: number) {
  await delay(800);
  const res = await fetch(`${BASE}/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchTeam(teamId: number) {
  await delay(600);
  const res = await fetch(`${BASE}/teams/${teamId}`);
  if (!res.ok) throw new Error("Failed to fetch team");
  return res.json();
}

export async function fetchPostsByUser(userId: number) {
  await delay(700);
  const res = await fetch(`${BASE}/posts?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function fetchStats() {
  await delay(900);
  const res = await fetch(`${BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchAllPosts() {
  await delay(800);
  const res = await fetch(`${BASE}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function fetchAllUsers() {
  await delay(700);
  const res = await fetch(`${BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchComments(postId: number) {
  await delay(500);
  const res = await fetch(`${BASE}/comments?postId=${postId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(body: {
  postId: number;
  author: string;
  body: string;
}) {
  await delay(1000);
  const res = await fetch(`${BASE}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function deleteComment(id: number) {
  await delay(800);
  const res = await fetch(`${BASE}/comments/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}
