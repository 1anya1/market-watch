import {
  Text,
  Container,
  Menu,
  MenuButton,
  HStack,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";

import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import DoughnutChart from "../../src/components/doughnut-chart";
const Chart = dynamic(() => import("../../src/components/charts/mini-chart"), {
  ssr: false,
});

//Total Crypto Market Chartthe total market cap & volume of cryptocurrencies globally, a result of 12,907 cryptocurrencies tracked across 617 exchanges.
// time frames include 24h 7d 14d 30d 90d

// https://www.coingecko.com/market_cap/total_charts_data?duration=1&locale=en&vs_currency=usd

const GlobalData = (props: any) => {
  const { marketCapData, topTen, defi, global } = props;

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
      const data = marketCapData[0].stats.map((el: any[]) => ({
        time: el[0] / 1000,
        value: el[1],
      }));
      const volume = marketCapData[0].total_volumes.map((el: any[]) => ({
        time: el[0] / 1000,
        value: el[1],
      }));
      setMarketCapChartData({ data, volume });
    } else if (timeSelect === 0) {
      const data = marketCapData[1].stats.map((el: any[]) => ({
        time: el[0] / 1000,
        value: el[1],
      }));
      const volume = marketCapData[1].total_volumes.map((el: any[]) => ({
        time: el[0] / 1000,
        value: el[1],
      }));
      setMarketCapChartData({ data, volume });
    } else {
      const timeFrame = timeSelect * (60 * 60 * 24);
      const date = new Date().getTime();
      const filerDate = date / 1000 - timeFrame;
      const data = marketCapData[1].stats
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
  // const totalVolume = () => {
  //   const sumValues = Object.values(global.data.total_volume).reduce(
  //     (a: number, b: number) => Number(a) + Number(b)
  //   );

  //   return sumValues;
  // };

  // const totalMarketCap = () => {
  //   const sumValues = Object.values(global.data.total_volume).reduce(
  //     (a: number, b: number) => Number(a) + Number(b)
  //   );
  // };

  return (
    <>
      <Text variant="h-2" pb="10px">
        Global Market
      </Text>
      <Text pb="20px">
        The total market cap represents data from{" "}
        {global.data.active_cryptocurrencies} cryptocurrencies tracked across{" "}
        {global.data.markets} market exchanges.
      </Text>
      <Box>
        <Box>
          <Text> Market Cap</Text>
          <Text>
            {global.data.market_cap_change_percentage_24h_usd.toFixed(2)}%{" "}
          </Text>
        </Box>
        <Box>
          <Text>Active Cryptocurrencies</Text>
          <Text>{global.data.active_cryptocurrencies} </Text>
        </Box>
        <Box>
          <Text>Markets/Exchanges</Text>
          <Text>{global.data.markets} </Text>
        </Box>
        <Box>
          <Text>24H Volume</Text>
          <Text>
            {marketCapData[0].total_volumes[
              marketCapData[0].total_volumes.length - 1
            ][1].toFixed(0)}
          </Text>
        </Box>
        <Box>
          <Text>Market Cap</Text>
          <Text>
            {marketCapData[0].stats[
              marketCapData[0].stats.length - 1
            ][1].toFixed(0)}{" "}
          </Text>
        </Box>
      </Box>
      {marketCapChartData?.volume && (
        <Container
          w="100%"
          // h={{ base: "490px", md: "650px", lg: "640px" }}
          variant="box-component"
          position="relative"
          mb="20px"
          pb="40px"
        >
          <Chart
            volume={marketCapChartData.volume}
            data={marketCapChartData.data}
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
  console.log("in here running");

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
      global,
      defi,
      topTen,
    },

    revalidate: 60 * 60 * 24,
  };
};

export default GlobalData;
