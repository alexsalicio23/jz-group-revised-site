type PhotoPlaceholderProps = {
  className?: string;
  label: string;
  note: string;
};

export function PhotoPlaceholder({ className = "", label, note }: PhotoPlaceholderProps) {
  return (
    <div
      className={`jz-photo-placeholder ${className}`.trim()}
      role="img"
      aria-label={`${label} placeholder. ${note}`}
    >
      <span className="jz-photo-placeholder-mark" aria-hidden="true">JZ</span>
      <div>
        <strong>{label}</strong>
        <span>{note}</span>
      </div>
    </div>
  );
}
