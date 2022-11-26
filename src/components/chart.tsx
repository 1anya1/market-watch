import { createChart, ColorType } from "lightweight-charts";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { RiSettings3Fill } from "react-icons/ri";
import { NumericFormat } from "react-number-format";
import { BiLinkExternal } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { TbWorld } from "react-icons/tb";

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
  InputLeftAddon,
  InputGroup,
  Divider,
  Container,
  Progress,
} from "@chakra-ui/react";

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
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [cryptoData, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState("Line");
  const [timeFrame, setTimeFrame] = useState<number | string>(1);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [twentyFourHourValue, setTwentyFourHourValue] = useState(0);
  const [timeFrameMax, setTimeFrameMax] = useState(1);
  const [timeFrameLow, setTimeFrameLow] = useState(1);
  const [cryptoId, setCryptoId] = useState(0);
  const [viewAllCoin, setViewAllCoin] = useState(false);
  const [news, setNews] = useState<any>({
    articles: [],
    page: 0,
    size: 0,
    videos: [],
    total: 0,
  });
  const [stats, setStats] = useState({
    circulatingSupply: 0,
    totalSupply: 0,
    marketCap: 0,
    low_24: 0,
    high_24: 0,
    rank: 0,
    volume: 0,
  });
  const [movingAverage, setMovingAverage] = useState(0);
  const [cryptoExchange, setCryptoExchange] = useState(1);
  const [currencyExchange, setCurrencyExchange] = useState(0);
  const [coinInfo, setCoinInfo] = useState<any>({
    name: "",
    description: "",
    url: "",
    image: "",
    score: 0,
    symbol: "",
    currentPrice: {},
    rank: 0,
  });
  const { colorMode } = useColorMode();
  useEffect(() => {
    setCurrencyExchange(coinInfo.currentPrice.usd);
  }, [coinInfo]);
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
          const totalNew = graph[graph.length - 1][1];
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
            currentPrice: data.market_data.current_price,
            image: data?.image?.small,
            score: data?.community_score,
            symbol: data?.symbol,
            rank: data.coingecko_rank,
          };

          setStats({
            totalSupply: data.market_data.total_supply,
            circulatingSupply: data.market_data.circulating_supply,
            marketCap: data.market_data.market_cap.usd,
            low_24: data.market_data.low_24h.usd,
            high_24: data.market_data.high_24h.usd,
            rank: data.market_cap_rank,
            volume: data.market_data.total_volume.usd,
          });
          setMovingAverage(totalNew);
          setCoinInfo(coinInfo);
          setData(crypto);
          setCurrentValue(crypto[crypto.length - 1].open);
          setTwentyFourHourValue(crypto[0].open);
          setTimeFrameMax(high);
          setTimeFrameLow(low);
        });
    };
    getData();
    setDataRetrieved(true);
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
    console.log(cryptoExchange, currencyExchange);
  }, [currencyExchange, cryptoExchange]);

  useEffect(() => {
    // console.log({ movingAverage }, { timeFrameMax }, { timeFrameLow });

    const max = timeFrameMax - timeFrameLow; //100%
    const val = movingAverage - timeFrameLow;
    console.log({ val }, { max });
    // console.log("lets see", max + hmm + min);
  });

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
    { query: 1, value: "D", name: "24H" },
    { query: 7, value: "W", name: "7 Days" },
    { query: 30, value: "M", name: "30 Days" },
    { query: 90, value: "3M", name: "90 Days" },
    { query: 180, value: "6M", name: "180 Days" },
    { query: 365, value: "Y", name: "365 Days" },
    { query: "max", value: "All", name: "All Time" },
  ];
  const dateParse = (date: string) => {
    const frame = date.slice(0, 10).split("-");
    return `${frame[1]}/${frame[2]}/${frame[0]}`;
  };
  const handleChangeCrypto = (event: any) => {
    const value = Number(event.target.value.split(",").join(""));
    setCryptoExchange(value);
    setCurrencyExchange(value * coinInfo.currentPrice.usd);
  };

  const handleChangeExchange = (event: any) => {
    const value = Number(event.target.value.split(",").join(""));
    setCurrencyExchange(value);
    setCryptoExchange(value / coinInfo.currentPrice.usd);
  };

  const renderRange = useCallback(() => {
    const val = timeFrames.map((el) => {
      if (el.query === timeFrame) return el.name;
    });
    return (
      <VStack
        gap="6px"
        w={{ base: "100%", md: "50%" }}
        alignItems="flex-start"
        pb="40px"
      >
        <Text variant="h-3" pb="0">
          {val} Range
        </Text>
        <HStack
          position="relative"
          w="100%"
          h="12px"
          borderRadius="4px"
          overflow="hidden"
        >
          <Box
            position="relative"
            zIndex="0"
            h="12px"
            w="100%"
            bg="linear-gradient(90deg, hsla(0, 100%, 50%, 1) 0%, hsla(60, 100%, 50%, 1) 50%, hsla(120, 100%, 50%, 1) 100%)"
          />
          <Box
            position="absolute"
            h="12px"
            bg={colorMode === "light" ? "#edf2f6" : "#30405b"}
            right="0"
            zIndex="1"
            w={`${
              100 -
              ((movingAverage - timeFrameLow) * 100) /
                (timeFrameMax - timeFrameLow)
            }%`}
            transition=".3s width ease-in-out"
          />
        </HStack>
        <HStack width="100%" justifyContent="space-between">
          <NumericFormat
            value={timeFrameLow}
            displayType="text"
            thousandSeparator=","
            className="h-4"
            prefix="Low: $"
          />

          <NumericFormat
            value={timeFrameMax}
            displayType="text"
            thousandSeparator=","
            className="h-4"
            prefix="High: $"
          />
        </HStack>
      </VStack>
    );
  }, [colorMode, movingAverage, timeFrame, timeFrameLow, timeFrameMax]);

  return (
    <Box p="40px 0">
      <HStack
        justifyContent="space-between"
        alignItems="flex-end"
        flexWrap="wrap"
        pb="40px"
        gap="11px"
      >
        <VStack alignItems="flex-start" gap="10px">
          <HStack gap="6px">
            <Text variant="h-1">{coinInfo.name}</Text>
            <Button>
              <FaStar size={20} />
            </Button>
          </HStack>
          <HStack gap="6px">
            <Button>Rank #{coinInfo.rank}</Button>
            <Button>
              <HStack>
                <TbWorld />
                <Text>{coinInfo.url.replace(/^https?:\/\//, "")}</Text>
              </HStack>
            </Button>
          </HStack>
        </VStack>
        <HStack gap="6px">
          <Button>Buy</Button>
          <Button>Sell</Button>
        </HStack>
      </HStack>
      {movingAverage && timeFrameLow && timeFrameMax && renderRange()}
      {coinInfo.name.length > 0 && chartContainerRef ? (
        <>
          <Box
            borderRadius="11px"
            padding="20px 20px 40px 20px"
            backgroundColor={colorMode === "light" ? "#f5f6fa" : "#133364"}
            position="relative"
            boxShadow="md"
          >
            <HStack gap="6px" pb="11px">
              <Box>
                <Image
                  src={coinInfo.image}
                  alt={coinInfo.name}
                  width={{ base: "30px", md: "40px" }}
                  height={{ base: "30px", md: "40px" }}
                />
              </Box>
              <Text variant="h-3" pb="0">
                {coinInfo.name}
              </Text>
            </HStack>
            <HStack flexWrap="wrap" columnGap="8px" pb="20px">
              <Box fontSize={{ base: "18px", sm: "24px", md: "28px" }}>
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
                    variant="bold-small"
                  >
                    {Math.abs(
                      (currentValue * 100) / twentyFourHourValue - 100
                    ).toFixed(2)}
                    %
                  </Text>
                  {timeFrames.map((el) => {
                    if (el.query === timeFrame)
                      return (
                        <Text variant="bold-small">{`(${el.value})`}</Text>
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
                    fontSize={{ base: "12px", sm: "14px" }}
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
      <Stack
        flexDirection={{ base: "column", lg: "row" }}
        columnGap="20px"
        rowGap="20px"
        pt="40px"
      >
        <VStack gap="20px" width={{ base: "100%", lg: "55%" }}>
          {dataRetrieved && coinInfo.symbol && (
            <Container variant="box-component" h="max-content" w="100%">
              {/* <Text variant="h-3">{coinInfo.symbol.toUpperCase()} Stats</Text> */}
              <Text variant="h-3">Stats</Text>
              <Stack>
                <HStack justifyContent="space-between">
                  <Text variant="h-5">Market Cap</Text>

                  <NumericFormat
                    value={stats.marketCap.toFixed(2)}
                    prefix={"$"}
                    displayType="text"
                    thousandSeparator=","
                    className="h-4"
                  />
                </HStack>
                <Divider orientation="horizontal" />

                <HStack justifyContent="space-between">
                  <Text variant="h-5">Volume</Text>

                  <NumericFormat
                    value={stats.volume.toFixed(0)}
                    displayType="text"
                    thousandSeparator=","
                    className="h-4"
                  />
                </HStack>
                <Divider orientation="horizontal" />
                <HStack justifyContent="space-between">
                  <Text variant="h-5">24HR Low</Text>

                  <NumericFormat
                    value={stats.low_24}
                    prefix={"$"}
                    displayType="text"
                    thousandSeparator=","
                    className="h-4"
                  />
                </HStack>
                <Divider orientation="horizontal" />
                <HStack justifyContent="space-between">
                  <Text variant="h-5">24HR High</Text>

                  <NumericFormat
                    value={stats.high_24}
                    prefix={"$"}
                    displayType="text"
                    thousandSeparator=","
                    className="h-4"
                  />
                </HStack>
              </Stack>
            </Container>
          )}
          {individualPage ? (
            <Container variant="box-component" h="max-content">
              <Text variant="h-3">Bio</Text>
              {individualPage && coinInfo?.description && (
                <Box>
                  <Box position="relative">
                    <Text
                      maxH={!viewAllCoin ? "500px" : "100%"}
                      dangerouslySetInnerHTML={{
                        __html: coinInfo.description,
                      }}
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="break-spaces"
                      lineHeight="1.5"
                      transition="all .3s ease-in-out"
                      height={!viewAllCoin ? "calc(15px * 11)" : "100%"}
                    />
                    <Box
                      position="absolute"
                      bottom="0"
                      background={
                        !viewAllCoin
                          ? colorMode === "light"
                            ? "linear-gradient(rgba(245, 246, 250, 0) 30%, rgb(245, 246, 250) 100%)"
                            : "linear-gradient(rgba(18, 51, 100, 0) 30%, rgb(18, 51, 100) 100%)"
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
              {/* <Tabs width="100%">
                <TabList
                  borderBottom="unset"
                  pb="20px"
                  gap={{ base: "20px", md: "28px" }}
                >
                  {coinInfo?.description ? (
                    <Tab
                      fontSize={{ base: "16px", md: "20px" }}
                      fontWeight="700"
                      pb="20px"
                    >
                      Bio
                    </Tab>
                  ) : null}
                  {news?.articles.length > 0 ? (
                    <Tab
                      fontSize={{ base: "16px", md: "20px" }}
                      fontWeight="700"
                      pb="20px"
                    >
                      News
                    </Tab>
                  ) : null}
                </TabList>
                <TabPanels>
                  {individualPage && coinInfo?.description && (
                    <TabPanel p="0">
                      <Box>
                        <Box position="relative">
                          <Box
                            maxH={!viewAllCoin ? "500px" : "100%"}
                            dangerouslySetInnerHTML={{
                              __html: coinInfo.description,
                            }}
                            textOverflow="ellipsis"
                            overflow="hidden"
                            whiteSpace="break-spaces"
                            lineHeight="1.5"
                            transition="all .3s ease-in-out"
                            height={!viewAllCoin ? "calc(15px * 11)" : "100%"}
                          />
                          <Box
                            position="absolute"
                            bottom="0"
                            background={
                              !viewAllCoin
                                ? colorMode === "light"
                                  ? "linear-gradient(rgba(245, 246, 250, 0) 30%, rgb(245, 246, 250) 100%)"
                                  : "linear-gradient(rgba(18, 51, 100, 0) 30%, rgb(18, 51, 100) 100%)"
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
                    </TabPanel>
                  )}
                  {news?.articles.length > 0 && individualPage && (
                    <TabPanel padding="0">
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
                              <Text
                                lineHeight="1.5"
                                fontSize="18px"
                                maxW="100%"
                              >
                                {el.description}
                              </Text>
                            </VStack>
                          </Stack>
                        ))}
                      </Stack>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs> */}
            </Container>
          ) : null}
        </VStack>

        <VStack width={{ base: "100%", lg: "45%" }} m="0 !important" gap="20px">
          {dataRetrieved && coinInfo.symbol && (
            <Container variant="box-component" width="100%" h="max-content">
              <Stack gap="6px">
                <Text variant="h-3">Circulating Supply</Text>
                <HStack justifyContent="space-between">
                  <NumericFormat
                    value={stats.circulatingSupply.toFixed(0)}
                    displayType="text"
                    thousandSeparator=","
                    className="h-4"
                    suffix={` ${coinInfo.symbol.toUpperCase()}`}
                  />
                  <Text variant="h-5">
                    {(
                      (stats.circulatingSupply * 100) /
                      stats.totalSupply
                    ).toFixed(0)}
                    %
                  </Text>
                </HStack>
                <Progress
                  borderRadius="4px"
                  value={(stats.circulatingSupply * 100) / stats.totalSupply}
                />

                <HStack justifyContent="space-between" pt="34px">
                  <Text variant="h-5">Total Supply</Text>
                  <NumericFormat
                    value={stats.totalSupply.toFixed(0)}
                    displayType="text"
                    thousandSeparator=","
                    className="h-4"
                  />
                </HStack>
                <Divider orientation="horizontal" />
                <HStack justifyContent="space-between">
                  <Text variant="h-5">Circulating Supply</Text>

                  <NumericFormat
                    value={stats.circulatingSupply.toFixed(0)}
                    displayType="text"
                    thousandSeparator=","
                    className="h-4"
                  />
                </HStack>
              </Stack>
            </Container>
          )}
          {coinInfo.symbol.length > 0 && (
            <Container variant="box-component" width="100%" h="max-content">
              <Text variant="h-3">Currency Converter</Text>

              <InputGroup mb="10px" borderRadius="11px">
                <InputLeftAddon>
                  <Text variant="bold-xsmall">
                    {coinInfo.symbol.toUpperCase()}
                  </Text>
                </InputLeftAddon>
                <Box
                  pl="10px"
                  border={
                    colorMode === "dark"
                      ? "1px solid #3b547d"
                      : "1px solid #e2e8f0"
                  }
                  width="100%"
                  borderRadius="0 6px 6px  0"
                >
                  <NumericFormat
                    value={cryptoExchange}
                    displayType="input"
                    thousandSeparator=","
                    className="h-4 input"
                    onChange={handleChangeCrypto}
                    style={{ background: "transparent", height: "100%" }}
                  />
                </Box>
              </InputGroup>
              <InputGroup>
                <InputLeftAddon>
                  <Text variant="bold-xsmall">USD</Text>
                </InputLeftAddon>
                <Box
                  pl="10px"
                  border={
                    colorMode === "dark"
                      ? "1px solid #3b547d"
                      : "1px solid #e2e8f0"
                  }
                  width="100%"
                  borderRadius="0 6px 6px  0"
                >
                  <NumericFormat
                    value={currencyExchange}
                    displayType="input"
                    thousandSeparator=","
                    className="h-4 input"
                    onChange={handleChangeExchange}
                    style={{ background: "transparent", height: "100%" }}
                  />
                </Box>
              </InputGroup>

              <Box fontSize={{ base: "14px", sm: "18px" }} pt="20px">
                <span>
                  1{coinInfo.symbol.toUpperCase()} ={" "}
                  <NumericFormat
                    value={coinInfo.currentPrice.usd}
                    suffix=" USD"
                    displayType="text"
                    thousandSeparator=","
                  />
                </span>
              </Box>
              <Text fontSize="12px">
                This is not real time data. To use for approximation only*
              </Text>
            </Container>
          )}
        </VStack>
      </Stack>
      {news?.articles.length > 0 && individualPage && (
        <Box pt="40px">
          <Text variant="h-3" pb="20px">
            In The News
          </Text>
          <Box overflow="scroll" className="container">
            <HStack
              columnGap="20px"
              overflow="hidden"
              width="max-content"
              alignItems="flex-start"
            >
              {news.articles.map((el: any) => (
                <Stack
                  flexDir={{ base: "column" }}
                  // gap="20px"
                  key={el.link}
                  margin="0 !important"
                  justifyContent="space-between"
                  width={{
                    base: "80vw",
                    xs: "70vw",
                    sm: "60vw",
                    md: "50vw",
                    lg: "40vw",
                  }}
                  maxW="400px"
                >
                  <Box
                    backgroundImage={`url("${el.thumbnail}")`}
                    borderRadius="8px"
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
                      <Text variant="h-4" fontWeight="700" pb="6px">
                        {50 < el.title.length
                          ? `${el.title
                              .replace(/[^a-zA-Z ]/g, "")
                              .substring(0, 35)}...`
                          : el.title.replace(/[^a-zA-Z ]/g, "")}
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
                    <Text lineHeight="1.5" fontSize="16px" maxW="100%">
                      {150 < el.description.length
                        ? `${el.description.substring(0, 150)}...`
                        : el.description}
                    </Text>
                  </VStack>
                </Stack>
              ))}
            </HStack>
          </Box>
        </Box>
      )}
      {news?.videos.length > 0 && individualPage && (
        <Box pt="40px">
          <Text variant="h-3" pb="20px">
            Youtube Videos
          </Text>
          <Box overflow="scroll" className="container">
            <HStack
              gap="20px"
              overflow="hidden"
              width="max-content"
              alignItems="flex-start"
            >
              {news.videos.map((el: any) => (
                <VStack
                  key={el.id}
                  width={{
                    base: "80vw",
                    xs: "70vw",
                    sm: "60vw",
                    md: "50vw",
                    lg: "40vw",
                  }}
                  maxW="400px"
                >
                  <Box
                    borderRadius="8px"
                    as="iframe"
                    src={`https://www.youtube.com/embed/${el.id}`}
                    width="100%"
                    sx={{
                      aspectRatio: "16/9",
                    }}
                  />
                  <Text variant="h-4">{el.title}</Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const Chart = (props: any) => {
  return <ChartComponent {...props}></ChartComponent>;
};

export default Chart;
