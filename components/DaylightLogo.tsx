"use client";

export default function DaylightLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bulb glass — outline only, transparent inside */}
      <path
        d="M50 12C34 12 21 25 21 41c0 10.5 5.5 19.8 13.8 25.2V72a2 2 0 0 0 2 2h26.4a2 2 0 0 0 2-2v-5.8C73.5 60.8 79 51.5 79 41 79 25 66 12 50 12z"
        stroke="#F05A28"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Base bands */}
      <line x1="35" y1="78" x2="65" y2="78" stroke="#F05A28" strokeWidth="4" strokeLinecap="round" />
      <line x1="38" y1="85" x2="62" y2="85" stroke="#F05A28" strokeWidth="4" strokeLinecap="round" />
      <line x1="43" y1="92" x2="57" y2="92" stroke="#F05A28" strokeWidth="4" strokeLinecap="round" />
      {/* Filament — small zigzag inside */}
      <polyline
        points="44,62 44,50 50,44 56,50 56,62"
        stroke="#F05A28"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
