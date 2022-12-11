import Head from "next/head";
import dynamic from "next/dynamic";
import { Box, HStack, Text, useColorMode, Stack } from "@chakra-ui/react";
import HomepageTable from "../src/components/homepage-table";
import NewsFeed from "../src/components/news-feed";
import Navigation from "../src/components/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import { BsFillTriangleFill } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import FormattedNumber from "../src/components/number-formatter";
import { GetStaticProps } from "next";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { arrayBuffer } from "stream/consumers";
import { NumericFormat } from "react-number-format";

const TableChartComponent = dynamic(
  () => import("../src/components/table-chart"),
  {
    ssr: false,
  }
);

const Home = (props: any) => {
  const [data, setData] = useState<any[]>([]);
  const [width, setWidth] = useState(0);
  const [slides, setSlides] = useState(1.25);
  const { colorMode } = useColorMode();

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

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    if (width >= 2100) {
      setSlides(3.5);
    } else if (width >= 1600) {
      setSlides(3);
    } else if (width >= 1100) {
      setSlides(2.5);
    } else if (width >= 800) {
      setSlides(2.2);
    } else if (width >= 600) {
      setSlides(2);
    } else if (width >= 490) {
      setSlides(1.5);
    } else if (width >= 320) {
      setSlides(1.2);
    } else {
      setSlides(1);
    }
  }, [width]);

  const turnicateText = (el: string, limit: number) => {
    if (el.length <= limit) {
      return el;
    } else {
      const turn = el.slice(0, limit);
      return `${turn}...s`;
    }
  };

  return (
    <>
      <Text variant="h-3" pt="40px">
        Top Movers
      </Text>
      {data.length > 0 && (
        <Box>
          <Swiper
            slidesPerView={slides}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            {topMovers.map((el) => (
              <SwiperSlide key={el.name}>
                <Stack
                  backgroundColor={
                    colorMode === "light" ? "#f5f6fa" : "#133364"
                  }
                  p="20px"
                  borderRadius="11px"
                  justifyContent="space-between"
                  position="relative"
                  flexDir={{ base: "column", lg: "row" }}
                  spacing="0"
                >
                  <Stack spacing="0">
                    <Link
                      href={`${window.location.origin}/coins/${el.id}`}
                      passHref
                      scroll
                    >
                      <HStack spacing="0" gap="6px">
                        <Box>
                          <Image
                            src={el.image}
                            height="30px"
                            width="30px"
                            alt={el.name}
                          />
                        </Box>
                        <Text variant="h-4" lineHeight="auto">
                          {turnicateText(el.name, 10)}
                        </Text>
                        <Text variant="small-bold" color="#a0aec0">
                          {el.symbol.toUpperCase()}
                        </Text>
                      </HStack>
                    </Link>
                    <HStack gap="10px">
                      <Box
                        fontSize={{ base: "20px", md: "24px" }}
                        fontWeight="500"
                      >
                        <FormattedNumber value={el.current_price} prefix="$" />
                      </Box>
                      <HStack>
                        <Box
                          transform={
                            el.price_change_percentage_24h < 0
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }
                        >
                          {el.price_change_percentage_24h !== 0 && (
                            <BsFillTriangleFill
                              size={8}
                              fill={
                                el.price_change_percentage_24h < 0
                                  ? "var(--red)"
                                  : "var(--green)"
                              }
                            />
                          )}
                        </Box>
                        <Text
                          color={
                            el.price_change_percentage_24h < 0 ? "red" : "green"
                          }
                        >
                          {Math.abs(el.price_change_percentage_24h).toFixed(2)}%
                        </Text>
                      </HStack>
                    </HStack>
                  </Stack>
                  <Box
                    width={{ base: "100%", lg: "75%" }}
                    height={{ base: "50px", lg: "100px" }}
                    className="imagegoes"
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <TableChartComponent
                      id={el.id}
                      change={el.price_change_percentage_24h}
                      data={el.sparkline_in_7d.price}
                      responsive={true}
                    />
                  </Box>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}

      <Box>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* <Chart coinId="bitcoin" /> */}
        <HomepageTable />
        <NewsFeed />
      </Box>
    </>
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
