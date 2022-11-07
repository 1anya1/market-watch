import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({
  config,
  styles: {
    global: {
      // styles for the `body`
      body: {
        padding: {
          base: "0 4%",
          sm: "0 6%",
          md: "0 8%",
          lg: "0 10%",
          xl: "0 14%",
        },
      },
    },
  },
});
export default theme;
