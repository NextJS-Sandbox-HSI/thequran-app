
export default function TheQuranLogo({ width = 200, height = 60 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="43 10 115 35"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text
        x="45"
        y="25"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="600"
        fill="#10b981"
        filter="url(#glow)"
      >
        the
      </text>
      <text
        x="68"
        y="25"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="#10b981"
        filter="url(#glow)"
      >
        quran
      </text>
      <text
        x="118"
        y="25"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="600"
        fill="#10b981"
        filter="url(#glow)"
      >
        app
      </text>

      <text
        x="45"
        y="42"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fill="#94a3b8"
        opacity="0.8"
      >
        Digital Quran Experience
      </text>
    </svg>
  );
}
