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
          sm: "0 3%",
          md: "0 4%",
        },
        maxW: "2200px",
        m: "0 auto",

        // backgroundColor: props.colorMode === "dark" ? "#343444" : "#ebebeb",
      }),
      div: {
        marginInlineStart: "0",
        marginTop: 0,
      },
      a: {
        color: "#90cdf5",
        fontWeight: 700,
      },
    },
  },
  breakpoints: {
    xs: "320px",
  },
  components: {
    InputLeftAddon: {
      variants: {
        "bold-small": {
          fontSize: { base: "14px", sm: "16px", md: "20px" },
          fontWeight: 700,
        },
      },
    },
    Text: {
      variants: {
        "h-1": {
          fontSize: "34px",
          fontWeight: 700,
        },
        "h-2": {
          fontSize: { base: "28px", sm: "34px" },
          fontWeight: 700,
          
        },
        "h-3": {
          fontSize: { base: "24px", sm: "26px" },
          fontWeight: "700",
          pb: "20px",
        },
        "h-4": {
          fontSize: { base: "16px", sm: "18px" },
          fontWeight: "700",
        },
        "h-5": {
          fontSize: { base: "12px", sm: "16px" },
          fontWeight: "600",
        },
        "text-bold": {
          fontSize: "14px",
          fontWeight: "700",
        },
        "small-bold": {
          fontSize: "12px",
          fontWeight: "700",
        },
        "bold-small": {
          fontSize: { base: "14px", sm: "16px", md: "20px" },
          fontWeight: 700,
        },
        "bold-xsmall": {
          fontSize: { base: "12px", sm: "14px", md: "18px" },
          fontWeight: 700,
        },
        body: {
          fontSize: { base: "16px", sm: "18px" },
        },
      },
    },
    Stack: {
      baseStyle: {
        margin: "0 !important",
        spacing: "0px",
      },
    },
    HStack: {
      baseStyle: {
        margin: "0 !important",
        spacing: "0px",
      },
    },
    VStack: {
      baseStyle: {
        margin: "0 !important",
        spacing: "0px",
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
    Progress: {
      variants: {
        "bar.200": {
          // backgroundColor: "linear-gradient(90deg, hsla(0, 100%, 50%, 1) 0%, hsla(60, 100%, 50%, 1) 50%, hsla(120, 100%, 50%, 1) 100%)"
          bg: "purple",
        },
      },
    },
  },
  colors: {
    green: "#039F65",
    red: "#F13D3D",
  },
});
export default theme;
