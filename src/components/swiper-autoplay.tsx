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

const TableChartComponent = dynamic(
  () => import("../../src/components/charts/table-chart"),
  {
    ssr: false,
  }
);

const SwiperAutoplayComponent = (props: any) => {
  const { data } = props;
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
        modules={[Autoplay]}
      >
        {data.length > 0
          ? data.map((el: any) => (
              <SwiperSlide key={el.name}>
                <Grid
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
                  mb="10px"
                >
                  <Stack spacing="0">
                    <Link
                      href={`${window.location.origin}/coins/${el.id}`}
                      passHref
                      scroll
                    >
                      <HStack
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
                      <HStack
                        bg={
                          el.price_change_percentage_24h < 0 ? "red" : "green"
                        }
                        spacing="0"
                        gap="4px"
                        padding="4px 6px"
                        borderRadius="4px"
                      >
                        <Box
                          transform={
                            el.price_change_percentage_24h < 0
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }
                        >
                          {el.price_change_percentage_24h !== 0 && (
                            <BsFillTriangleFill size={6} fill="white" />
                          )}
                        </Box>
                        <Text variant="xxs-text" color="white">
                          {Math.abs(el.price_change_percentage_24h).toFixed(2)}%
                        </Text>
                      </HStack>
                    </HStack>
                  </Stack>
                  <Box
                    width="100%"
                    height={{ base: "40px", md: "75px" }}
                    className="imagegoes"
                    // display="flex"
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
                  boxShadow="lg"
                  bg={colorMode === "dark" ? "#051329" : "white"}
                  h={{ base: "98px", lg: "116px" }}
                  borderRadius="11px"
                  mb="10px"
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
