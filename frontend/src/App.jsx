import { useState } from "react";
import { MOCK_TICKETS } from "./mockData";
import { AssetManagement } from "./pages";
import {
  LoginPage,
  Sidebar,
  Dashboard,
  TicketList,
  CMDBView,
  ImpactAnalysis,
  KnowledgeBase,
  UsersPage,
  NotificationBell,
} from "./pages";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage]               = useState("dashboard");
  const [tickets, setTickets]         = useState(MOCK_TICKETS);

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  const pageComponents = {
    dashboard: <Dashboard      tickets={tickets} currentUser={currentUser} />,
    tickets:   <TicketList     tickets={tickets} setTickets={setTickets} currentUser={currentUser} />,
    cmdb:      <CMDBView       currentUser={currentUser} />,
    impact:    <ImpactAnalysis tickets={tickets} />,
    kb:        <KnowledgeBase />,
    users:     <UsersPage />,
    assets: <AssetManagement currentUser={currentUser} />,
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] flex" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>
      <Sidebar
        currentPage={page}
        setPage={setPage}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 bg-[#0a0c14]/80 backdrop-blur sticky top-0 z-40">
          <div className="text-zinc-400 text-sm capitalize">{page.replace("_", " ")}</div>
          <NotificationBell tickets={tickets} />
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {pageComponents[page] ?? pageComponents.dashboard}
        </main>
      </div>
    </div>
  );
}
