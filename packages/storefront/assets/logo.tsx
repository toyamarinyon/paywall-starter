import React from "react";

export function Logo({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="40"
      viewBox="0 0 260 55"
      className={className}
    >
      <text
        id="PAYWALL"
        transform="translate(0 42)"
        fill="#151515"
        fontSize="55"
        fontFamily="Helvetica-BoldOblique, Helvetica"
        fontWeight="700"
        fontStyle="oblique"
      >
        <tspan x="0" y="0">
          PAYWALL
        </tspan>
      </text>
    </svg>
  );
}
