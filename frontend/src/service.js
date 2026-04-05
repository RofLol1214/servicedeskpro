import { MOCK_USERS, MOCK_CIS } from "./mockData";

// ── Auth ──────────────────────────────────────────────────────────────────────

export function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id);
}

export function authenticateUser(email, password) {
  if (password !== "password") return null;
  return MOCK_USERS.find((u) => u.email === email) ?? null;
}

// ── Tickets ───────────────────────────────────────────────────────────────────

export function createTicket(formData, reporterId) {
  return {
    id: "t" + Date.now(),
    ...formData,
    reporter: reporterId,
    assignee: null,
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sla: { responseTarget: 4, resolutionTarget: 24, breached: false },
    comments: [],
  };
}

export function createComment(userId, text) {
  return { id: "c" + Date.now(), user: userId, text, ts: new Date().toISOString() };
}

export function updateTicketStatus(tickets, ticketId, newStatus) {
  return tickets.map((t) =>
    t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
  );
}

export function assignTicket(tickets, ticketId, userId) {
  return tickets.map((t) =>
    t.id === ticketId ? { ...t, assignee: userId || null } : t
  );
}

export function addCommentToTicket(tickets, ticketId, comment) {
  return tickets.map((t) =>
    t.id === ticketId ? { ...t, comments: [...t.comments, comment] } : t
  );
}

// ── CMDB ──────────────────────────────────────────────────────────────────────

export function createCI(formData) {
  return { id: "ci" + Date.now(), ...formData, relationships: [] };
}

// ── Impact Analysis ───────────────────────────────────────────────────────────

export function getImpactedCIs(ci, cis) {
  const visited = new Set();
  const queue = [ci.id];
  while (queue.length) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    cis.forEach((c) => {
      if (c.relationships.includes(id) && !visited.has(c.id)) queue.push(c.id);
    });
  }
  visited.delete(ci.id);
  return [...visited].map((id) => cis.find((c) => c.id === id)).filter(Boolean);
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function getAlerts(tickets) {
  const breachAlerts = tickets
    .filter((t) => t.sla?.breached)
    .map((t) => ({ type: "breach", text: `SLA breach: ${t.title}`, id: t.id }));
  const unassignedAlerts = tickets
    .filter((t) => t.status === "Open" && !t.assignee)
    .map((t) => ({ type: "unassigned", text: `Unassigned ticket: ${t.title}`, id: t.id + "ua" }));
  return [...breachAlerts, ...unassignedAlerts];
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export function timeAgo(ts) {
  const hours = Math.floor((Date.now() - new Date(ts).getTime()) / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function filterTickets(tickets, filter) {
  return tickets.filter((t) => {
    if (filter.status !== "all" && t.status !== filter.status) return false;
    if (filter.priority !== "all" && t.priority !== filter.priority) return false;
    if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
}

export function filterCIs(cis, search) {
  return cis.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
}

export function filterArticles(articles, search) {
  const q = search.toLowerCase();
  return articles.filter(
    (a) => a.title.toLowerCase().includes(q) || a.tags.some((tag) => tag.includes(q))
  );
}

// =============================================================================
// ASSETS
// =============================================================================

export async function fetchAssets(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API}/assets?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

export async function fetchAssetStats() {
  const res = await fetch(`${API}/assets/stats`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

export async function createAsset(formData) {
  const res = await fetch(`${API}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(formData),
  });
  return res.json();
}

export async function updateAsset(assetId, updates) {
  const res = await fetch(`${API}/assets/${assetId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteAsset(assetId) {
  const res = await fetch(`${API}/assets/${assetId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

export async function assignAsset(assetId, userId) {
  const res = await fetch(`${API}/assets/${assetId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}