import { Box, HStack, Text } from "@chakra-ui/react";
import HomepageTable from "../src/components/table/homepage-table";
import NewsFeed from "../src/components/news-feed";
import SwiperAutoplayComponent from "../src/components/swiper-autoplay";
import CoinSearch from "../src/components/search/coin-search";
import Header from "../src/components/header";
import { GetStaticProps } from "next";
import { numericFormatter } from "react-number-format";
import PercentChangeBox from "../src/components/percent-change-box";

const Home = (props: any) => {
  const { globalMetrics } = props;

  const numberFormater = () => {
    const value = globalMetrics.data.total_market_cap.usd;
    if (value < 1e3) return value.bold();
    if (value > 1e9) return (value / 1e9).toFixed(2) + "B";
    if (value > 1e6) return (value / 1e6).toFixed(2) + "M";
    if (value >= 1e3) return +(value / 1e3).toFixed(1) + "K";
  };

  return (
    <Box pb="40px">
      {/* <Text variant="h-1">
        Todays Coins
      </Text> */}
      <HStack flexWrap="wrap" spacing="0" gap="10px" pb='28px'>
        <span>The global crypto market cap is</span>
        <span style={{fontWeight:'bold'}}>{`$${numberFormater()}`}</span>
        <span>a</span>
        <PercentChangeBox
          val={globalMetrics.data.market_cap_change_percentage_24h_usd}
        />
        <span>
          {globalMetrics.data.market_cap_change_percentage_24h_usd > 0
            ? "increase"
            : "decrease"}{" "}
          over the last 24 hrs.
        </span>
      </HStack>
      <Text variant="h-3" pb="10px">
        Trending Coins
      </Text>
      <SwiperAutoplayComponent />
      <HomepageTable
        numCoins={props?.globalMetrics?.data?.active_cryptocurrencies}
      />
    </Box>
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
