import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../data/categories";

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.path;
        return (
          <button
            key={item.path}
            type="button"
            className={`bottom-nav-item${active ? " bottom-nav-item--on" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon weight="duotone" size={21} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
