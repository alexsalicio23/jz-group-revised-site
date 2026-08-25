import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const qualifications = [
  { value: "1998", label: "Legacy begins" },
  { value: "JZ To Confirm", label: "Completed projects" },
  { value: "Florida", label: "Licensed" },
  { value: "Ready", label: "Insured and bondable" },
  { value: "Statewide", label: "Florida coverage" },
  { value: "JZ To Confirm", label: "Safety performance" },
] as const;

export function QualificationBand() {
  return (
    <section className="qualification-band" aria-labelledby="qualification-band-title">
      <header>
        <h2 id="qualification-band-title">A Group You Can Qualify</h2>
        <Link href="/safety">
          Review qualifications <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </header>
      <dl>
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
