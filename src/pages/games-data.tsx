import type { ReactNode } from "react";

export type Game = {
  id: string;
  name: string;
  href: string;
  glyph: ReactNode;
  c1: string;
  c2: string;
};

// Add new games to the end of this list. People who have saved a custom
// order will see new games appear at the bottom of their layout.
export const GAMES: Game[] = [
  {
    id: "slide",
    name: "Slide",
    href: "#",
    c1: "#232838",
    c2: "#161a26",
    glyph: (
      <>
        <rect className="f" x="3" y="3" width="5" height="5" rx="1" />
        <rect className="f" x="9.5" y="3" width="5" height="5" rx="1" />
        <rect className="f" x="16" y="3" width="5" height="5" rx="1" />
        <rect className="f" x="3" y="9.5" width="5" height="5" rx="1" />
        <rect className="f" x="16" y="9.5" width="5" height="5" rx="1" />
        <rect className="f" x="3" y="16" width="5" height="5" rx="1" />
        <rect className="f" x="9.5" y="16" width="5" height="5" rx="1" />
        <rect className="f" x="16" y="16" width="5" height="5" rx="1" />
      </>
    ),
  },
  {
    id: "plumb",
    name: "Plumb",
    href: "#",
    c1: "#2a2c30",
    c2: "#1b1d20",
    glyph: (
      <>
        <path d="M3 7h6a3 3 0 0 1 3 3v4a3 3 0 0 0 3 3h6" />
        <path d="M15 3v4" />
        <circle className="f" cx="3" cy="7" r="1.6" />
        <circle className="f" cx="21" cy="17" r="1.6" />
      </>
    ),
  },
  {
    id: "lumen",
    name: "Lumen",
    href: "#",
    c1: "#24272d",
    c2: "#17191d",
    glyph: (
      <>
        <circle className="f" cx="5" cy="5" r="2.2" />
        <circle cx="12" cy="5" r="2.2" />
        <circle className="f" cx="19" cy="5" r="2.2" />
        <circle cx="5" cy="12" r="2.2" />
        <circle className="f" cx="12" cy="12" r="2.2" />
        <circle cx="19" cy="12" r="2.2" />
        <circle className="f" cx="5" cy="19" r="2.2" />
        <circle cx="12" cy="19" r="2.2" />
        <circle className="f" cx="19" cy="19" r="2.2" />
      </>
    ),
  },
  {
    id: "knots",
    name: "Knots",
    href: "#",
    c1: "#2c2f36",
    c2: "#1c1e23",
    glyph: (
      <>
        <path d="M8 4c-4 0-5 5-2 8l6 6c3 3 8 2 8-2s-5-5-8-2l-6 6" />
        <path d="M8 4c3 0 5 3 4 6" />
      </>
    ),
  },
  {
    id: "mesa",
    name: "Mesa",
    href: "#",
    c1: "#1f2433",
    c2: "#141824",
    glyph: (
      <>
        <rect className="f" x="7" y="5" width="10" height="4" rx="1" />
        <rect className="f" x="4" y="10.5" width="16" height="4" rx="1" />
        <rect className="f" x="2" y="16" width="20" height="4" rx="1" />
      </>
    ),
  },
  {
    id: "pairs",
    name: "Pairs",
    href: "#",
    c1: "#2a2b2e",
    c2: "#1a1b1d",
    glyph: (
      <>
        <rect
          x="3"
          y="5"
          width="9"
          height="13"
          rx="2"
          transform="rotate(-8 7.5 11.5)"
        />
        <rect
          className="f"
          x="12"
          y="5"
          width="9"
          height="13"
          rx="2"
          transform="rotate(8 16.5 11.5)"
        />
      </>
    ),
  },
  {
    id: "letters",
    name: "Letters",
    href: "#",
    c1: "#262a33",
    c2: "#181b21",
    glyph: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 17l4-10 4 10M9.6 13h4.8" />
      </>
    ),
  },
  {
    id: "sums",
    name: "Sums",
    href: "#",
    c1: "#2b2d31",
    c2: "#1b1c1f",
    glyph: (
      <>
        <path d="M12 4v16M4 12h16" />
        <circle className="f" cx="6" cy="6" r="1.4" />
        <circle className="f" cx="18" cy="18" r="1.4" />
      </>
    ),
  },
  {
    id: "shift",
    name: "Shift",
    href: "#",
    c1: "#222737",
    c2: "#151925",
    glyph: <path d="M4 9h13l-3-3M20 15H7l3 3" />,
  },
  {
    id: "mirage",
    name: "Mirage",
    href: "#",
    c1: "#29292c",
    c2: "#19191b",
    glyph: (
      <>
        <circle className="f" cx="12" cy="9" r="4" />
        <path d="M3 16c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M5 20c2-1 3.5-1 5 0s3.5 1 5 0" />
      </>
    ),
  },
  {
    id: "orbit",
    name: "Orbit",
    href: "#",
    c1: "#252a34",
    c2: "#171a20",
    glyph: (
      <>
        <circle className="f" cx="12" cy="12" r="3" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.5"
          transform="rotate(-25 12 12)"
        />
      </>
    ),
  },
  {
    id: "tangle",
    name: "Tangle",
    href: "#",
    c1: "#2a2d33",
    c2: "#1a1c20",
    glyph: (
      <>
        <path d="M5 6l14 12M19 6L5 18M5 12h14" />
        <circle className="f" cx="5" cy="6" r="2" />
        <circle className="f" cx="19" cy="6" r="2" />
        <circle className="f" cx="5" cy="18" r="2" />
        <circle className="f" cx="19" cy="18" r="2" />
        <circle className="f" cx="5" cy="12" r="2" />
        <circle className="f" cx="19" cy="12" r="2" />
      </>
    ),
  },
];
