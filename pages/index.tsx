import Head from "next/head";
import dynamic from "next/dynamic";
import { Box, HStack, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import DataTable from "../src/components/table";
import NewsFeed from "../src/components/news-feed";

const Chart = dynamic(() => import("../src/components/chart"), {
  ssr: false,
});

const Home = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  console.log(process.env.NEWS_KEY);
  return (
    <Box>
      <HStack pt="20px" justifyContent="flex-end">
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
      <DataTable />
      <NewsFeed />
    </Box>
  );
};

export default Home;
