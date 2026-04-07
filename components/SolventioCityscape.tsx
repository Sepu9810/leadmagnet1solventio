type SolventioCityscapeProps = {
  className?: string;
  trackClassName?: string;
};

export function SolventioCityscape({
  className = "",
  trackClassName = "",
}: SolventioCityscapeProps) {
  const containerClassName = ["solventio-cityscape", className]
    .filter(Boolean)
    .join(" ");
  const cityTrackClassName = ["cityscape-track", trackClassName]
    .filter(Boolean)
    .join(" ");

  const CityTile = ({ offset }: { offset: number }) => (
    <svg
      className="city-tile"
      viewBox="0 0 800 200"
      style={{ left: `${offset}px` }}
      aria-hidden="true"
    >
      <line
        x1="0"
        y1="170"
        x2="800"
        y2="170"
        stroke="rgba(139,92,246,0.25)"
        strokeWidth="1.5"
      />

      <rect
        x="20"
        y="50"
        width="60"
        height="120"
        rx="3"
        fill="rgba(139,92,246,0.12)"
        stroke="rgba(167,139,250,0.35)"
        strokeWidth="1"
      />
      <rect x="30" y="60" width="12" height="8" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="50" y="60" width="12" height="8" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="30" y="78" width="12" height="8" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="50" y="78" width="12" height="8" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="30" y="96" width="12" height="8" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="50" y="96" width="12" height="8" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="30" y="114" width="12" height="8" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="50" y="114" width="12" height="8" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect
        x="38"
        y="140"
        width="24"
        height="30"
        rx="2"
        fill="rgba(139,92,246,0.08)"
        stroke="rgba(167,139,250,0.2)"
        strokeWidth="0.8"
      />
      <line x1="50" y1="40" x2="50" y2="50" stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
      <circle cx="50" cy="38" r="3" fill="rgba(196,181,253,0.4)">
        <animate
          attributeName="opacity"
          values="0.4;0.8;0.4"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      <rect
        x="100"
        y="90"
        width="45"
        height="80"
        rx="3"
        fill="rgba(167,139,250,0.1)"
        stroke="rgba(139,92,246,0.3)"
        strokeWidth="1"
      />
      <rect x="108" y="98" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="125" y="98" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="108" y="112" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="125" y="112" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="108" y="126" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="125" y="126" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />

      <g transform="translate(170,138)">
        <rect
          x="0"
          y="8"
          width="30"
          height="22"
          rx="3"
          fill="rgba(167,139,250,0.15)"
          stroke="rgba(139,92,246,0.4)"
          strokeWidth="1"
        />
        <path
          d="M8 8 L8 4 Q8 1 11 1 L19 1 Q22 1 22 4 L22 8"
          fill="none"
          stroke="rgba(139,92,246,0.35)"
          strokeWidth="1"
        />
        <line x1="0" y1="18" x2="30" y2="18" stroke="rgba(139,92,246,0.2)" strokeWidth="0.8" />
      </g>

      <rect
        x="230"
        y="30"
        width="55"
        height="140"
        rx="3"
        fill="rgba(139,92,246,0.1)"
        stroke="rgba(167,139,250,0.3)"
        strokeWidth="1"
      />
      <rect x="240" y="40" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="260" y="40" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="240" y="55" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="260" y="55" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="240" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="260" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="240" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="260" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="240" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="260" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="240" y="115" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="260" y="115" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <line x1="257" y1="18" x2="257" y2="30" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" />

      <g transform="translate(310,120)">
        <rect x="0" y="28" width="12" height="22" rx="2" fill="rgba(196,181,253,0.2)" />
        <rect x="18" y="16" width="12" height="34" rx="2" fill="rgba(167,139,250,0.25)" />
        <rect x="36" y="6" width="12" height="44" rx="2" fill="rgba(139,92,246,0.3)" />
        <polyline
          points="6,26 24,14 42,4"
          fill="none"
          stroke="rgba(250,204,21,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="42" cy="4" r="2.5" fill="rgba(250,204,21,0.6)" />
      </g>

      <rect
        x="380"
        y="110"
        width="40"
        height="60"
        rx="3"
        fill="rgba(167,139,250,0.08)"
        stroke="rgba(139,92,246,0.25)"
        strokeWidth="1"
      />
      <rect x="388" y="118" width="8" height="5" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="402" y="118" width="8" height="5" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="388" y="130" width="8" height="5" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="402" y="130" width="8" height="5" rx="1" fill="rgba(196,181,253,0.25)" />

      <g transform="translate(440,100)">
        <rect
          x="0"
          y="20"
          width="50"
          height="50"
          rx="2"
          fill="rgba(139,92,246,0.1)"
          stroke="rgba(167,139,250,0.3)"
          strokeWidth="1"
        />
        <rect
          x="10"
          y="5"
          width="8"
          height="15"
          fill="rgba(139,92,246,0.08)"
          stroke="rgba(167,139,250,0.25)"
          strokeWidth="0.8"
        />
        <rect
          x="30"
          y="10"
          width="8"
          height="10"
          fill="rgba(139,92,246,0.08)"
          stroke="rgba(167,139,250,0.25)"
          strokeWidth="0.8"
        />
        <circle cx="14" cy="3" r="3" fill="rgba(167,139,250,0.1)">
          <animate attributeName="cy" values="3;-2;3" dur="3s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0.1;0.2;0.1"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="25" cy="45" r="8" fill="none" stroke="rgba(196,181,253,0.3)" strokeWidth="1" />
        <circle cx="25" cy="45" r="3" fill="rgba(196,181,253,0.2)" />
      </g>

      <rect
        x="520"
        y="80"
        width="70"
        height="90"
        rx="3"
        fill="rgba(139,92,246,0.1)"
        stroke="rgba(167,139,250,0.3)"
        strokeWidth="1"
      />
      <rect x="530" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="548" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="566" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="530" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="548" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="566" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="530" y="116" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="548" y="116" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="566" y="116" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <circle cx="555" cy="145" r="8" fill="none" stroke="rgba(196,181,253,0.25)" strokeWidth="1" />
      <ellipse cx="555" cy="145" rx="8" ry="3" fill="none" stroke="rgba(196,181,253,0.2)" strokeWidth="0.5" />

      <g transform="translate(620,142)">
        <rect
          x="0"
          y="6"
          width="24"
          height="18"
          rx="3"
          fill="rgba(167,139,250,0.12)"
          stroke="rgba(139,92,246,0.35)"
          strokeWidth="1"
        />
        <path
          d="M7 6 L7 3 Q7 1 9 1 L15 1 Q17 1 17 3 L17 6"
          fill="none"
          stroke="rgba(139,92,246,0.3)"
          strokeWidth="0.8"
        />
      </g>

      <rect
        x="670"
        y="60"
        width="50"
        height="110"
        rx="3"
        fill="rgba(139,92,246,0.1)"
        stroke="rgba(167,139,250,0.3)"
        strokeWidth="1"
      />
      <rect x="678" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="698" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="678" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="698" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="678" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="698" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="678" y="115" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="698" y="115" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />

      <circle cx="165" cy="158" r="8" fill="rgba(74,222,128,0.08)" />
      <line x1="165" y1="166" x2="165" y2="170" stroke="rgba(74,222,128,0.15)" strokeWidth="1.5" />
      <circle cx="515" cy="160" r="7" fill="rgba(74,222,128,0.07)" />
      <line x1="515" y1="167" x2="515" y2="170" stroke="rgba(74,222,128,0.12)" strokeWidth="1.5" />
      <circle cx="760" cy="158" r="8" fill="rgba(74,222,128,0.08)" />
      <line x1="760" y1="166" x2="760" y2="170" stroke="rgba(74,222,128,0.15)" strokeWidth="1.5" />
    </svg>
  );

  return (
    <div className={containerClassName} aria-hidden="true">
      <div className={cityTrackClassName}>
        <CityTile offset={0} />
        <CityTile offset={800} />
        <CityTile offset={1600} />
      </div>
    </div>
  );
}
