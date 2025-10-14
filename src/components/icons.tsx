import type { LucideProps } from "lucide-react";

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
      >
      <rect width="256" height="256" fill="none"/>
      <path d="M168,224l-48-96-48,96,48-24Z" opacity="0.2"/>
      <path d="M128,24a104,104,0,1,0,104,104A104.1,104.1,0,0,0,128,24Zm40,200L120,128,72,224l56-28,40,28Z" fill="currentColor"/>
    </svg>
  ),
};
