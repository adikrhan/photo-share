const userIcon = (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <mask
      id="mask0_80_757"
      style="mask-type:alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="30"
      height="30"
    >
      <rect width="30" height="30" fill="url(#pattern0)" />
    </mask>
    <g mask="url(#mask0_80_757)">
      <circle cx="15" cy="15" r="15" fill="#0B4F71" />
    </g>
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlink:href="#image0_80_757" transform="scale(0.0078125)" />
      </pattern>
      <image
        id="image0_80_757"
        width="128"
        height="128"
        xlink:href="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export default userIcon;