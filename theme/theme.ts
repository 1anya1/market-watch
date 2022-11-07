import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
// import { StyleFunctionProps } from "@chakra-ui/theme-tools";

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
  colors: {
    green: "#039F65",
    red: "#F13D3D",
  },

  components: {
    //     Box: (props: StyleFunctionProps) => ({
    //       boxShadow: props.colorMode === "dark" ? "green" : "pink",
    //     }),
  },
});
export default theme;
