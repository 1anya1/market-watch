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
    button: {
      200: "#ffffff14",
      500: "#dee8f3",
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
    xxs: "24rem",
    ms: "490px",
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
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
          fontSize: { base: "14px", md: "18px" },
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
        medium: {
          fontWeight: 600,
          fontSize: "12px",
          textTransform:'uppercase'
        },
        'xxs-text':{
          fontSize:'10px',
          fontWeight:600,
          color:'#a0aec0'
        }
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
              : "2px solid 081c3b",
         
      
          // backgroundColor: props.colorMode === "dark" ? "#123364" : "white",
          backgroundColor: props.colorMode === "dark" ? "  #051329" : "white",
          padding: { base: "14px", md: "20px" },
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

        // bgColor: (props: StyleFunctionProps) => ({
        //   bgColor: props.colorMode === "light" ? "#cae5ff" : "#295789",
        // }),
        // color: props.colorMode === "light" ? "black" : "white",
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
        hollow: {
          bg: "unset",
          border: "1px solid whites !important",
        },
        large: (props: StyleFunctionProps) => ({
          height: "40px",
          bgColor: props.colorMode === "light" ? "#e7ecf1" : "#133364",
        }),
        "large-blue": (props: StyleFunctionProps) => ({
          height: "40px",
          color: "white",
          bgColor: props.colorMode === "light" ? "#1099fa" : "#133364",
        }),

        medium: (props: StyleFunctionProps) => ({
          height: "32px",
          bgColor: props.colorMode === "light" ? "#e7ecf1" : "#133364",
          border:
            props.colorMode === "light"
              ? "1.5px solid #e7ecf1"
              : " 1.5px solid #133364",
        }),
        "medium-hollow": (props: StyleFunctionProps) => ({
          height: "32px",
          border:
            props.colorMode === "light"
              ? "1px solid #e7ecf1"
              : " 1px solid #133364",
          bgColor: "transparent",
        }),
      },
    },
    Menu: {
      baseStyle: {
        list: {
          fontWeight: "700",
          bg: "#081c3b",
          minW: "max-content",
        },
      },
    },
    Modal: {
      baseStyle: (props: StyleFunctionProps) => ({
        dialog: {
          bg: props.colorMode === "light" ? "white" : "#081c3b",
          width: { base: "97vw", lg: "550px" },
          maxWidth: "550px !important",
        },
        overlay: {
          bg: props.colorMode === "light" ? "#000000a8" : "#000000db",
        },
      }),
    },
    Popover: {
      baseStyle: (props: StyleFunctionProps) => ({
        content: {
          fontWeight: "500",
          bg: props.colorMode === "light" ? "#e7ecf1" : "#123364",
          minW: "max-content",
          outline: "none",
          "--popper-bg": "#133364",
          _focus_visible: {
            boxShadow: "none !important",
            outline: "none !important",
          },
        },
        dialog: {
          _focus_visible: {
            boxShadow: "none !important",
            outline: "none !important",
          },
        },
        body: {
          display: "flex",
          flexDir: "column",
          spacing: "0",
          padding: "10px 20px",
          gap: "6px",
          _focus_visible: {
            boxShadow: "none !important",
            outline: "none !important",
          },
        },
      }),
    },
  },
});
export default theme;
