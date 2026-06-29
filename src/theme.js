import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "var(--font-family)",
    heading: "var(--font-family)",
  },
  colors: {
    brand: {
      50: "#f5f8ff",
      100: "#d8e5ff",
      200: "#b8cffd",
      300: "#8cb2f7",
      400: "#5e8ee8",
      500: "#00308f",
      600: "#0d2760",
      700: "#0b214f",
    },
  },
  radii: {
    lg: "18px",
    xl: "24px",
    "2xl": "28px",
    "3xl": "32px",
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          borderRadius: "2xl",
          borderWidth: "1px",
          borderColor: "brand.100",
          boxShadow: "0 22px 44px -34px rgba(13, 59, 102, 0.32)",
        },
      },
    },
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      baseStyle: {
        borderRadius: "full",
        fontWeight: "700",
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "700",
      },
    },
  },
});

export default theme;
