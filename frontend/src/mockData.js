// =============================================================================
// MOCK USERS
// =============================================================================
export const MOCK_USERS = [
  { id: "u1", name: "Alice Chen",  email: "alice@corp.com", role: "admin",    avatar: "AC" },
  { id: "u2", name: "Bob Rivera",  email: "bob@corp.com",   role: "it_staff", avatar: "BR" },
  { id: "u3", name: "Carol Kim",   email: "carol@corp.com", role: "it_staff", avatar: "CK" },
  { id: "u4", name: "Dave Patel",  email: "dave@corp.com",  role: "user",     avatar: "DP" },
  { id: "u5", name: "Eva Russo",   email: "eva@corp.com",   role: "user",     avatar: "ER" },
];

// =============================================================================
// MOCK CONFIGURATION ITEMS (CMDB)
// =============================================================================
export const MOCK_CIS = [
  {
    id: "ci1", name: "CustomerPortal", type: "Application", status: "Running",
    owner: "u1", metadata: { version: "3.2.1", language: "Node.js" }, relationships: ["ci3", "ci4"],
  },
  {
    id: "ci2", name: "BillingService", type: "Application", status: "Running",
    owner: "u2", metadata: { version: "2.1.0", language: "Java" }, relationships: ["ci3", "ci5"],
  },
  {
    id: "ci3", name: "PostgreSQL-Main", type: "Database", status: "Running",
    owner: "u2", metadata: { version: "14.5", engine: "PostgreSQL" }, relationships: ["ci5"],
  },
  {
    id: "ci4", name: "AppServer-01", type: "Server", status: "Running",
    owner: "u3", metadata: { cpu: "16 cores", ram: "64GB" }, relationships: ["ci5"],
  },
  {
    id: "ci5", name: "AWS-EC2-Prod", type: "Cloud Service", status: "Running",
    owner: "u3", metadata: { region: "us-east-1", tier: "m5.xlarge" }, relationships: [],
  },
  {
    id: "ci6", name: "Redis-Cache", type: "Database", status: "Degraded",
    owner: "u2", metadata: { version: "7.0", engine: "Redis" }, relationships: ["ci4"],
  },
  {
    id: "ci7", name: "APIGateway", type: "Application", status: "Running",
    owner: "u1", metadata: { version: "1.5.0", type: "Kong" }, relationships: ["ci1", "ci2"],
  },
];

// =============================================================================
// MOCK TICKETS
// =============================================================================
export const MOCK_TICKETS = [
  {
    id: "t1", title: "Login page unresponsive after deployment",
    description: "Users cannot log into the portal since today's 9AM deployment.",
    priority: "Critical", category: "Incident", status: "In Progress",
    assignee: "u2", reporter: "u4", ciId: "ci1",
    createdAt: "2026-03-22T09:15:00Z", updatedAt: "2026-03-23T08:00:00Z",
    sla: { responseTarget: 1, resolutionTarget: 4, breached: false },
    comments: [{ id: "c1", user: "u2", text: "Investigating deployment logs now.", ts: "2026-03-22T09:30:00Z" }],
  },
  {
    id: "t2", title: "Database connection pool exhausted",
    description: "PostgreSQL is throwing max_connection errors. All apps affected.",
    priority: "High", category: "Incident", status: "Open",
    assignee: null, reporter: "u2", ciId: "ci3",
    createdAt: "2026-03-23T06:00:00Z", updatedAt: "2026-03-23T06:00:00Z",
    sla: { responseTarget: 2, resolutionTarget: 8, breached: true },
    comments: [],
  },
  {
    id: "t3", title: "Request: New user onboarding accounts",
    description: "Please create accounts for 5 new hires starting Monday.",
    priority: "Low", category: "Service Request", status: "Open",
    assignee: "u3", reporter: "u5", ciId: null,
    createdAt: "2026-03-20T14:00:00Z", updatedAt: "2026-03-20T14:00:00Z",
    sla: { responseTarget: 8, resolutionTarget: 48, breached: false },
    comments: [],
  },
  {
    id: "t4", title: "Redis cache hit rate dropping",
    description: "Cache efficiency dropped from 92% to 34% over the past 12 hours.",
    priority: "Medium", category: "Incident", status: "Resolved",
    assignee: "u2", reporter: "u3", ciId: "ci6",
    createdAt: "2026-03-21T11:00:00Z", updatedAt: "2026-03-22T16:00:00Z",
    sla: { responseTarget: 4, resolutionTarget: 24, breached: false },
    comments: [{ id: "c2", user: "u2", text: "Flushed stale keys, restored to 89% hit rate.", ts: "2026-03-22T15:50:00Z" }],
  },
  {
    id: "t5", title: "SSL certificate expiring in 7 days",
    description: "Production SSL cert for customerportal.corp.com expires March 30.",
    priority: "High", category: "Change Request", status: "Open",
    assignee: "u3", reporter: "u1", ciId: "ci4",
    createdAt: "2026-03-23T07:00:00Z", updatedAt: "2026-03-23T07:00:00Z",
    sla: { responseTarget: 2, resolutionTarget: 24, breached: false },
    comments: [],
  },
];

// =============================================================================
// KNOWLEDGE BASE ARTICLES
// =============================================================================
export const KB_ARTICLES = [
  {
    id: "kb1", title: "How to rotate SSL certificates in AWS",
    content: "Step 1: Generate new cert via ACM. Step 2: Associate with load balancer. Step 3: Verify DNS propagation. Step 4: Remove old cert after 48h.",
    tags: ["ssl", "aws", "security"], views: 142,
  },
  {
    id: "kb2", title: "PostgreSQL connection pool tuning guide",
    content: "Set max_connections based on RAM: (RAM - 1GB) / 10MB per connection. Use PgBouncer for connection pooling in high-traffic environments.",
    tags: ["postgres", "database", "performance"], views: 89,
  },
  {
    id: "kb3", title: "Redis eviction policy best practices",
    content: "Use allkeys-lru for cache-only scenarios. Set maxmemory to 75% of available RAM. Monitor evicted_keys metric in Redis INFO stats.",
    tags: ["redis", "cache", "tuning"], views: 67,
  },
];
