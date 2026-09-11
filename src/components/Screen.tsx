import type { ReactNode } from "react";

type Tint = "a" | "b" | "onboarding" | "pricing" | "none";

interface ScreenProps {
  children: ReactNode;
  tint?: Tint;
  withNav?: boolean;
  style?: React.CSSProperties;
  padded?: boolean;
}

export function Screen({ children, tint = "a", withNav = true, style, padded = true }: ScreenProps) {
  const tintClass = tint === "none" ? "" : ` screen--tint-${tint}`;
  return (
    <div className="app-shell">
      <div className={`screen${tintClass}`} style={style}>
        {padded ? (
          <div className={`screen-content${withNav ? "" : " screen-content--no-nav"}`}>{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
