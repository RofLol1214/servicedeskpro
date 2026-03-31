import { useState } from "react";
import { Badge, Avatar, Icon } from "./components";
import {
  STATUS_COLORS, PRIORITY_COLORS, CI_TYPE_COLORS, CI_STATUS_COLORS,
  ROLE_COLORS, TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES,
  CI_TYPES, CI_STATUSES, GRAPH_POSITIONS, GRAPH_NODE_COLORS,
} from "./constants";
import {
  getUserById, authenticateUser, createTicket, createComment,
  updateTicketStatus, assignTicket, addCommentToTicket, createCI,
  getImpactedCIs, getAlerts, timeAgo, filterTickets, filterCIs, filterArticles,
} from "./service";
import { MOCK_USERS, MOCK_CIS, KB_ARTICLES } from "./mockData";

// =============================================================================
// LOGIN PAGE
// =============================================================================
export function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("alice@corp.com");
  const [password, setPassword] = useState("password");
  const [error, setError]       = useState("");

  const handleLogin = () => {
    const user = authenticateUser(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError("Invalid credentials. Try password: 'password'");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Icon name="server" className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              ServiceDesk<span className="text-indigo-400">Pro</span>
            </span>
          </div>
          <p className="text-zinc-400 text-sm">IT Service Management Platform</p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-6">Sign in to your account</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}
          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <select value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500">
              {MOCK_USERS.map((u) => (
                <option key={u.id} value={u.email}>{u.email} ({u.role})</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <button onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors">
            Sign In
          </button>
          <p className="text-center text-zinc-500 text-xs mt-4">Demo: select any user, password is "password"</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SIDEBAR
// =============================================================================
export function Sidebar({ currentPage, setPage, currentUser, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard",       icon: "dashboard" },
    { id: "tickets",   label: "Tickets",         icon: "ticket"    },
    { id: "cmdb",      label: "CMDB",            icon: "server"    },
    { id: "impact",    label: "Impact Analysis", icon: "impact"    },
    { id: "kb",        label: "Knowledge Base",  icon: "kb"        },
    ...(currentUser.role === "admin" ? [{ id: "users", label: "Users", icon: "users" }] : []),
  ];

  return (
    <aside className="w-56 bg-[#0d1117] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="server" className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">
              ServiceDesk<span className="text-indigo-400">Pro</span>
            </div>
            <div className="text-zinc-500 text-xs capitalize">{currentUser.role.replace("_", " ")}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition-all ${
              currentPage === item.id
                ? "bg-indigo-600/20 text-indigo-300 font-medium"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}>
            <Icon name={item.icon} className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
          <Avatar initials={currentUser.avatar} />
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{currentUser.name}</div>
            <div className="text-zinc-500 text-xs capitalize">{currentUser.role.replace("_", " ")}</div>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 text-sm transition-all">
          <Icon name="logout" className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// =============================================================================
// DASHBOARD
// =============================================================================
export function Dashboard({ tickets, currentUser }) {
  const myTickets = currentUser.role === "user"
    ? tickets.filter((t) => t.reporter === currentUser.id)
    : tickets;

  const open       = myTickets.filter((t) => t.status === "Open").length;
  const inProgress = myTickets.filter((t) => t.status === "In Progress").length;
  const resolved   = myTickets.filter((t) => t.status === "Resolved").length;
  const critical   = myTickets.filter((t) => t.priority === "Critical").length;
  const breached   = myTickets.filter((t) => t.sla?.breached).length;

  const stats = [
    { label: "Total Tickets", value: myTickets.length, color: "text-white",       bg: "bg-white/5"        },
    { label: "Open",          value: open,             color: "text-blue-400",    bg: "bg-blue-500/10"    },
    { label: "In Progress",   value: inProgress,       color: "text-amber-400",   bg: "bg-amber-500/10"   },
    { label: "Resolved",      value: resolved,         color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Critical",      value: critical,         color: "text-red-400",     bg: "bg-red-500/10"     },
    { label: "SLA Breached",  value: breached,         color: "text-orange-400",  bg: "bg-orange-500/10"  },
  ];

  const recent = [...myTickets]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Welcome back, {currentUser.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white/5`}>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-zinc-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      {breached > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <Icon name="alert" className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <div className="text-red-300 font-medium text-sm">
              {breached} SLA breach{breached > 1 ? "es" : ""} detected
            </div>
            <div className="text-red-400/70 text-xs">Immediate attention required for critical tickets</div>
          </div>
        </div>
      )}
      <div className="bg-[#111827] border border-white/5 rounded-xl">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
        </div>
        <div className="divide-y divide-white/5">
          {recent.map((t) => (
            <div key={t.id} className="px-5 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{t.title}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{t.category} · {timeAgo(t.updatedAt)}</div>
              </div>
              <Badge label={t.status}   colorClass={STATUS_COLORS[t.status]}     />
              <Badge label={t.priority} colorClass={PRIORITY_COLORS[t.priority]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// TICKET LIST
// =============================================================================
export function TicketList({ tickets, setTickets, currentUser }) {
  const [filter, setFilter]         = useState({ status: "all", priority: "all", search: "" });
  const [showForm, setShowForm]     = useState(false);
  const [selected, setSelected]     = useState(null);
  const [newComment, setNewComment] = useState("");

  const myTickets = currentUser.role === "user"
    ? tickets.filter((t) => t.reporter === currentUser.id)
    : tickets;

  const filtered = filterTickets(myTickets, filter);

  const handleCreate = (formData) => {
    setTickets((prev) => [createTicket(formData, currentUser.id), ...prev]);
    setShowForm(false);
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets((prev) => updateTicketStatus(prev, ticketId, newStatus));
    if (selected?.id === ticketId) setSelected((prev) => ({ ...prev, status: newStatus }));
  };

  const handleAssign = (ticketId, userId) => {
    setTickets((prev) => assignTicket(prev, ticketId, userId));
    if (selected?.id === ticketId) setSelected((prev) => ({ ...prev, assignee: userId || null }));
  };

  const handleAddComment = (ticketId) => {
    if (!newComment.trim()) return;
    const comment = createComment(currentUser.id, newComment);
    setTickets((prev) => addCommentToTicket(prev, ticketId, comment));
    if (selected?.id === ticketId) setSelected((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
    setNewComment("");
  };

  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-white">Tickets</h1>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Icon name="plus" className="w-4 h-4" /> New Ticket
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Icon name="search" className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={filter.search} onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search tickets..."
              className="w-full bg-[#111827] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500" />
          </div>
          <select value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
            className="bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
            <option value="all">All Statuses</option>
            {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filter.priority} onChange={(e) => setFilter((f) => ({ ...f, priority: e.target.value }))}
            className="bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
            <option value="all">All Priorities</option>
            {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Title", "Priority", "Status", "Assignee", "Updated"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((t) => {
                const assignee = getUserById(t.assignee);
                return (
                  <tr key={t.id} onClick={() => setSelected(t)} className="hover:bg-white/5 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white text-sm font-medium">{t.title}</div>
                      <div className="text-zinc-500 text-xs mt-0.5">{t.category} · #{t.id}</div>
                    </td>
                    <td className="px-4 py-3"><Badge label={t.priority} colorClass={PRIORITY_COLORS[t.priority]} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge label={t.status} colorClass={STATUS_COLORS[t.status]} />
                        {t.sla?.breached && <span className="text-red-400 text-xs">⚠ SLA</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar initials={assignee.avatar} />
                          <span className="text-zinc-300 text-xs">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{timeAgo(t.updatedAt)}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-zinc-600">No tickets found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="w-96 flex-shrink-0 bg-[#111827] border border-white/5 rounded-xl p-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 5rem)" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-xs text-zinc-500 mb-1">#{selected.id} · {selected.category}</div>
              <h2 className="text-white font-semibold text-sm leading-snug">{selected.title}</h2>
            </div>
            <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white ml-2">
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            <Badge label={selected.status}   colorClass={STATUS_COLORS[selected.status]}     />
            <Badge label={selected.priority} colorClass={PRIORITY_COLORS[selected.priority]} />
            {selected.sla?.breached && <Badge label="SLA Breached" colorClass="bg-red-500/20 text-red-300 border border-red-500/30" />}
          </div>
          <p className="text-zinc-300 text-sm mb-5 leading-relaxed">{selected.description}</p>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Reporter</span>
              <span className="text-zinc-200">{getUserById(selected.reporter)?.name}</span>
            </div>
            {selected.ciId && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Linked CI</span>
                <span className="text-indigo-400">{MOCK_CIS.find((c) => c.id === selected.ciId)?.name}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Created</span>
              <span className="text-zinc-200">{timeAgo(selected.createdAt)}</span>
            </div>
          </div>
          {(currentUser.role === "admin" || currentUser.role === "it_staff") && (
            <div className="space-y-3 mb-5 border-t border-white/5 pt-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-1.5">Status</label>
                <select value={selected.status} onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                  className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1.5">Assignee</label>
                <select value={selected.assignee || ""} onChange={(e) => handleAssign(selected.id, e.target.value)}
                  className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="">Unassigned</option>
                  {MOCK_USERS.filter((u) => u.role !== "user").map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="border-t border-white/5 pt-4">
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Comments</h3>
            <div className="space-y-3 mb-3">
              {selected.comments.map((c) => (
                <div key={c.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar initials={getUserById(c.user)?.avatar} />
                    <span className="text-xs text-zinc-400">{getUserById(c.user)?.name}</span>
                    <span className="text-xs text-zinc-600 ml-auto">{timeAgo(c.ts)}</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">{c.text}</p>
                </div>
              ))}
              {selected.comments.length === 0 && <p className="text-zinc-600 text-xs">No comments yet.</p>}
            </div>
            <div className="flex gap-2">
              <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..." onKeyDown={(e) => e.key === "Enter" && handleAddComment(selected.id)}
                className="flex-1 bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500" />
              <button onClick={() => handleAddComment(selected.id)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs transition-colors">
                Post
              </button>
            </div>
          </div>
        </div>
      )}
      {showForm && <TicketForm onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  );
}

// =============================================================================
// TICKET FORM MODAL
// =============================================================================
export function TicketForm({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", category: "Incident", ciId: "" });
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-white font-semibold">Create New Ticket</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><Icon name="x" className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Title</label>
            <input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Brief description of the issue"
              className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="Detailed description..."
              className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setField("priority", e.target.value)}
                className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setField("category", e.target.value)}
                className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                {TICKET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Linked CI (optional)</label>
            <select value={form.ciId} onChange={(e) => setField("ciId", e.target.value)}
              className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
              <option value="">None</option>
              {MOCK_CIS.map((ci) => <option key={ci.id} value={ci.id}>{ci.name} ({ci.type})</option>)}
            </select>
          </div>
        </div>
        <div className="p-5 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={() => form.title && onCreate(form)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CMDB VIEW
// =============================================================================
export function CMDBView({ currentUser }) {
  const [cis, setCis]             = useState(MOCK_CIS);
  const [selected, setSelected]   = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [showForm, setShowForm]   = useState(false);

  const handleCreate = (formData) => {
    setCis((prev) => [...prev, createCI(formData)]);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-white">CMDB</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowGraph(!showGraph)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
              showGraph ? "border-indigo-500 bg-indigo-600/20 text-indigo-300" : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
            }`}>
            <Icon name="graph" className="w-4 h-4" /> Graph View
          </button>
          {currentUser.role !== "user" && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Icon name="plus" className="w-4 h-4" /> Add CI
            </button>
          )}
        </div>
      </div>
      {showGraph ? (
        <CMDBGraph cis={cis} onSelect={setSelected} />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {cis.map((ci) => (
            <div key={ci.id} onClick={() => setSelected(ci)}
              className="bg-[#111827] border border-white/5 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold ${CI_TYPE_COLORS[ci.type]}`}>{ci.type}</span>
                <Badge label={ci.status} colorClass={CI_STATUS_COLORS[ci.status] || "bg-zinc-500/20 text-zinc-400"} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{ci.name}</h3>
              <div className="text-zinc-500 text-xs">Owner: {getUserById(ci.owner)?.name}</div>
              <div className="text-zinc-600 text-xs mt-1">{ci.relationships.length} relationship{ci.relationships.length !== 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      )}
      {selected && <CIDetail ci={selected} cis={cis} onClose={() => setSelected(null)} />}
      {showForm  && <CIForm  onClose={() => setShowForm(false)} onCreate={handleCreate} />}
    </div>
  );
}

// =============================================================================
// CMDB GRAPH
// =============================================================================
export function CMDBGraph({ cis, onSelect }) {
  const edges = cis.flatMap((ci) => ci.relationships.map((relId) => ({ from: ci.id, to: relId })));

  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 text-xs text-zinc-500">Click a node to view details</div>
      <svg width="100%" viewBox="0 30 750 430" className="block">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#4f46e5" />
          </marker>
        </defs>
        {edges.map((edge, i) => {
          const f = GRAPH_POSITIONS[edge.from];
          const t = GRAPH_POSITIONS[edge.to];
          if (!f || !t) return null;
          return <line key={i} x1={f.x + 50} y1={f.y + 20} x2={t.x + 50} y2={t.y + 20} stroke="#4f46e5" strokeWidth="1.5" strokeOpacity="0.5" markerEnd="url(#arrow)" strokeDasharray="4 2" />;
        })}
        {cis.map((ci) => {
          const pos   = GRAPH_POSITIONS[ci.id];
          const color = GRAPH_NODE_COLORS[ci.type] || "#6b7280";
          if (!pos) return null;
          return (
            <g key={ci.id} onClick={() => onSelect(ci)} style={{ cursor: "pointer" }} transform={`translate(${pos.x}, ${pos.y})`}>
              <rect width="100" height="40" rx="8" fill={color + "33"} stroke={color} strokeWidth="1.5" />
              <text x="50" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
                {ci.name.length > 12 ? ci.name.slice(0, 11) + "…" : ci.name}
              </text>
              <text x="50" y="29" textAnchor="middle" fill={color} fontSize="9">{ci.type}</text>
              {ci.status === "Degraded" && <circle cx="92" cy="8" r="5" fill="#f59e0b" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// =============================================================================
// CI DETAIL MODAL
// =============================================================================
export function CIDetail({ ci, cis, onClose }) {
  const dependencies = ci.relationships.map((id) => cis.find((c) => c.id === id)).filter(Boolean);
  const dependents   = cis.filter((c) => c.relationships.includes(ci.id));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <span className={`text-xs font-semibold ${CI_TYPE_COLORS[ci.type]}`}>{ci.type}</span>
            <h2 className="text-white font-semibold mt-0.5">{ci.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge label={ci.status} colorClass={CI_STATUS_COLORS[ci.status] || ""} />
            <button onClick={onClose} className="text-zinc-500 hover:text-white"><Icon name="x" className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs text-zinc-500 mb-2">Owner: {getUserById(ci.owner)?.name}</div>
            <div className="bg-[#1a2235] rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">Metadata</div>
              {Object.entries(ci.metadata).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-0.5">
                  <span className="text-zinc-400">{k}</span>
                  <span className="text-zinc-200">{v}</span>
                </div>
              ))}
            </div>
          </div>
          {dependencies.length > 0 && (
            <div>
              <div className="text-xs text-zinc-500 mb-2">Dependencies (runs on / uses)</div>
              <div className="space-y-1">
                {dependencies.map((d) => (
                  <div key={d.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-sm text-white">{d.name}</span>
                    <span className={`text-xs ${CI_TYPE_COLORS[d.type]}`}>{d.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {dependents.length > 0 && (
            <div>
              <div className="text-xs text-zinc-500 mb-2">Dependents (used by)</div>
              <div className="space-y-1">
                {dependents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-sm text-white">{d.name}</span>
                    <span className={`text-xs ${CI_TYPE_COLORS[d.type]}`}>{d.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CI FORM MODAL
// =============================================================================
export function CIForm({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", type: "Application", status: "Running", owner: "u1", metadata: {} });
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-white font-semibold">Add Configuration Item</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><Icon name="x" className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5">Name</label>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)}
              className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setField("type", e.target.value)}
                className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                {CI_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setField("status", e.target.value)}
                className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                {CI_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5">Owner</label>
            <select value={form.owner} onChange={(e) => setField("owner", e.target.value)}
              className="w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
              {MOCK_USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        <div className="p-5 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={() => form.name && onCreate(form)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Add CI</button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// IMPACT ANALYSIS
// =============================================================================
export function ImpactAnalysis({ tickets }) {
  const [selectedCI, setSelectedCI] = useState(MOCK_CIS[2]);
  const [searchCI, setSearchCI]     = useState("");

  const linkedTickets = selectedCI ? tickets.filter((t) => t.ciId === selectedCI.id) : [];
  const impacted      = selectedCI ? getImpactedCIs(selectedCI, MOCK_CIS) : [];
  const filteredCIs   = filterCIs(MOCK_CIS, searchCI);

  const ciStatusBg = (s) => s === "Degraded" ? "bg-amber-500/10 border-amber-500/30" : s === "Down" ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/5";
  const ciStatusIcon = (s) => s === "Degraded" ? "text-amber-400" : s === "Down" ? "text-red-400" : "text-zinc-400";

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white">Impact Analysis</h1>
        <p className="text-zinc-400 text-sm mt-1">Select a CI to see what systems would be affected if it fails</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div>
          <div className="relative mb-3">
            <Icon name="search" className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={searchCI} onChange={(e) => setSearchCI(e.target.value)} placeholder="Search CIs..."
              className="w-full bg-[#111827] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-2">
            {filteredCIs.map((ci) => (
              <div key={ci.id} onClick={() => setSelectedCI(ci)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedCI?.id === ci.id ? "border-indigo-500 bg-indigo-600/10" : "border-white/5 bg-[#111827] hover:border-white/20"
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{ci.name}</span>
                  <Badge label={ci.status} colorClass={CI_STATUS_COLORS[ci.status] || ""} />
                </div>
                <span className={`text-xs ${CI_TYPE_COLORS[ci.type]}`}>{ci.type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 space-y-4">
          {selectedCI && (
            <>
              <div className={`rounded-xl p-4 border ${ciStatusBg(selectedCI.status)}`}>
                <div className="flex items-center gap-3">
                  <Icon name="impact" className={`w-5 h-5 ${ciStatusIcon(selectedCI.status)}`} />
                  <div>
                    <div className="text-white font-semibold">{selectedCI.name}</div>
                    <div className={`text-xs ${CI_TYPE_COLORS[selectedCI.type]}`}>{selectedCI.type}</div>
                  </div>
                  <Badge label={selectedCI.status} colorClass={CI_STATUS_COLORS[selectedCI.status] || ""} />
                </div>
              </div>
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Icon name="alert" className="w-4 h-4 text-orange-400" />
                  Impacted Systems ({impacted.length})
                </h3>
                {impacted.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No dependent systems found.</p>
                ) : (
                  <div className="space-y-2">
                    {impacted.map((ci) => (
                      <div key={ci.id} className="flex items-center justify-between bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2.5">
                        <div>
                          <span className="text-white text-sm font-medium">{ci.name}</span>
                          <span className={`text-xs ml-2 ${CI_TYPE_COLORS[ci.type]}`}>{ci.type}</span>
                        </div>
                        <Badge label={ci.status} colorClass={CI_STATUS_COLORS[ci.status] || ""} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Icon name="ticket" className="w-4 h-4 text-blue-400" />
                  Linked Tickets ({linkedTickets.length})
                </h3>
                {linkedTickets.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No tickets linked to this CI.</p>
                ) : (
                  <div className="space-y-2">
                    {linkedTickets.map((t) => (
                      <div key={t.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2.5">
                        <div className="text-sm text-white">{t.title}</div>
                        <div className="flex gap-2">
                          <Badge label={t.status}   colorClass={STATUS_COLORS[t.status]}     />
                          <Badge label={t.priority} colorClass={PRIORITY_COLORS[t.priority]} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// KNOWLEDGE BASE
// =============================================================================
export function KnowledgeBase() {
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = filterArticles(KB_ARTICLES, search);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
      </div>
      <div className="relative mb-5">
        <Icon name="search" className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles, tags..."
          className="w-full bg-[#111827] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((a) => (
          <div key={a.id} onClick={() => setSelected(a)}
            className="bg-[#111827] border border-white/5 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all">
            <h3 className="text-white font-semibold text-sm mb-2">{a.title}</h3>
            <p className="text-zinc-400 text-xs mb-3 line-clamp-2">{a.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {a.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">{tag}</span>
                ))}
              </div>
              <span className="text-zinc-600 text-xs">{a.views} views</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-2 text-center py-10 text-zinc-600">No articles found.</div>}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-white font-semibold">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white"><Icon name="x" className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">{selected.content}</p>
              <div className="flex gap-1">
                {selected.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// USERS PAGE (Admin only)
// =============================================================================
export function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Icon name="plus" className="w-4 h-4" /> Add User
        </button>
      </div>
      <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {["User", "Email", "Role"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={u.avatar} size="md" />
                    <span className="text-white text-sm font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-zinc-400 text-sm">{u.email}</td>
                <td className="px-5 py-3">
                  <Badge label={u.role.replace("_", " ")} colorClass={ROLE_COLORS[u.role]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// NOTIFICATION BELL
// =============================================================================
export function NotificationBell({ tickets }) {
  const [open, setOpen] = useState(false);
  const alerts = getAlerts(tickets);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
        <Icon name="bell" className="w-5 h-5" />
        {alerts.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#111827] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 text-sm font-semibold text-white">Notifications</div>
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
            {alerts.length === 0 && <div className="px-4 py-5 text-zinc-500 text-sm text-center">All clear!</div>}
            {alerts.map((alert) => (
              <div key={alert.id} className="px-4 py-3 hover:bg-white/5 transition-colors">
                <div className={`text-xs mb-0.5 ${alert.type === "breach" ? "text-red-400" : "text-amber-400"}`}>
                  {alert.type === "breach" ? "⚠ SLA Breach" : "⚡ Needs Assignment"}
                </div>
                <div className="text-zinc-300 text-xs leading-snug">{alert.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
