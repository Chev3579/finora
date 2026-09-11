interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  style?: React.CSSProperties;
  itemStyle?: (value: T, active: boolean) => React.CSSProperties | undefined;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
  itemStyle,
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)`, ...style }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className={`segmented-item${active ? " segmented-item--on" : ""}`}
            style={itemStyle?.(o.value, active)}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
