import { Text, HStack } from "@chakra-ui/react";
import HomepageTable from "../src/components/table/homepage-table";
import NewsFeed from "../src/components/news-feed";
import SwiperAutoplayComponent from "../src/components/swiper-autoplay";
import CoinSearch from "../src/components/search/coin-search";
import Header from "../src/components/header";
import { GetStaticProps } from "next";

const Home = (props: any) => {
  
  return (
    <>
      <Header title="Top Coins" />
      <SwiperAutoplayComponent />
      <HomepageTable numCoins={props?.globalMetrics?.data?.active_cryptocurrencies} />
      <NewsFeed />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const hour = 60 * 60 * 24;
  const reqGlobalMetrics = await fetch(
    "https://api.coingecko.com/api/v3/global"
  );

  const globalMetrics = await reqGlobalMetrics.json();

  return {
    props: {
      globalMetrics,
    },

    revalidate: hour,
  };
};

export default Home;
