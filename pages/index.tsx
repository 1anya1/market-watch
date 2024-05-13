import { Box, HStack, Text } from "@chakra-ui/react";
import HomepageTable from "../src/components/table/homepage-table";
import SwiperAutoplayComponent from "../src/components/swiper-autoplay";
import { GetStaticProps } from "next";
import numberFormater from "../helper-functions/number-formatter";
import Link from "next/link";
import { getData } from "../lib/market-assets";

const Home = (props: any) => {
  const { globalMetrics, tableData , topMovers} = props;

  return (
    <Box className="main-page">
      <Text variant="h-3" pb="10px">
        Trending Coins
      </Text>
      <SwiperAutoplayComponent topMovers={topMovers} />
      <Text variant="h-3" pb="10px" pt={{ base: "30px", md: "40px" }}>
        Prices by Market Cap
      </Text>
      <HStack flexWrap="wrap" spacing="0" gap="10px" pb="10px">
        <Text fontSize="14px">
          The global crypto market cap is{" "}
          <Link href="/global" passHref>
            <span
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >{`$${numberFormater(
              globalMetrics?.data?.total_market_cap?.usd
            )}`}</span>
          </Link>{" "}
          a{" "}
          <Link href="/global" passHref>
            <span style={{ fontWeight: "bold", cursor: "pointer" }}>
              {globalMetrics?.data.market_cap_change_percentage_24h_usd?.toFixed(
                2
              )}
              %
            </span>
          </Link>{" "}
          {globalMetrics?.data.market_cap_change_percentage_24h_usd > 0
            ? "increase"
            : "decrease"}{" "}
          over the last 24 hrs.
        </Text>
      </HStack>
      <HomepageTable
        numCoins={props?.globalMetrics?.data?.active_cryptocurrencies}
        tableData={tableData}
      />
    </Box>
  );
};

// here we are getting server side rendering of the page
export const getStaticProps: GetStaticProps = async () => {
  const globalMetrics = await getData(
    "Global-Metrics",
    "https://api.coingecko.com/api/v3/global"
  );
  const tableData = await getData(
    "Table-Data",
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
  );
  const strTopMovers = await fetch(
    "https://price-api.crypto.com/price/v1/top-movers?depth=10&tradable_on=EXCHANGE-OR-APP"
  ).then(async (res) => {
    const movers = await res.json();
    const arr: string[] = [];
    movers.forEach((el: { name: string }) =>
      arr.push(el.name.replace(/[\. ,:-]+/g, "-").toLowerCase())
    );
    const str = arr.join("%2C");
    return str
  });

  const topMovers = await getData("Top-Movers",  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${strTopMovers}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`)

 
  return {
    props: {
      globalMetrics,
      tableData,
      topMovers
    },
  };
};

export default Home;
