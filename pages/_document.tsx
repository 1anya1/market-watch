import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import theme from "../theme/theme";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" >
        <Head >
          {/* <link rel="manifest" href="/manifest.json" /> */}
          <link rel="apple-touch-icon" href="/icon.png" />
          <meta name="theme-color" content="#fff" />
          <meta name="description" content="Crypto exchange app built with Next.js v12 and CoinGecko API." />
          
        </Head>
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main  />
          <NextScript />
        </body>
      </Html>
    );
  }
}
