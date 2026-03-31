// Tailwind badge classes for ticket statuses
export const STATUS_COLORS = {
  "Open":        "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  "In Progress": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Resolved":    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "Closed":      "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30",
};

// Tailwind badge classes for ticket priorities
export const PRIORITY_COLORS = {
  "Critical": "bg-red-500/20 text-red-300 border border-red-500/30",
  "High":     "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  "Medium":   "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  "Low":      "bg-slate-500/20 text-slate-300 border border-slate-500/30",
};

// Text colour classes for CI types
export const CI_TYPE_COLORS = {
  "Application":   "text-violet-400",
  "Server":        "text-cyan-400",
  "Database":      "text-amber-400",
  "Cloud Service": "text-emerald-400",
};

// Tailwind badge classes for CI statuses
export const CI_STATUS_COLORS = {
  "Running":  "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "Degraded": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Down":     "bg-red-500/20 text-red-300 border border-red-500/30",
};

// Tailwind badge classes for user roles
export const ROLE_COLORS = {
  admin:    "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  it_staff: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  user:     "bg-slate-500/20 text-slate-300 border border-slate-500/30",
};

// Dropdown option lists
export const TICKET_STATUSES   = ["Open", "In Progress", "Resolved", "Closed"];
export const TICKET_PRIORITIES = ["Critical", "High", "Medium", "Low"];
export const TICKET_CATEGORIES = ["Incident", "Service Request", "Change Request", "Problem"];
export const CI_TYPES          = ["Application", "Server", "Database", "Cloud Service"];
export const CI_STATUSES       = ["Running", "Degraded", "Down"];

// SVG graph node positions (keyed by CI id)
export const GRAPH_POSITIONS = {
  ci1: { x: 200, y: 80  },
  ci2: { x: 500, y: 80  },
  ci3: { x: 350, y: 240 },
  ci4: { x: 150, y: 300 },
  ci5: { x: 350, y: 400 },
  ci6: { x: 600, y: 300 },
  ci7: { x: 350, y: 0   },
};

// Hex colours for graph nodes by CI type
export const GRAPH_NODE_COLORS = {
  "Application":   "#7c3aed",
  "Server":        "#0891b2",
  "Database":      "#d97706",
  "Cloud Service": "#059669",
};
