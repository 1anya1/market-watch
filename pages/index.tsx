import { Text } from "@chakra-ui/react";
import HomepageTable from "../src/components/table/homepage-table";
import NewsFeed from "../src/components/news-feed";
import SwiperAutoplayComponent from "../src/components/swiper-autoplay";

const Home = () => {
  return (
    <>
      <Text variant="h-3" pt="40px">
        Top Movers
      </Text>
      <SwiperAutoplayComponent />
      <HomepageTable />
      <NewsFeed />
    </>
  );
};

export default Home;
