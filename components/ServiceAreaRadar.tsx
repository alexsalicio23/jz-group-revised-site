import { MapPin } from "lucide-react";

const coverageAreas = [
  { name: "Palm Beach", className: "service-area-palm" },
  { name: "Broward", className: "service-area-broward" },
  { name: "Miami-Dade", className: "service-area-miami" },
] as const;

export function ServiceAreaRadar() {
  return (
    <figure className="service-area-radar" aria-labelledby="service-area-title">
      <figcaption>
        <span>Operating corridor</span>
        <strong id="service-area-title">South Florida</strong>
      </figcaption>

      <div className="service-area-plot">
        <span className="service-area-ring service-area-ring-one" aria-hidden="true" />
        <span className="service-area-ring service-area-ring-two" aria-hidden="true" />
        <span className="service-area-ring service-area-ring-three" aria-hidden="true" />
        <span className="service-area-axis" aria-hidden="true" />

        {coverageAreas.map((area, index) => (
          <span className={`service-area-node ${area.className}`} key={area.name}>
            <i aria-hidden="true" />
            <b>{area.name}</b>
            <small>{String(index + 1).padStart(2, "0")}</small>
          </span>
        ))}

        <span className="service-area-hq">
          <MapPin aria-hidden="true" size={18} strokeWidth={1.7} />
          <span><strong>JZ Group</strong><small>Miami Lakes headquarters</small></span>
        </span>
      </div>
    </figure>
  );
}
