import * as React from "react";

export default React.memo(LoaderAnimation)

function LoaderAnimation(){
  return(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 125 211"
      className="mask mask-diamond relative w-[125px] h-[211px]"
    >
      <defs>
	<clipPath id="clip-path">
	  <circle
	    id="mask"
	    cx={105.5}
	    cy={105.5}
	    r={105.5}
	    transform="translate(312 -1822)"
	    fill="#fff"
	    stroke="#707070"
	    strokeWidth={1}
	  />
	</clipPath>
      </defs>
	    <defs>
	  <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
	    <stop offset="0%" stopColor="oklch(var(--p))" />
	    <stop offset="100%" stopColor="oklch(var(--s))" />
	  </linearGradient>
      </defs>
      <g id="circle" transform="translate(-312 1822)">
	<g
	  id="bg"
	  transform="translate(312 -1822)"
    	  className="fill-transparent"
	>
	  <circle cx={105.5} cy={105.5} r={105.5} stroke="none" />
	  <circle cx={105.5} cy={105.5} r={105} fill="none" />
	</g>
	<g id="water" clipPath="url(#clip-path)">
	  <path
	    id="waveShape"
	    d="M500,118.244v223.11H4V106.464c43.35,1.17,46.02,11.89,94.4,11.89,51.2,0,51.2-12,102.39-12s51.2,12,102.4,12,51.2-12,102.41-12C453.98,106.354,456.65,117.074,500,118.244Z"
	    transform="translate(308 -1830.354)"
    	    style={{
	      fill: "url(#grad3)"
	    }}
	  />
	</g>
      </g>
    </svg>
  )
};
