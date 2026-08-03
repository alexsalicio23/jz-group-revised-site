type MediaPlaceholderProps = {
  label: string;
  ratio?: "standard" | "wide";
  inverse?: boolean;
  className?: string;
};

export function MediaPlaceholder({
  label,
  ratio = "standard",
  inverse = false,
  className = "",
}: MediaPlaceholderProps) {
  return (
    <div
      className={`v3-media-placeholder v3-media-placeholder-${ratio}${inverse ? " is-inverse" : ""} ${className}`.trim()}
      role="img"
      aria-label={`Placeholder for ${label.toLowerCase()}`}
    >
      <span className="v3-media-placeholder-index" aria-hidden="true">JZ</span>
      <span>{label}</span>
      <small>{ratio === "wide" ? "21:9" : "16:9"} / ASSET PENDING</small>
    </div>
  );
}
