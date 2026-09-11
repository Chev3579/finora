import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { AppProvider } from "./context/AppProvider";
import { useApp } from "./context/useApp";
import { AddTransaction } from "./pages/AddTransaction";
import { Budget } from "./pages/Budget";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Onboarding } from "./pages/Onboarding";
import { Pricing } from "./pages/Pricing";
import { Settings } from "./pages/Settings";
import { TransactionList } from "./pages/TransactionList";
import { NAV_ITEMS } from "./data/categories";

function Shell() {
  const { onboarded } = useApp();
  const { pathname } = useLocation();
  const showNav = NAV_ITEMS.some((item) => item.path === pathname);

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
