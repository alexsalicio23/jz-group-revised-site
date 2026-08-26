import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const qualifications = [
  { value: "1998", label: "Legacy begins" },
  { value: "Florida", label: "Licensed" },
  { value: "Ready", label: "Insured and bondable" },
  { value: "Statewide", label: "Florida coverage" },
] as const;

export function QualificationBand() {
  return (
    <section className="qualification-band" aria-labelledby="qualification-band-title">
      <header>
        <div>
          <h2 id="qualification-band-title">Qualifications</h2>
          <p>Verified credentials and supporting records are available for prequalification review.</p>
        </div>
        <Link href="/safety">
          Review qualifications <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </header>
      <dl className="qualification-ledger">
        {qualifications.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
