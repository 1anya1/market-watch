import {
  Text,
  Container,
  Menu,
  MenuButton,
  HStack,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { validateArgCount } from "@firebase/util";
import { validateHeaderValue } from "http";
import { GetServerSideProps, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import router from "next/router";
import { SetStateAction, useCallback, useEffect, useState } from "react";
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
  console.log(marketCapData, topTen, defi, global);
  // const [global, setGlobal] = useState<any>(null);
  // const [defi, setDefi] = useState<any>(null);
  // const [topTen, setTopTen] = useState<any>(null);
  const [marketCapChartData, setMarketCapChartData] = useState<any>(null);

  // useEffect(() => {
  //   console.log("calling these damn apiss");
  //   Promise.all([
  //     fetch("https://api.coingecko.com/api/v3/global"),
  //     fetch(
  //       "https://api.coingecko.com/api/v3/global/decentralized_finance_defi"
  //     ),
  //     fetch(
  //       "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h%2C7d%2C30d"
  //     ),
  //   ])
  //     .then(async ([resGlobal, resDefi, resTopTen]) => {
  //       const g = await resGlobal.json();
  //       const d = await resDefi.json();
  //       const a = await resTopTen.json();

  //       return [g, d, a];
  //     })
  //     .then((data) => {
  //       setGlobal(data[0].data);
  //       setDefi(data[1].data);
  //       setTopTen(data[2]);
  //     });
  // }, []);

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

    // const handelTimeFrame = (val: number) => {
    //   setDays(val);
    //   router.replace(
    //     {
    //       pathname: "/global",
    //       query: {
    //         timeFrame: val,
    //       },
    //     },
    //     undefined,
    //     {
    //       shallow: false,
    //     }
    //   );
    // };

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
    const idx = timeFrameOptions.findIndex((el) => el.query === timeSelect);
    console.log(idx);
    const data = marketCapData[idx].stats.map((el: any[]) => {
      return { time: el[0] / 1000, value: el[1] };
    });
    const volume = marketCapData[idx].total_volumes.map((el: any[]) => {
      return { time: el[0] / 1000, value: el[1] };
    });
    setMarketCapChartData({ data, volume });
  }, [marketCapData, setMarketCapChartData, timeSelect]);

  useEffect(() => {
    if (topTen && global) {
      console.log(topTen);
    }
  }, [global, topTen]);
  return (
    <>
      <Text variant="h-2" pb="20px">
        Global Data
      </Text>
      {global && topTen && (
        <DoughnutChart global={global.data} topTen={topTen} />
      )}
      {marketCapChartData?.volume && (
        <Container
          w={{ base: "100%", lg: "calc(50% - 10px)" }}
          // h={{ base: "490px", md: "650px", lg: "640px" }}
          variant="box-component"
          position="relative"
        >
          <Chart
            volume={marketCapChartData.volume}
            data={marketCapChartData.data}
            renderTimeSelection={renderTimeSelection}
          />
        </Container>
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
      "https://www.coingecko.com/market_cap/total_charts_data?duration=7&locale=en&vs_currency=usd"
    ).then((res) => res.json()),
    ,
    await fetch(
      "https://www.coingecko.com/market_cap/total_charts_data?duration=14&locale=en&vs_currency=usd"
    ).then((res) => res.json()),
    ,
    await fetch(
      "https://www.coingecko.com/market_cap/total_charts_data?duration=30&locale=en&vs_currency=usd"
    ).then((res) => res.json()),
    ,
    await fetch(
      "https://www.coingecko.com/market_cap/total_charts_data?duration=60&locale=en&vs_currency=usd"
    ).then((res) => res.json()),
    ,
    await fetch(
      "https://www.coingecko.com/market_cap/total_charts_data?duration=90&locale=en&vs_currency=usd"
    ).then((res) => res.json()),
    ,
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
  const global = await resGlobal.json();
  const defi = await resFInanceDefi.json();
  const topTen = await markets.json();

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
