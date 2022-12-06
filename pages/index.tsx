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

const Home = () => {
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
      setSlides(2.5);
    } else if (width >= 600) {
      setSlides(2);
    } else if (width >= 300) {
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
                <HStack
                  backgroundColor={
                    colorMode === "light" ? "#f5f6fa" : "#133364"
                  }
                  p="10px 21px"
                  pb={{ base: "71px", lg: "21px" }}
                  borderRadius="11px"
                  justifyContent="space-between"
                  position="relative"
                >
                  <Stack>
                    <HStack>
                      <Box>
                        <Image
                          src={el.image}
                          height="25px"
                          width="25px"
                          alt={el.name}
                        />
                      </Box>
                      <Text fontSize="16px" fontWeight="500">
                        {turnicateText(el.name, 14)}
                      </Text>
                      <Text fontSize="16px" fontWeight="700">
                        {el.symbol.toUpperCase()}
                      </Text>
                    </HStack>
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
                    position="absolute"
                    right="20px"
                    bottom={{ base: "21px", lg: "unset" }}
                  >
                    <TableChartComponent
                      id={el.id}
                      change={el.price_change_percentage_24h}
                      data={el.sparkline_in_7d.price}
                      responsive={true}
                    />
                  </Box>
                </HStack>
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
