import { extendTheme } from "@chakra-ui/react";

// Mirrors the CSS tokens in index.css so Chakra components and plain CSS agree.
const theme = extendTheme({
  fonts: {
    body: "var(--font-family)",
    heading: "var(--font-family)",
  },
  colors: {
    brand: {
      50: "#f3f6fd",
      100: "#e1e9fa",
      200: "#c3d3f3",
      300: "#93afe6",
      400: "#4f78cf",
      500: "#00308f",
      600: "#0a2a73",
      700: "#0b214f",
      800: "#0a1a3d",
      900: "#07122b",
    },
    ink: "#0f1b33",
    muted: "#5d6a82",
    line: "#dde4f0",
    wash: "#f5f7fb",
    gold: {
      100: "#fdf6d6",
      400: "#f6d33c",
      500: "#e9c21f",
    },
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
  },
  shadows: {
    outline: "0 0 0 3px rgba(0, 48, 143, 0.35)",
    raise: "0 12px 32px -18px rgba(11, 33, 79, 0.28)",
  },
  styles: {
    global: {
      body: {
        color: "#2b3550",
        bg: "white",
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "ink",
        fontWeight: "700",
        letterSpacing: "-0.01em",
      },
    },
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      baseStyle: {
        borderRadius: "full",
        fontWeight: "500",
      },
      variants: {
        solid: (props) =>
          props.colorScheme === "brand"
            ? {
                bg: "brand.500",
                color: "white",
                _hover: { bg: "brand.600", _disabled: { bg: "brand.500" } },
                _active: { bg: "brand.700" },
              }
            : {},
        outline: (props) =>
          props.colorScheme === "brand"
            ? {
                borderColor: "line",
                color: "brand.500",
                _hover: { bg: "brand.50", borderColor: "brand.200" },
              }
            : {},
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
      variants: {
        outline: {
          field: {
            borderRadius: "md",
            borderColor: "line",
            bg: "white",
            _hover: { borderColor: "#c7d3e6" },
          },
          addon: {
            borderRadius: "md",
            borderColor: "line",
            bg: "wash",
            color: "muted",
          },
        },
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
      variants: {
        outline: {
          field: {
            borderRadius: "md",
            borderColor: "line",
          },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "sm",
        fontWeight: "500",
        color: "ink",
        mb: 1.5,
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "500",
        textTransform: "none",
        letterSpacing: "0",
      },
    },
    Tabs: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
});

export default theme;
