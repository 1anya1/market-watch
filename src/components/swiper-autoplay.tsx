import {
  Box,
  HStack,
  Text,
  useColorMode,
  Stack,
  SkeletonCircle,
  SkeletonText,
  Grid,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import { BsFillTriangleFill } from "react-icons/bs";
import FormattedNumber from "../../src/components/number-formatter";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PercentChangeBox from "./percent-change-box";

const TableChartComponent = dynamic(
  () => import("../../src/components/charts/table-chart"),
  {
    ssr: false,
  }
);

const SwiperAutoplayComponent = (props: any) => {
  // const [data, setData] = useState<any[]>([]);
  // useEffect(() => {
  //   fetch(
  //     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h"
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setData(data));
  // }, []);
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
  const [width, setWidth] = useState(0);
  const [slides, setSlides] = useState(1.25);
  const { colorMode } = useColorMode();
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    if (width >= 2100) {
      setSlides(4.25);
    } else if (width >= 1600) {
      setSlides(4);
    } else if (width >= 1240) {
      setSlides(3.5);
    } else if (width >= 1070) {
      setSlides(3);
    } else if (width >= 860) {
      setSlides(2.3);
    } else if (width >= 600) {
      setSlides(2.2);
    } else if (width >= 490) {
      setSlides(2);
    } else if (width >= 320) {
      setSlides(1.4);
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
  //
  return (
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
        loop={true}
        modules={[Autoplay]}
      >
        {topMovers.length > 0
          ? topMovers.map((el: any) => (
              <SwiperSlide key={el.name}>
                <Grid
                 
                  overflow="hidden"
                  backgroundColor={
                    colorMode === "light" ? "#f5f6fa" : "#051329"
                  }
                  alignItems="center"
                  p={{ base: "14px", md: " 20px 10px 20px 20px" }}
                  borderRadius="11px"
                  justifyContent="space-between"
                  position="relative"
                  gridTemplateColumns={{
                    base: "100%",
                    md: "auto minmax(50px, 500px)",
                  }}
                  gap={{ base: "4px", md: "10px", lg: "20px" }}
                >
                  <Stack spacing="0">
                    <Link
                      href={`${window.location.origin}/coins/${el.id}`}
                      passHref
                      scroll
                    >
                      <HStack
                       cursor="pointer"
                        spacing="0"
                        gap="10px"
                        width="max-content"
                        mb="10px"
                      >
                        <Box h="30px">
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
                        <Text variant="xxs-text" color="#a0aec0">
                          ({el.symbol.toUpperCase()})
                        </Text>
                      </HStack>
                    </Link>

                    <HStack
                      gap="10px"
                      justifyContent={{ base: "space-between", md: "unset" }}
                    >
                      <Box
                        fontSize={{ base: "20px", md: "24px" }}
                        fontWeight="500"
                      >
                        <FormattedNumber value={el.current_price} prefix="$" />
                      </Box>
                      <PercentChangeBox val={el.price_change_percentage_24h} />
                    </HStack>
                  </Stack>
                  <Box
                    width="100%"
                    height={{ base: "40px", md: "75px" }}
                    className="imagegoes"
                    justifyContent="flex-end"
                    display={{ base: "none", md: "flex" }}
                  >
                    <TableChartComponent
                      id={el.id}
                      change={el.price_change_percentage_24h}
                      data={el.sparkline_in_7d.price}
                      responsive={true}
                    />
                  </Box>
                </Grid>
              </SwiperSlide>
            ))
          : [...Array(10)].map((el, idx) => (
              <SwiperSlide key={idx}>
                <Box
                  padding="20px"
                  border={
                    colorMode === "dark"
                      ? " 1.5px solid#051329"
                      : "1.5px solid #dddfe1"
                  }
                  bg={colorMode === "dark" ? "#051329" : "white"}
                  h={{ base: "98px", lg: "116px" }}
                  borderRadius="11px"
                >
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={1}
                    spacing="4"
                    skeletonHeight="2"
                  />
                </Box>
              </SwiperSlide>
            ))}
      </Swiper>
    </Box>
  );
};
export default SwiperAutoplayComponent;
