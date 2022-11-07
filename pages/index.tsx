import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Box, Button, HStack, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
const Chart = dynamic(() => import("../src/components/chart"), {
  ssr: false,
});

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box>
      <HStack pt="20px" justifyContent='flex-end'>
        {colorMode === "light" ? (
          <MdDarkMode size={20} onClick={toggleColorMode} />
        ) : (
          <MdLightMode size={20} onClick={toggleColorMode} />
        )}
      </HStack>

      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Chart />
    </Box>
  );
};

export default Home;
