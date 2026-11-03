/**
 * Geometric line pattern after the side panel of the bus. A stand-in until the
 * wrap supplier's vector file arrives. Purely decorative: takes its colour from
 * the surrounding text colour. Same fixed order as the site's BusPattern.astro.
 */
type Vorm = "circle" | "arch" | "bowl" | "quarter" | "lines" | "bars" | "dots" | "triangle" | "cross";

const REEKS: Vorm[] = ["circle", "lines", "dots", "arch", "cross", "bars", "quarter", "bowl", "lines", "triangle", "dots", "circle", "bars"];
const CEL = 100;
const LIJNEN = [12.5, 25, 37.5, 50, 62.5, 75, 87.5];
const STIPPEN = [12.5, 31, 50, 69, 87.5];

export function BusPattern({ kolommen = 12, rijen = 2, className = "" }: { kolommen?: number; rijen?: number; className?: string }) {
  const lijn = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 };
  return (
    <svg className={`block h-full w-full ${className}`} viewBox={`0 0 ${kolommen * CEL} ${rijen * CEL}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {Array.from({ length: kolommen * rijen }, (_, i) => {
        const rij = Math.floor(i / kolommen);
        const kolom = i % kolommen;
        const vorm = REEKS[(kolom + rij * 5) % REEKS.length];
        return (
          <g key={i} transform={`translate(${kolom * CEL} ${rij * CEL})`}>
            <rect {...lijn} width={CEL} height={CEL} />
            {vorm === "circle" && <circle {...lijn} cx="50" cy="50" r="50" />}
            {vorm === "arch" && <path {...lijn} d="M0 100 V50 A50 50 0 0 1 100 50 V100" />}
            {vorm === "bowl" && <path {...lijn} d="M0 0 V50 A50 50 0 0 0 100 50 V0" />}
            {vorm === "quarter" && <path {...lijn} d="M0 0 A100 100 0 0 1 100 100" />}
            {vorm === "lines" && LIJNEN.map((o) => <line key={o} {...lijn} x1="0" x2="100" y1={o} y2={o} />)}
            {vorm === "bars" && LIJNEN.map((o) => <line key={o} {...lijn} y1="0" y2="100" x1={o} x2={o} />)}
            {vorm === "dots" && STIPPEN.flatMap((cx) => STIPPEN.map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="currentColor" />))}
            {vorm === "triangle" && <path {...lijn} d="M0 100 L50 0 L100 100" />}
            {vorm === "cross" && <path {...lijn} d="M0 0 L100 100 M100 0 L0 100" />}
          </g>
        );
      })}
    </svg>
  );
}
