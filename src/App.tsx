import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { AppProvider } from "./context/AppProvider";
import { useApp } from "./context/useApp";
import { AddTransaction } from "./pages/AddTransaction";
import { Budget } from "./pages/Budget";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Onboarding } from "./pages/Onboarding";
import { Pricing } from "./pages/Pricing";
import { Settings } from "./pages/Settings";
import { TransactionList } from "./pages/TransactionList";
import { NAV_ITEMS } from "./data/categories";

function Splash({ message }: { message: string }) {
  return (
    <div className="app-shell">
      <div className="screen screen--tint-a" style={{ display: "grid", placeItems: "center" }}>
        <span style={{ font: "500 13px/1.6 var(--ft)", color: "var(--ink3)", padding: "0 32px", textAlign: "center" }}>
          {message}
        </span>
      </div>
    </div>
  );
}

function Shell() {
  const { authenticated, onboarded, loading, error } = useApp();
  const { pathname } = useLocation();
  const showNav = NAV_ITEMS.some((item) => item.path === pathname);

  if (!authenticated) return <Login />;
  if (loading) return <Splash message="กำลังโหลดข้อมูล…" />;
  if (error && !onboarded) return <Splash message={error} />;

  if (!onboarded && pathname !== "/onboarding") return <Navigate to="/onboarding" replace />;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/list" element={<TransactionList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Shell />
      </Router>
    </AppProvider>
  );
}
