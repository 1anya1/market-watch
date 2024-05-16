import { Box, HStack, Text } from "@chakra-ui/react";
import HomepageTable from "../src/components/table/homepage-table";
import SwiperAutoplayComponent from "../src/components/swiper-autoplay";
import { GetStaticProps } from "next";
import numberFormater from "../helper-functions/number-formatter";
import Link from "next/link";
import { getData } from "../lib/market-assets";

const Home = (props: any) => {
  const {
    tableData,
    topMovers,
    marketCap,
    percentageChange,
    activeCryptoCurrencies,
  } = props;

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
            >{`$${numberFormater(marketCap)}`}</span>
          </Link>{" "}
          a{" "}
          <Link href="/global" passHref>
            <span style={{ fontWeight: "bold", cursor: "pointer" }}>
              {percentageChange?.toFixed(2)}%
            </span>
          </Link>{" "}
          {percentageChange > 0 ? "increase" : "decrease"} over the last 24 hrs.
        </Text>
      </HStack>
      <HomepageTable
        tableData={tableData}
        activeCryptoCurrencies={activeCryptoCurrencies}
      />
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apiKey = process.env.COINBASE_API;
  const headers = {
    "x-cg-demo-api-key": apiKey ?? "",
  };

  try {
    const globalMetrics = await getData(
      "Global-Metrics",
      "https://api.coingecko.com/api/v3/global"
    );

    const marketCap = globalMetrics.data.total_market_cap?.usd;
    const percentageChange =
      globalMetrics.data.market_cap_change_percentage_24h_usd;
    const activeCryptoCurrencies = globalMetrics.data.active_cryptocurrencies;

    const tableData = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`,
      { headers }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`An error occurred: ${res.statusText}`);
        }
        return res.json();
      })
      .catch((e) => {
        console.error("Failed to fetch crypto data:", e);
        return [];
      });

    const strTopMovers = await fetch(
      "https://price-api.crypto.com/price/v1/top-movers?depth=10&tradable_on=EXCHANGE-OR-APP"
    ).then(async (res) => {
      if (!res.ok) {
        throw new Error(`An error occurred: ${res.statusText}`);
      }
      const movers = await res.json();
      const arr: string[] = movers.map((el: { name: string }) =>
        el.name.replace(/[\. ,:-]+/g, "-").toLowerCase()
      );
      return arr.join("%2C");
    });

    const topMovers = await getData(
      "Top-Movers",
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${strTopMovers}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
    );

    return {
      props: {
        tableData,
        topMovers,
        marketCap,
        percentageChange,
        activeCryptoCurrencies,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        tableData: [],
        topMovers: [],
        marketCap: null,
        percentageChange: null,
        activeCryptoCurrencies: null,
      },
    };
  }
};

export default Home;
