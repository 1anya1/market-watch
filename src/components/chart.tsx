import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { RiSettings3Fill } from "react-icons/ri";
import { NumericFormat } from "react-number-format";
import { BiLinkExternal } from "react-icons/bi";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  useColorMode,
  Image,
  Stack,
  VStack,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Bitcoin from "../white/btc.svg";
import BitcoinLightMode from "../black/btc.svg";

// TODO add timestamp to refresh data every 10 minutes
// it would be better to pull more frequently but this is a free tier with limited call requests per timeframe

const colors = {
  red: "#f13d3d",
  green: "#039f65",
  blue: "#4983C6",
  gray: "#ECECEC",
};

const ChartComponent = (props: any) => {
  const { coinId, individualPage } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [cryptoData, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState("Line");
  const [timeFrame, setTimeFrame] = useState<number | string>(30);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [twentyFourHourValue, setTwentyFourHourValue] = useState(0);
  const [timeFrameMax, setTimeFrameMax] = useState(0);
  const [timeFrameLow, setTimeFrameLow] = useState(0);
  const [cryptoId, setCryptoId] = useState(0);
  const [viewAllCoin, setViewAllCoin] = useState(false);
  const [news, setNews] = useState<any>({
    articles: [],
    page: 0,
    size: 0,
    videos: [],
    total: 0,
  });

  const [coinInfo, setCoinInfo] = useState({
    name: "",
    description: "",
    url: "",
    image: "",
    score: 0,
    symbol: "",
  });
  const { colorMode } = useColorMode();

  useEffect(() => {
    const getData = async () => {
      let crypto: any[] = [];
      let low = Infinity;
      let high = 0;
      Promise.all([
        await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${timeFrame}`
        ),
        await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        ),
      ])
        .then(async ([respOne, respTwo]) => [
          await respOne.json(),
          await respTwo.json(),
        ])
        .then(([graph, data]) => {
          console.log({ data }, { graph });
          graph.forEach((el: any) => {
            const frame = {
              value: el[1],
              time: el[0] / 1000,
              open: el[1],
              close: el[4],
              high: el[2],
              low: el[3],
            };
            low = Math.min(low, el[3]);
            high = Math.max(high, el[2]);
            crypto.push(frame);
          });
          const coinInfo = {
            name: data?.name,
            description: data?.description?.en,
            url: data?.links?.homepage[0],

            image: data?.image?.small,
            score: data?.community_score,
            symbol: data?.symbol,
          };
          console.log(
            data.market_data.high_24h.usd,
            data.market_data.low_24h.usd
          );

          setCoinInfo(coinInfo);
          setData(crypto);
          setCurrentValue(crypto[crypto.length - 1].open);
          console.log();
          setTwentyFourHourValue(crypto[0].open);
          setTimeFrameMax(high);
          setTimeFrameLow(low);
        });
    };
    getData();
  }, [coinId, timeFrame]);

  useEffect(() => {
    if (coinInfo.symbol && individualPage) {
      fetch(`https://price-api.crypto.com/price/v1/tokens?page=1&limit=500`)
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          const findId = data.data.filter(
            (el: { symbol: any }) => el.symbol.toLowerCase() === coinInfo.symbol
          );

          setCryptoId(findId[0].token_id);
        });
    }
  }, [coinId, coinInfo, individualPage]);

  useEffect(() => {
    if (cryptoId > 0 && individualPage) {
      fetch(`https://price-api.crypto.com/market/v2/token/${cryptoId}/news`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setNews(data);
        });
    }
  }, [cryptoId, individualPage]);

  useEffect(() => {
    console.log(timeFrameLow, timeFrameMax);
  }, [timeFrameLow, timeFrameMax]);

  useEffect(() => {
    if (chartContainerRef?.current) {
      const handleResize = () => {
        if (chartContainerRef?.current?.clientWidth) {
          chart.applyOptions({
            width: chartContainerRef?.current?.clientWidth,
            height: chartContainerRef?.current?.clientHeight,
            leftPriceScale: {
              visible:
                chartContainerRef?.current?.clientWidth > 480 ? true : false,
            },
          });
          chart.timeScale().fitContent();
        }
      };

      const chart = createChart(chartContainerRef?.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: colorMode === "light" ? "black" : "white",
        },
        width: chartContainerRef?.current?.clientWidth,
        height: chartContainerRef?.current?.clientHeight,
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        crosshair: {
          vertLine: { visible: false },
        },
        handleScroll: {
          vertTouchDrag: false,
          horzTouchDrag: false,
          pressedMouseMove: false,
          mouseWheel: false,
        },
        handleScale: {
          pinch: false,
          mouseWheel: false,
          axisPressedMouseMove: false,
        },

        timeScale: {
          borderVisible: false,
        },
        leftPriceScale: {
          visible: chartContainerRef?.current?.clientWidth > 480 ? true : false,
          borderVisible: false,
          drawTicks: false,
        },
        rightPriceScale: {
          visible: false,
        },
      });
      chart.timeScale().fitContent();

      if (cryptoData.length > 0) {
        let newSeries;

        switch (chartType) {
          case "Line":
            newSeries = chart.addLineSeries({
              color: colors.blue,
              crosshairMarkerVisible: false,
              lastValueVisible: false,
              priceLineColor: "transparent",
            });
            newSeries.setData(cryptoData);
            break;
          case "Area":
            newSeries = chart.addAreaSeries({
              lineColor: colors.blue,
            });
            newSeries.setData(cryptoData);
            break;

          case "Histogram":
            newSeries = chart.addHistogramSeries({
              color: "#4983C6",
            });
            newSeries.setData(cryptoData);
            break;
          case "Candle":
            newSeries = chart.addCandlestickSeries({
              upColor: colors.green,
              downColor: colors.red,
              borderVisible: false,
              wickUpColor: colors.green,
              wickDownColor: colors.red,
            });
            newSeries.setData(cryptoData);
            break;

          case "Bar":
            newSeries = chart.addBarSeries({
              upColor: colors.green,
              downColor: colors.red,
            });
            newSeries.setData(cryptoData);
            break;
        }
      }

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);

        chart.remove();
      };
    }
  }, [chartType, colorMode, cryptoData]);

  const timeFrames = [
    { query: 1, value: "D" },
    { query: 7, value: "W" },
    { query: 30, value: "M" },
    { query: 90, value: "3M" },
    { query: 180, value: "6M" },
    { query: 365, value: "Y" },
    { query: "max", value: "All" },
  ];
  const dateParse = (date: string) => {
    const frame = date.slice(0, 10).split("-");
    return `${frame[1]}/${frame[2]}/${frame[0]}`;
  };
  return (
    <Box p="40px 0">
      {coinInfo.name.length > 0 && chartContainerRef ? (
        <>
          <Box
            padding=" 10px 14px 40px 14px"
            backgroundColor={colorMode === "light" ? "#f5f6fa" : "#133364"}
            position="relative"
            boxShadow="md"
          >
            <HStack>
              <Box>
                <Image
                  src={coinInfo.image}
                  alt={coinInfo.name}
                  width="40px"
                  height="40px"
                />
              </Box>
              <Text fontWeight="bold">{coinInfo.name}</Text>
            </HStack>
            <HStack flexWrap="wrap" columnGap="8px" pb="20px">
              <Box fontSize={{ base: "20px", sm: "28px" }}>
                <NumericFormat
                  value={currentValue}
                  prefix={"$"}
                  suffix=" USD"
                  displayType="text"
                  thousandSeparator=","
                  style={{
                    fontSize: "inherit",
                    fontWeight: "bold",
                  }}
                />
              </Box>
              <HStack margin="0 !important">
                {currentValue > twentyFourHourValue ? (
                  <AiFillCaretUp fill="var(--green)" size={16} />
                ) : (
                  <AiFillCaretDown fill="var(--red)" size={16} />
                )}
                <HStack margin="0 !important">
                  <Text
                    color={currentValue > twentyFourHourValue ? "green" : "red"}
                    fontSize={{ base: "16px", sm: "20px" }}
                    fontWeight="bold"
                  >
                    {Math.abs(
                      (currentValue * 100) / twentyFourHourValue - 100
                    ).toFixed(2)}
                    %
                  </Text>
                  {timeFrames.map((el) => {
                    if (el.query === timeFrame)
                      return (
                        <Text
                          fontSize={{ base: "14px", sm: "18px" }}
                          fontWeight="bold"
                        >{`(${el.value})`}</Text>
                      );
                  })}
                </HStack>
              </HStack>
            </HStack>
            <HStack
              justifyContent="space-between"
              flexWrap="wrap"
              pb="20px"
              gap="10px"
            >
              <Box position="relative" zIndex="10">
                <Menu>
                  <MenuButton
                    as={Button}
                    fontSize="12px"
                    lineHeight="12px"
                    height="32px"
                    fontWeight="600"
                    padding="0 !important"
                    background="unset !important"
                    // backgroundColor={
                    //   colorMode === "light" ? colors.gray : colors.white
                    // }
                  >
                    <RiSettings3Fill
                      fill={colorMode === "light" ? colors.gray : colors.blue}
                      size={20}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => setChartType("Line")}
                      // backgroundColor={chartType === "Line" ? "pink" : "unset"}
                    >
                      Line
                    </MenuItem>
                    <MenuItem
                      // backgroundColor={chartType === "Line" ? "pink" : "white"}
                      onClick={() => setChartType("Area")}
                    >
                      Area
                    </MenuItem>
                    <MenuItem onClick={() => setChartType("Histogram")}>
                      Histogram
                    </MenuItem>
                    <MenuItem onClick={() => setChartType("Candle")}>
                      Candlestick
                    </MenuItem>
                    <MenuItem onClick={() => setChartType("Bar")}>Bar</MenuItem>
                  </MenuList>
                </Menu>
              </Box>
              <HStack>
                {timeFrames.map((el) => (
                  <Text
                    key={el.value}
                    onClick={() => setTimeFrame(el.query)}
                    color={
                      timeFrame === el.query
                        ? "#1099FA"
                        : colorMode === "light"
                        ? "black"
                        : "white"
                    }
                    fontSize="14px"
                    fontWeight="bold"
                  >
                    {el.value}
                  </Text>
                ))}
              </HStack>
            </HStack>
            <Box ref={chartContainerRef} height="200px">
              <Text fontSize="10px" position="absolute" bottom="2" right="5">
                Powered by CoinGecko API
              </Text>
            </Box>
          </Box>
        </>
      ) : null}
      {individualPage ? (
        <Tabs width={{ base: "100%", md: "40%" }} pt="40px">
          <TabList borderBottom="unset" pb="20px" gap="40px">
            {coinInfo?.description ? (
              <Tab fontSize="24px" fontWeight="700" pb="20px">
                Bio
              </Tab>
            ) : null}
            {news?.articles.length > 0 ? (
              <Tab fontSize="24px" fontWeight="700" pb="20px">
                News
              </Tab>
            ) : null}
            {news?.videos.length > 0 ? (
              <Tab fontSize="24px" fontWeight="700" pb="20px">
                Videos
              </Tab>
            ) : null}
          </TabList>
          <TabPanels>
            <TabPanel p="0">
              {individualPage && coinInfo?.description && (
                <Box>
                  <Box position="relative">
                    <Box
                      maxH={!viewAllCoin ? "500px" : "100%"}
                      dangerouslySetInnerHTML={{ __html: coinInfo.description }}
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="break-spaces"
                      lineHeight="1.5"
                      transition="all .3s ease-in-out"
                      height={
                        !viewAllCoin
                          ? { base: "calc(15px * 21)", md: "100%" }
                          : "100%"
                      }
                    />
                    <Box
                      position="absolute"
                      bottom="0"
                      background={
                        !viewAllCoin
                          ? colorMode === "light"
                            ? "linear-gradient(rgba(255, 255, 255, 0) 30%, rgb(255, 255, 255) 100%)"
                            : "linear-gradient(rgba(8, 28, 59, 0) 30%, rgb(8, 28, 59) 100%)"
                          : "unset"
                      }
                      h="150px"
                      w="100%"
                    />
                  </Box>

                  <Button
                    onClick={() => setViewAllCoin(!viewAllCoin)}
                    mt="20px"
                  >
                    {!viewAllCoin ? "View More" : "View Less"}
                  </Button>
                </Box>
              )}
            </TabPanel>
            <TabPanel padding="0">
              {news?.articles.length > 0 && individualPage ? (
                <Stack gap="40px">
                  {news.articles.map((el: any) => (
                    <Stack
                      flexDir={{ base: "column" }}
                      gap="20px"
                      key={el.link}
                      margin="0 !important"
                      justifyContent="space-between"
                      w="100%"
                    >
                      <Box
                        backgroundImage={`url("${el.thumbnail}")`}
                        backgroundSize="cover"
                        sx={{
                          aspectRatio: "16/9",
                        }}
                        w="100%"
                        margin="0 !important"
                      />
                      <VStack
                        width="100%"
                        justifyContent="center"
                        alignItems="flex-start"
                      >
                        <Link href={el.link} isExternal>
                          <Text
                            fontSize="24px"
                            lineHeight="1.5"
                            fontWeight="700"
                          >
                            {el.title.replace(/[^a-zA-Z ]/g, "")}
                            <span
                              style={{
                                display: "inline-block",
                                marginLeft: "8px",
                                lineHeight: "1.5",
                              }}
                            >
                              <BiLinkExternal size={24} fill="#4983c7" />
                            </span>
                          </Text>
                          <Text fontWeight="bold">
                            {dateParse(el.publication_time)}
                          </Text>
                        </Link>
                        <Text lineHeight="1.5" fontSize="18px" maxW="100%">
                          {el.description}
                        </Text>
                      </VStack>
                    </Stack>
                  ))}
                </Stack>
              ) : null}
            </TabPanel>
            <TabPanel padding="0">
              {news?.videos.length > 0 && individualPage ? (
                <Stack gap="40px">
                  {news.videos.map((el: any) => (
                    <VStack key={el.id}>
                      <Box
                        as="iframe"
                        src={`https://www.youtube.com/embed/${el.id}`}
                        width="100%"
                        allow="autoplay"
                        sx={{
                          aspectRatio: "16/9",
                        }}
                      />
                      <Text fontSize="24px" lineHeight="1.5" fontWeight="700">
                        {el.title}
                      </Text>
                    </VStack>
                  ))}
                </Stack>
              ) : null}
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : null}
    </Box>
  );
};

const Chart = (props: any) => {
  return <ChartComponent {...props}></ChartComponent>;
};

export default Chart;
