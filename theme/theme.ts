import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({
  config,
  fonts: {
    body: `'Manrope', sans-serif;`,
    // body: `'Montserrat', sans-serif`,
  },
  colors: {
    green: "#039F65",
    red: "#F13D3D",
    buttons: {
      50: "#e4f3ff",
      100: "#c1d9f2",
      200: "#9cbee3",
      300: "#76a4d5",
      400: "#5189c8",
      500: "#3770ae",
      600: "#295789",
      700: "#1b3e63",
      800: "#0b253e",
      900: "#000d1b",
    },
    trial: {
      blue: "#000d1b",
      500: "#3770ae",
    },
  },
  styles: {
    global: {
      // styles for the `body`
      body: (props: StyleFunctionProps) => ({
        padding: {
          base: "0 4% !important",
          sm: "0 3% !important",
          md: "0 4% !important",
        },
        maxW: "1800px !important",
        m: "0 auto",

        // backgroundColor: props.colorMode === "dark" ? "#343444" : "#ebebeb",
      }),
      div: {
        marginInlineStart: "0",
        marginTop: 0,
      },
      a: (props: StyleFunctionProps) => ({
        color: props.colorMode === "light" ? "#1099fa " : "#4983C6",
        fontWeight: 900,
      }),
    },
  },
  breakpoints: {
    xs: "320px",
    ms: "490px",
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
          fontSize: { base: "16px", sm: "20px" },
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
        "med-text-bold": {
          fontSize: "18px",
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
        toast: {
          fontSize: "12px",
          fontWeight: 600,
        },
        body: {
          fontSize: { base: "16px", sm: "18px" },
        },
        "small-font": {
          fontSize: "12px",
          fontWeight: "500",
        },
        "price-tip": {
          fontWeight: 700,
          fontSize: "12px",
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
      variants: {
        "input-fields": {
          spacing: 0,
          gap: "4px",
          width: "100%",
        },
      },
    },
    Container: {
      variants: {
        "box-component": (props: StyleFunctionProps) => ({
          boxShadow: "base",
          border:
            props.colorMode === "light"
              ? ".75px  solid #dddfe1"
              : "2px solid #133364",
          // backgroundColor: props.colorMode === "dark" ? "#123364" : "#f5f6fa",
          backgroundColor: props.colorMode === "dark" ? "#123364" : "white",
          padding: "20px",
          borderRadius: "11px",
          maxW: "unset",
        }),
      },
    },
    Progress: {
      baseStyle: (props: StyleFunctionProps) => ({
        filledTrack: {
          bg:
            props.colorMode === "light"
              ? "#1099fa !important"
              : "#4983C6 !important",
        },
        track: {
          bg: props.colorMode === "light" ? "#dddfe0" : "#3b547d",
        },
      }),
    },

    Button: {
      defaultProps: {
        // bgColor: props.colorMode === "light" ? "#cae5ff" : "#295789",
        // colorScheme: "buttons", // default is gray
        // bgColor: (props: StyleFunctionProps) => ({
        //   bgColor: props.colorMode === "light" ? "#cae5ff" : "#295789",
        // }),

        height: "32px",
        size: "sm",
      },
      variants: {
        authentication: {
          border: "unset",
          bg: "none",
          outline: "none",
          borderRadius: "0",
        },
        blue: (props: StyleFunctionProps) => ({
          bgColor: props.colorMode === "light" ? "#cae5ff" : "#295789",
        }),
      },
    },
  },
});
export default theme;
