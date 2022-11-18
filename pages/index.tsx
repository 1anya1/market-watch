import Head from "next/head";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import DataTable from "../src/components/table";
import NewsFeed from "../src/components/news-feed";
import Navigation from "../src/components/navigation";

const Chart = dynamic(() => import("../src/components/chart"), {
  ssr: false,
});

const Home = () => {
  return (
    <>
      <Navigation />
      <Box>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Chart coinId="bitcoin" />
        <DataTable />
        <NewsFeed />
      </Box>
    </>
  );
};

export default Home;
