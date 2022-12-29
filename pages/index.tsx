import { Box, HStack, Text } from "@chakra-ui/react";
import HomepageTable from "../src/components/table/homepage-table";
import SwiperAutoplayComponent from "../src/components/swiper-autoplay";
import { GetStaticProps } from "next";
import numberFormater from "../helper-functions/number-formatter";
import Link from "next/link";

const Home = (props: any) => {
  const { globalMetrics } = props;

  return (
    <Box className='main-page' >
      <Text variant="h-3" pb="10px">
        Trending Coins
      </Text>
      <SwiperAutoplayComponent />
      <Text variant="h-3" pb="10px" pt={{base:'30px', md:"40px"}}>
        Prices by Market Cap
      </Text>
      <HStack flexWrap="wrap" spacing="0" gap="10px" pb="10px">
        <Text fontSize='14px'>
          The global crypto market cap is{" "}
          <Link href="/global" passHref>
            <span
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >{`$${numberFormater(
              globalMetrics.data.total_market_cap.usd
            )}`}</span>
          </Link>{" "}
          a{" "}
          <Link href="/global" passHref>
            <span style={{ fontWeight: "bold", cursor: "pointer" }}>
              {globalMetrics.data.market_cap_change_percentage_24h_usd.toFixed(
                2
              )}
              %
            </span>
          </Link>{" "}
          {globalMetrics.data.market_cap_change_percentage_24h_usd > 0
            ? "increase"
            : "decrease"}{" "}
          over the last 24 hrs.
        </Text>
      </HStack>
      <HomepageTable
        numCoins={props?.globalMetrics?.data?.active_cryptocurrencies}
      />
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const hour = 60 * 60;
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
