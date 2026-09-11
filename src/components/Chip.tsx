import type { Icon } from "@phosphor-icons/react";

interface ChipProps {
  label: string;
  active?: boolean;
  tone?: "cy" | "mg";
  icon?: Icon;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Chip({ label, active = false, tone = "cy", icon: IconCmp, onClick, style }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip${active ? ` chip--on-${tone}` : ""}`}
      onClick={onClick}
      style={style}
    >
      {IconCmp && <IconCmp weight="duotone" size={15} />}
      {label}
    </button>
  );
}
