/**
 * Painted 2D layers behind and in front of the 3D scene: the room, an arched
 * window with a soft pastel view, sunlight on the floor and a blurred
 * foreground plant. Kept in SVG/CSS so they cost nothing to render.
 */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__wall" />
      <svg className="backdrop__window" viewBox="0 0 600 640" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="bd-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C9C3EC" />
            <stop offset="0.45" stopColor="#EBCFE0" />
            <stop offset="0.75" stopColor="#FBE2D2" />
            <stop offset="1" stopColor="#FDEBD8" />
          </linearGradient>
          <radialGradient id="bd-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF4C6" />
            <stop offset="0.62" stopColor="#FCE7A6" />
            <stop offset="1" stopColor="#FCE7A6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bd-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A9CFEA" />
            <stop offset="1" stopColor="#7FB6DC" />
          </linearGradient>
          <linearGradient id="bd-reveal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFCF6" />
            <stop offset="1" stopColor="#EADFCF" />
          </linearGradient>
          <clipPath id="bd-arch">
            <path d="M70 600 V250 A180 180 0 0 1 430 250 V600 Z" />
          </clipPath>
        </defs>

        {/* The reveal (wall depth) of the arch */}
        <path d="M44 620 V246 A206 206 0 0 1 456 246 V620 Z" fill="url(#bd-reveal)" />
        <g clipPath="url(#bd-arch)">
          <rect x="0" y="0" width="600" height="640" fill="url(#bd-sky)" />
          <circle cx="268" cy="360" r="104" fill="url(#bd-sun)" />
          <circle cx="268" cy="360" r="58" fill="#FCE9AE" opacity="0.9" />
          <path d="M70 420 C 130 372 190 360 236 392 C 270 414 300 418 340 412 L 430 404 V470 H70 Z" fill="#9AA9CF" opacity="0.85" />
          <path d="M70 436 C 120 410 170 404 220 418 L 300 430 L 430 426 V470 H70 Z" fill="#8C9CC6" opacity="0.7" />
          <rect x="70" y="436" width="360" height="170" fill="url(#bd-sea)" />
          <path d="M70 452 H430" stroke="#D9EDF8" strokeWidth="3" opacity="0.7" />
          <path d="M110 486 H300 M160 512 H380 M90 540 H250" stroke="#D3E8F6" strokeWidth="2.4" opacity="0.6" />
          {/* foliage */}
          <g fill="#8FBF8C">
            <circle cx="72" cy="168" r="58" />
            <circle cx="118" cy="132" r="42" />
            <circle cx="60" cy="236" r="40" />
            <circle cx="88" cy="520" r="52" />
            <circle cx="130" cy="560" r="44" />
            <circle cx="420" cy="430" r="44" />
            <circle cx="396" cy="486" r="50" />
            <circle cx="430" cy="540" r="58" />
          </g>
          <g fill="#A9D0A2">
            <circle cx="104" cy="150" r="26" />
            <circle cx="70" cy="214" r="22" />
            <circle cx="116" cy="508" r="28" />
            <circle cx="404" cy="452" r="26" />
          </g>
          <g fill="#F2B9A9" opacity="0.8">
            <circle cx="150" cy="548" r="10" />
            <circle cx="380" cy="512" r="9" />
          </g>
        </g>
        {/* sill */}
        <path d="M30 600 H470 L462 624 H38 Z" fill="#F7F1E7" />
      </svg>
      <div className="backdrop__floor" />
      <div className="backdrop__sun" />
      <div className="backdrop__shade" />
    </div>
  );
}

export function ForegroundPlant() {
  return (
    <svg className="plant" viewBox="0 0 300 260" aria-hidden="true">
      <g fill="#7DAF7E">
        <ellipse cx="70" cy="150" rx="62" ry="30" transform="rotate(-38 70 150)" />
        <ellipse cx="150" cy="120" rx="58" ry="26" transform="rotate(-70 150 120)" />
        <ellipse cx="200" cy="170" rx="60" ry="26" transform="rotate(-20 200 170)" />
      </g>
      <g fill="#94C493">
        <ellipse cx="110" cy="190" rx="70" ry="30" transform="rotate(-12 110 190)" />
        <ellipse cx="40" cy="210" rx="56" ry="28" transform="rotate(20 40 210)" />
        <ellipse cx="230" cy="220" rx="52" ry="24" transform="rotate(14 230 220)" />
      </g>
      <g fill="#6A9D6F">
        <ellipse cx="160" cy="210" rx="44" ry="20" transform="rotate(-48 160 210)" />
      </g>
    </svg>
  );
}
