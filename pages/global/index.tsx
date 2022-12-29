import {
  Text,
  Container,
  Menu,
  MenuButton,
  HStack,
  MenuList,
  MenuItem,
  Box,
  Divider,
  Stack,
  useColorMode,
  Grid,
} from "@chakra-ui/react";

import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import numberFormater from "../../helper-functions/number-formatter";
import DoughnutChart from "../../src/components/doughnut-chart";
import FormattedNumber from "../../src/components/number-formatter";
const Chart = dynamic(() => import("../../src/components/charts/mini-chart"), {
  ssr: false,
});

//Total Crypto Market Chartthe total market cap & volume of cryptocurrencies globally, a result of 12,907 cryptocurrencies tracked across 617 exchanges.
// time frames include 24h 7d 14d 30d 90d

// https://www.coingecko.com/market_cap/total_charts_data?duration=1&locale=en&vs_currency=usd

const GlobalData = (props: any) => {
  const { marketCapData, topTen, defi, global } = props;
  const { colorMode } = useColorMode();

  const [marketCapChartData, setMarketCapChartData] = useState<any>(null);

  const [timeSelect, setDays] = useState(1);
  const timeFrameOptions = [
    { query: 1, name: "24 Hrs" },
    { query: 7, name: "7 Days" },
    { query: 14, name: "14 Days" },
    { query: 30, name: "30 Days" },
    { query: 60, name: "60 Days" },
    { query: 90, name: "90 Days" },
    { query: 0, val: "max", name: "Max" },
  ];

  const renderTimeSelection = useCallback(() => {
    const currentVal = () => {
      const val = timeFrameOptions.filter((el) => el.query === timeSelect);
      return val[0].name;
    };

    return (
      <Menu>
        <MenuButton>
          <HStack>
            <Text>{currentVal()}</Text>

            <AiOutlineDown size={12} style={{ strokeWidth: "20" }} />
          </HStack>
        </MenuButton>
        <MenuList zIndex="14">
          {timeFrameOptions.map((el) => (
            <MenuItem
              key={el.query}
              onClick={() => setDays(el.query)}
              bg={
                el.query === timeSelect ? "rgba(255, 255, 255, 0.06)" : "unset"
              }
              _focus={{ bg: "unset" }}
            >
              {el.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }, [timeSelect]);

  useEffect(() => {
    if (timeSelect === 1) {
      const data = marketCapData[0]?.stats.map((el: any[]) => ({
        time: el[0] / 1000,
        value: el[1],
      }));
      const volume = marketCapData[0]?.total_volumes.map((el: any[]) => ({
        time: el[0] / 1000,
        value: el[1],
      }));
      setMarketCapChartData({ data, volume });
    } else if (timeSelect === 0) {
      const data = marketCapData[1]?.stats.map((el: any[]) => ({
        time: el[0] / 1000,
        value: el[1],
      }));
      const volume = marketCapData[1]?.total_volumes.map((el: any[]) => ({
        time: el[0] / 1000,
        value: el[1],
      }));
      setMarketCapChartData({ data, volume });
    } else {
      const timeFrame = timeSelect * (60 * 60 * 24);
      const date = new Date().getTime();
      const filerDate = date / 1000 - timeFrame;
      const data = marketCapData[1]?.stats
        .map((el: any[]) => ({
          time: el[0] / 1000,
          value: el[1],
        }))
        .filter((el: { time: number }) => el.time >= filerDate);
      const volume = marketCapData[1].total_volumes
        .map((el: any[]) => ({
          time: el[0] / 1000,
          value: el[1],
        }))
        .filter((el: { time: number }) => el.time >= filerDate);

      setMarketCapChartData({ data, volume });
    }
  }, [marketCapData, setMarketCapChartData, timeSelect]);

  return (
    <>
      <Text variant="h-2" pb="10px">
        Global Market
      </Text>
      <Text pb="20px">
        The total market cap represents data from{" "}
        {global?.data?.active_cryptocurrencies} cryptocurrencies tracked across{" "}
        {global?.data?.markets} market exchanges.
      </Text>

      {topTen && global && (
        <Grid
          w={{ base: "100%", lg: "900px" }}
          gap="10px"
          gridTemplateColumns={{
            base: "1fr",
            fold: "1fr 1fr",
            med: "1fr 1fr 1fr",
            lg: "repeat(6, 1fr)",
          }}
          borderRadius="10px"
          mb="20px"
          justifyItems="center"
        >
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Total Market Cap
            </Text>
            <Text variant="h-5" textAlign="center">
              {global?.data?.market_cap_change_percentage_24h_usd.toFixed(2)}%{" "}
            </Text>
          </Box>
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Active Coins
            </Text>
            <Text variant="h-5" textAlign="center">
              {global?.data?.active_cryptocurrencies}{" "}
            </Text>
          </Box>
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Total Markets
            </Text>
            <Text variant="h-5" textAlign="center">
              {global?.data?.markets}{" "}
            </Text>
          </Box>
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              24H Volume
            </Text>
            <Text variant="h-5" textAlign="center">
              $
              {numberFormater(
                marketCapData[0]?.total_volumes[
                  marketCapData[0]?.total_volumes.length - 1
                ][1]
              )}
            </Text>
          </Box>
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Market Cap
            </Text>
            <Text variant="h-5" textAlign="center">
              $
              {numberFormater(
                marketCapData[0]?.stats[marketCapData[0]?.stats?.length - 1][1]
              )}
            </Text>
          </Box>
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Dominance
            </Text>
            <Text variant="h-5" textAlign="center">
              BTC: {global?.data?.market_cap_percentage?.btc.toFixed(0)}%
            </Text>
          </Box>
        </Grid>
      )}

      {marketCapChartData?.volume && (
        <Container
          w="100%"
          variant="box-component"
          position="relative"
          mb="20px"
          pb="40px"
        >
          <Chart
            volume={marketCapChartData?.volume}
            data={marketCapChartData?.data}
            renderTimeSelection={renderTimeSelection}
          />
        </Container>
      )}
      {global && topTen && (
        <DoughnutChart global={global.data} topTen={topTen} />
      )}
    </>
  );
};

// export async function getStaticPaths() {
//   // Get the paths we want to pre-render based on posts
//   const paths = [...Array(10)].map((_, b) => ({ params: { id: b } }));

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false };
// }

export const getStaticProps: GetStaticProps = async () => {
  // const { query } = context;

  const reqMarketCapCharts = await Promise.all([
    await fetch(
      "https://www.coingecko.com/market_cap/total_charts_data?duration=1&locale=en&vs_currency=usd"
    ).then((res) => res.json()),
    await fetch(
      "https://www.coingecko.com/market_cap/total_charts_data?locale=en&vs_currency=usd"
    ).then((res) => res.json()),
    ,
  ]);
  const resGlobal = await fetch("https://api.coingecko.com/api/v3/global");
  const resFInanceDefi = await fetch(
    "https://api.coingecko.com/api/v3/global/decentralized_finance_defi"
  );
  const markets = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h%2C7d%2C30d"
  );
  const reqTopMovers = await fetch(
    "https://price-api.crypto.com/price/v1/top-movers?direction=1&depth=20"
  );
  const global = await resGlobal.json();
  const defi = await resFInanceDefi.json();
  const topTen = await markets.json();
  const topMovers = await reqTopMovers.text();

  const marketCapData = reqMarketCapCharts.filter((el) => el !== undefined);

  return {
    props: {
      marketCapData,
      global: global?.status?.error_code === 429 ? null : global,
      defi: defi?.status?.error_code === 429 ? null : defi,
      topTen: topTen?.status?.error_code === 429 ? null : topTen,
    },

    revalidate: 60 * 60 * 24,
  };
};

export default GlobalData;
