type MediaPlaceholderProps = {
  label: string;
  ratio?: "standard" | "wide";
  dark?: boolean;
};

export function MediaPlaceholder({ label, ratio = "standard", dark = false }: MediaPlaceholderProps) {
  return (
    <div className={`media-placeholder is-${ratio}${dark ? " is-dark" : ""}`} role="img" aria-label={`Placeholder for ${label.toLowerCase()}`}>
      <span aria-hidden="true">JZ</span>
      <strong>{label}</strong>
      <small>{ratio === "wide" ? "21:9" : "16:9"} / ASSET PENDING</small>
    </div>
  );
}
