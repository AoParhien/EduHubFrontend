import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "var(--font-family)",
    heading: "var(--font-family)",
  },
});

export default theme;