const defaultTheme = require("tailwindcss/defaultTheme");

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  darkMode: "class",
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-scrollbar"),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      animation: {
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
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "text-in": {
          "0%": { opacity: 0, transform: "translateY(.5em)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "ul, ol": {
              "li:before": {
                display: "none",
              },
            },
            blockquote: {
              p: {
                color: theme("colors.gray.400"),
              },
            },
            pre: {
              backgroundColor: theme("colors.gray.200"),
              color: theme("colors.gray.700"),
            },
            code: {
              color: theme("colors.gray.700"),
              padding: theme("spacing.1"),
              fontSize: rem(18),
            },
            "code::before": {
              content: "",
            },
            "code::after": {
              content: "",
            },
            a: {
              color: theme("colors.gray.600"),
              backgroundColor: theme("colors.gray.200"),
              paddingLeft: theme("spacing.1"),
              paddingRight: theme("spacing.1"),
              "&:hover": {
                textDecoration: "none",
              },
            },
          },
        },
        dark: {
          css: {
            color: theme("colors.gray.400"),
            blockquote: {
              p: {
                color: theme("colors.gray.500"),
              },
            },
            a: {
              color: theme("colors.gray.300"),
              backgroundColor: theme("colors.gray.900"),
            },

            h1: {
              color: theme("colors.gray.300"),
            },
            h2: {
              color: theme("colors.gray.300"),
            },
            h3: {
              color: theme("colors.gray.300"),
            },
            h4: {
              color: theme("colors.gray.300"),
            },
            h5: {
              color: theme("colors.gray.300"),
            },
            h6: {
              color: theme("colors.gray.300"),
            },

            strong: {
              color: theme("colors.gray.300"),
            },

            pre: {
              backgroundColor: theme("colors.gray.900"),
            },

            code: {
              color: theme("colors.gray.300"),
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
    typography: ["dark", "responsive"],
    scrollbar: ["dark", "hover"],
    opacity: ["dark"],
    extend: {
      opacity: ["hover"],
      ringWidth: ["hover"],
      textColor: ["visited"],
    },
  },
};
