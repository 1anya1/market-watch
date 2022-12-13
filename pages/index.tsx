import Head from "next/head";
import { Box, Text } from "@chakra-ui/react";
import HomepageTable from "../src/components/table/homepage-table";
import NewsFeed from "../src/components/news-feed";

import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/pagination";
import SwiperAutoplayComponent from "../src/components/swiper-autoplay";

const Home = (props: any) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h"
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  const [globalValues, setGlobalValues] = useState<any>(null);
  const [topMovers, setTopMovers] = useState<any[]>([]);
  useEffect(() => {
    Promise.all([
      fetch(
        "https://price-api.crypto.com/price/v1/top-movers?depth=10&tradable_on=EXCHANGE-OR-APP"
      ),
      fetch("https://price-api.crypto.com/price/v1/global-metrics"),
    ])

      .then(async ([resMovers, resGlobal]) => {
        const movers = await resMovers.json();
        const global = await resGlobal.json();
        return [movers, global];
      })
      .then(([movers, global]) => {
        setGlobalValues(global.data);
        const arr: string[] = [];
        movers.forEach((el: { name: string }) =>
          arr.push(el.name.replace(/[\. ,:-]+/g, "-").toLowerCase())
        );

        const str = arr.join("%2C");
        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${str}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
        )
          .then((res) => res.json())
          .then((data) => {
            setTopMovers(data);
          });
      });
  }, []);

  return (
    <Box>
      <Text variant="h-3" pt="40px">
        Top Movers
      </Text>
      <SwiperAutoplayComponent data={topMovers} />
      <HomepageTable />
      <NewsFeed />
    </Box>
  );
};

export default Home;
// export const getStaticProps: GetStaticProps<any> = async (context) => {
//   const res = await fetch(`${window.location.origin}/api/newsfeed`);
//   console.log(res);
//   const topMovers = await res.text();
//   console.log(topMovers);

//   return {
//     props: {
//       topMovers,
//     },
//     revalidate: 120,
//   };
// };
