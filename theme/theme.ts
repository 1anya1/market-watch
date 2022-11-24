import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({
  config,
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Montserrat', sans-serif`,
  },
  styles: {
    global: {
      // styles for the `body`
      body: (props: StyleFunctionProps) => ({
        padding: {
          base: "0 4%",
          sm: "0 6%",
        },
        maxW: "2200px",
        m: "0 auto",
        // backgroundColor: props.colorMode === "dark" ? "#343444" : "#ebebeb",
      }),
    },
  },
  components: {
    Text: {
      variants: {
        "h-2": {
          fontSize: "28px",
          FontSize: 700,
        },
        "h-3": {
          fontSize: "24px",
          fontWeight: "700",
          pb: "20px",
        },
        "h-4": {
          fontSize: "20px",
          fontWeight: "700",
        },
        "h-5": {
          fontSize: "16px",
          fontWeight: "600",
        },
        "text-bold": {
          fontSize: "14px",
          fontWeight: "700",
        },
      },
    },
    Container: {
      variants: {
        "box-component": (props: StyleFunctionProps) => ({
          backgroundColor: props.colorMode === "dark" ? "#123364" : "#f5f6fa",
          padding: "20px",
          borderRadius: "11px",
          maxW: "unset",
        }),
      },
    },
  },
  colors: {
    green: "#039F65",
    red: "#F13D3D",
  },
});
export default theme;
