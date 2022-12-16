import { Text, HStack } from "@chakra-ui/react";
import HomepageTable from "../src/components/table/homepage-table";
import NewsFeed from "../src/components/news-feed";
import SwiperAutoplayComponent from "../src/components/swiper-autoplay";
import CoinSearch from "../src/components/search/coin-search";
import Header from "../src/components/header";

const Home = () => {
  return (
    <>
      <Header title="Top Coins" />
      <SwiperAutoplayComponent />
      <HomepageTable />
      <NewsFeed />
    </>
  );
};

export default Home;
