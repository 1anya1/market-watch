import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/theme";
import Navigation from "../src/components/navigation";
import { AuthContextProvider } from "../context/AuthContext";
import Footer from "../src/components/footer";
import Head from "next/head";

// set up get initial props to get the list of all the currecnt crypti listings
// useful link https://stackoverflow.com/questions/72069612/unable-to-use-getstaticprops-in-app-js
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <Navigation>
          <Head>
            <title>Crypto X-Change App</title>
          </Head>
          <Component {...pageProps} />
        </Navigation>
        <Footer />
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
