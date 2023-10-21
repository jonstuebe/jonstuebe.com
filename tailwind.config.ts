import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const round = (num: number) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const rem = (px: number) => `${round(px / 16)}rem`;

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "water-drop":
          "water-drop 700ms ease-in-out 200ms 1 normal forwards running",
        "fade-in-quick":
          "fade-in 250ms ease-in-out 0s 1 normal forwards running",
        "fade-in": "fade-in 350ms ease-in-out 0s 1 normal forwards running",
        "fade-in-slow":
          "fade-in 500ms ease-in-out 0s 1 normal forwards running",
        "text-in-quick":
          "text-in 250ms ease-in-out 0s 1 normal forwards running",
        "text-in": "text-in 350ms ease-in-out 0s 1 normal forwards running",
        "text-in-slow":
          "text-in 500ms ease-in-out 0s 1 normal forwards running",
      },
      keyframes: {
        "water-drop": {
          "0%": {
            transform: "translateY(-.5em)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "text-in": {
          "0%": { opacity: "0", transform: "translateY(.5em)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.400"),
            "ul, ol": {
              "li:before": {
                display: "none",
              },
            },
            "h1, h2, h3, h4, h5, h6": {
              color: theme("colors.gray.300"),
            },
            a: {
              color: theme("colors.gray.300"),
              paddingLeft: theme("spacing.1"),
              paddingRight: theme("spacing.1"),
              backgroundColor: theme("colors.gray.900"),
              "&:hover": {
                textDecoration: "none",
              },
              code: {
                color: theme("colors.gray.300"),
              },
            },
            blockquote: {
              p: {
                color: theme("colors.gray.500"),
              },
            },
            strong: {
              color: theme("colors.gray.300"),
            },
            pre: {
              backgroundColor: theme("colors.gray.900"),
            },
            code: {
              color: theme("colors.gray.300"),
              padding: theme("spacing.1"),
              fontSize: rem(18),
            },
            "code::before": {
              content: "",
            },
            "code::after": {
              content: "",
            },
            figcaption: {
              color: theme("colors.gray.500"),
            },
          },
        },
      }),
    },
  },
  variants: {
    animation: ["motion-safe"],
    transitionProperty: ["motion-safe"],
    transition: ["motion-safe"],
    transform: ["motion-safe"],
    typography: ["responsive"],
    // scrollbar: ["hover"],
    opacity: [],
    extend: {
      opacity: ["hover"],
      ringWidth: ["hover"],
      textColor: ["visited"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // require("tailwindcss-scrollbar"),
  ],
} satisfies Config;
