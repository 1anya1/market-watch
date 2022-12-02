import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/theme";
import Navigation from "../src/components/navigation";
import { AuthContextProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <Navigation>
          <Component {...pageProps} />
        </Navigation>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
