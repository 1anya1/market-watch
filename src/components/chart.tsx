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
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  InputLeftAddon,
  InputGroup,
  Divider,
  Container,
  background,
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
    marketCap: 0,
    low_24: 0,
    high_24: 0,
    rank: 0,
  });
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
          };
          console.log(
            data.market_data.high_24h.usd,
            data.market_data.low_24h.usd
          );

          setStats({
            circulatingSupply: data.market_data.total_supply,
            marketCap: data.market_data.market_cap.usd,
            low_24: data.market_data.low_24h.usd,
            high_24: data.market_data.high_24h.usd,
            rank: data.market_cap_rank,
          });
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

  return (
    <Box p="40px 0">
      {coinInfo.name.length > 0 && chartContainerRef ? (
        <>
          <Box
            borderRadius="11px"
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
      <Stack
        flexDirection={{ base: "column", lg: "row" }}
        columnGap="40px"
        rowGap="20px"
        pt="40px"
      >
        {individualPage ? (
          <Container variant="box-component" width="100%" h="max-content">
            <Tabs width="100%">
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
                            <Text lineHeight="1.5" fontSize="18px" maxW="100%">
                              {el.description}
                            </Text>
                          </VStack>
                        </Stack>
                      ))}
                    </Stack>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </Container>
        ) : null}
        <VStack width="100%" m="0 !important" gap="20px">
          {dataRetrieved && coinInfo.symbol && (
            <Container variant="box-component" width="100%" h="max-content">
              <Text variant="h-3">
                {coinInfo.symbol.toUpperCase()} Price Stats
              </Text>
              <Stack gap="6px">
                <HStack justifyContent="space-between">
                  <Text variant="h-5">Circulating Supply</Text>
                  <NumericFormat
                    value={stats.circulatingSupply.toFixed(0)}
                    displayType="text"
                    thousandSeparator=","
                    className="h-4"
                  />
                </HStack>
                <Divider orientation="horizontal" />
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
          {coinInfo.symbol.length > 0 && (
            <Container variant="box-component" width="100%" h="max-content">
              <Text variant="h-3">Currency Converter</Text>

              <InputGroup mb="10px" borderRadius="11px">
                <InputLeftAddon>{coinInfo.symbol.toUpperCase()}</InputLeftAddon>
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
                    style={{ background: "transparent" }}
                  />
                </Box>
              </InputGroup>
              <InputGroup>
                <InputLeftAddon>USD</InputLeftAddon>
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
                    style={{ background: "transparent" }}
                  />
                </Box>
              </InputGroup>

              <Box fontSize="18px" pt="20px">
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

      {news?.videos.length > 0 && individualPage && (
        <Box pt="20px">
          <Text variant="h-3">Videos</Text>
          <Box overflow="scroll">
            <HStack
              gap="20px"
              overflow="hidden"
              width="max-content"
              alignItems="flex-start"
            >
              {news.videos.map((el: any) => (
                <VStack key={el.id} width={{ base: "250px", md: "300px" }}>
                  <Box
                    as="iframe"
                    src={`https://www.youtube.com/embed/${el.id}`}
                    width="100%"
                    sx={{
                      aspectRatio: "16/9",
                    }}
                  />
                  <Text fontSize="18px" lineHeight="1.5" fontWeight="700">
                    {el.title}
                  </Text>
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
