import React, { useCallback, useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { BiLinkExternal } from "react-icons/bi";
import { FaReddit, FaGithub } from "react-icons/fa";
import { BsFacebook } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { TbWorld } from "react-icons/tb";
import BuySellModal from "./modals/buy-sell-modal";
import { database } from "../../context/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import ScaleLoader from "react-spinners/ScaleLoader";

import {
  Box,
  Button,
  HStack,
  Text,
  useColorMode,
  Image,
  Stack,
  VStack,
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
  Collapse,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import FavoriteButton from "./favorite-button";

import ShareButton from "./share-button";

const MainChart = dynamic(() => import("./charts/main-chart"), {
  ssr: false,
});

const IndividualCoin = (props: any) => {
  const { user } = useAuth();
  const { coinId, individualPage, coinSymbol, articles, videos } = props;
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [cryptoData, setData] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState<number | string>(1);
  const [timeFrameMax, setTimeFrameMax] = useState(1);
  const [timeFrameLow, setTimeFrameLow] = useState(1);
  const [viewAllCoin, setViewAllCoin] = useState(false);
  const [initalPricePoint, setInitialPricePoint] = useState(0);
  const [initialPercent, setInitialPercent] = useState(0);
  const [graph, setGraph] = useState<any>(undefined);
  const [data, setCoinData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    circulatingSupply: 0,
    totalSupply: 0,
    marketCap: 0,
    low_24: 0,
    high_24: 0,
    rank: 0,
    volume: 0,
  });
  const { colorMode } = useColorMode();
  const [liked, setLiked] = useState(false);
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
    reddit: "",
    fecebook: "",
    twitter: "",
    github: "",
  });

  useEffect(() => {
    const liked = async () => {
      if (coinId && coinInfo.symbol.length > 0 && user.name) {
        const docRef = doc(database, "users", user.name, "liked", coinId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } else {
        setLiked(false);
      }
    };
    liked();
  }, [coinId, coinInfo, user]);

  const handleChangeCrypto = (event: any) => {
    const value = Number(event.target.value.split(",").join(""));
    setCryptoExchange(value);
    setCurrencyExchange(value * coinInfo.currentPrice.usd);
  };
  const BuySell = (props: any) => {
    const { coinId } = props;
    const { onOpen, onClose, isOpen } = useDisclosure();
    return (
      <>
        <Button variant="medium-hollow" onClick={onOpen} width="inherit">
          Buy/Sell
        </Button>
        <BuySellModal name={coinId} onClose={onClose} isOpen={isOpen} />
      </>
    );
  };

  useEffect(() => {
    const getData = async () => {
      let crypto: any[] = [];
      let low = Infinity;
      let high = 0;
      if (graph && data) {
        const totalNew = graph.length > 0 ? graph[graph.length - 1][1] : 0;
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
        const startingVal = crypto.length > 0 ? crypto[0].value : 0;
        const endValue =
          crypto.length > 0 ? crypto[crypto.length - 1].value : 0;
        const percentChange =
          (Number(endValue) * 100) / Number(startingVal) - 100;
        const coinInfo = {
          name: data?.name,
          description: data?.description?.en,
          url: data?.links?.homepage[0],
          reddit: data?.links?.subreddit_url,
          twitter: data?.links?.twitter_screen_name,
          facebook: data?.links?.facebook_username,
          github: data?.links?.repos_url?.github[0],
          currentPrice: data.market_data.current_price,
          image: data?.image?.small,
          score: data?.community_score,
          symbol: data?.symbol,
          rank: data?.market_cap_rank,
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
        setInitialPercent(percentChange);
        setMovingAverage(totalNew);
        setCoinInfo(coinInfo);
        setData(crypto);
        setTimeFrameMax(high);
        setTimeFrameLow(low);
        setInitialPricePoint(data.market_data.current_price.usd);
        setCurrencyExchange(data.market_data.current_price.usd);
        setDataRetrieved(true);
      }
    };
    getData();
  }, [coinId, timeFrame, data, graph]);

  const handleChangeExchange = (event: any) => {
    const value = Number(event.target.value.split(",").join(""));
    setCurrencyExchange(value);
    setCryptoExchange(value / coinInfo.currentPrice.usd);
  };

  const timeFrames = [
    { query: 1, value: "D", name: "24H" },
    { query: 7, value: "W", name: "7 Days" },
    { query: 30, value: "M", name: "30 Days" },
    { query: 90, value: "3M", name: "90 Days" },
    { query: 180, value: "6M", name: "6 Months" },
    { query: 365, value: "Y", name: "1 Year" },
    { query: "max", value: "All", name: "All Time" },
  ];
  const dateParse = (date: string) => {
    const frame = date.slice(0, 10).split("-");
    return `${frame[1]}/${frame[2]}/${frame[0]}`;
  };
  const router = useRouter();

  useEffect(() => {
    const val = timeFrames.find((el) => el.query === timeFrame);
    if (val) {
      setIsLoading(true);
      router.push(
        {
          pathname: `/coins/${router.query.idx}`,
          query: { timeframe: val.query.toString() },
        },
        `/coins/${router.query.idx}`,
        { shallow: true }
      );
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);

        fetch(
          `${url.origin}/api/coinCharts?timeframe=${val.query}&idx=${router.query.idx}`
        )
          .then((response) => response.json())
          .then((fetchedData) => {
            setGraph(fetchedData.ohlcData);
            setCoinData(fetchedData.coinData);
            // setArticles(fetchedData.articles);
            // setVideos(fetchedData.videos);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setIsLoading(false);
            setError(error);
          });
      }
    }
  }, [timeFrame]);

  const renderRange = useCallback(() => {
    const val = timeFrames.map((el) => {
      if (el.query === timeFrame) return el.name;
    });
    return (
      <VStack gap="11px" w="100%" alignItems="flex-start" pb="20px" spacing="0">
        <Text variant="body-gray-bold">{val} High / Low</Text>
        <HStack
          position="relative"
          w="100%"
          h="12px"
          borderRadius="4px"
          overflow="hidden"
          spacing="0"
        >
          <Box
            position="relative"
            zIndex="0"
            h="12px"
            w="100%"
            bg={
              colorMode === "light"
                ? "linear-gradient(270deg, hsla(0, 100%, 50%, 1) 0%, hsla(60, 100%, 50%, 1) 50%, hsla(120, 100%, 50%, 1) 100%)"
                : "linear-gradient(270deg, hsla(0, 100%, 50%, 1) 0%, hsla(60, 100%, 50%, 1) 50%, hsla(120, 100%, 50%, 1) 100%)"
            }
          />
          <Box
            position="absolute"
            h="12px"
            bg={colorMode === "light" ? "#dddfe0" : "#3b547d"}
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
        <HStack width="100%" justifyContent="space-between" spacing="0">
          <NumericFormat
            value={timeFrameLow}
            displayType="text"
            thousandSeparator=","
            className="h-4"
            // prefix="Low: $"
            prefix="$"
          />

          <NumericFormat
            value={timeFrameMax}
            displayType="text"
            thousandSeparator=","
            className="h-4"
            // prefix="High: $"
            prefix="$"
          />
        </HStack>
      </VStack>
    );
  }, [
    colorMode,
    movingAverage,
    timeFrame,
    timeFrameLow,
    timeFrameMax,
    timeFrames,
  ]);

  return (
    <>
      {isLoading ? (
        <>
          <Center padding={20}>
            <ScaleLoader
              color={"#4983c6"}
              loading={isLoading}
              height="100"
              width="20"
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Center>
        </>
      ) : (
        <>
          {dataRetrieved ? (
            <Box>
              <HStack
                gap="11px"
                spacing="0"
                pb="28px"
                flexWrap="wrap"
                zIndex="11"
                position="relative"
              >
                <HStack gap="11px" spacing="0">
                  <Box width="100%">
                    <Image
                      src={coinInfo.image}
                      alt={coinInfo.name}
                      width={{ base: "28px", md: "34px" }}
                      height={{ base: "28px", md: "34px" }}
                    />
                  </Box>
                  <Text variant="h-1" pb="0" whiteSpace="nowrap">
                    {coinInfo.name}
                  </Text>
                </HStack>
                <HStack spacing="0" columnGap="6px" rowGap="10px">
                  <FavoriteButton
                    liked={liked}
                    setLiked={setLiked}
                    coinId={coinId}
                    coinSym={coinInfo.symbol}
                  />
                  <ShareButton />
                  <BuySell coinId={coinId} />

                  {/* <BuySellButton coinId={coinId} /> */}
                </HStack>
              </HStack>
              <Stack
                flexDirection={{ base: "column", lg: "row" }}
                columnGap="20px"
                rowGap="20px"
                pt="20px"
                spacing="0"
              >
                <VStack
                  gap="20px"
                  width={{ base: "100%", lg: "55%" }}
                  spacing="0"
                >
                  <MainChart
                    cryptoData={cryptoData}
                    timeFrame={timeFrame}
                    setTimeFrame={setTimeFrame}
                    initalPricePoint={initalPricePoint}
                    initialPercent={initialPercent}
                    timeFrames={timeFrames}
                  />

                  {dataRetrieved && coinInfo.symbol && (
                    <Container variant="box-component" h="max-content" w="100%">
                      {/* <Text variant="h-3">{coinInfo.symbol.toUpperCase()} Stats</Text> */}
                      <HStack pb="20px" spacing="0" gap="11px">
                        <Text variant="h-3" pb="0px">
                          Stats
                        </Text>
                        <Box
                          bgColor={
                            colorMode === "light" ? "#1099fa" : "#4983C6"
                          }
                          p="0 10px"
                          borderRadius={12}
                        >
                          <Text color="white" fontSize={12} fontWeight="700">
                            Rank #{coinInfo.rank}
                          </Text>
                        </Box>
                      </HStack>
                      <Stack spacing="0" gap="11px">
                        {movingAverage &&
                          timeFrameLow &&
                          timeFrameMax &&
                          renderRange()}

                        <HStack justifyContent="space-between">
                          <Text variant="body-gray-bold">Market Cap</Text>

                          <NumericFormat
                            value={stats?.marketCap?.toFixed(2)}
                            prefix={"$"}
                            displayType="text"
                            thousandSeparator=","
                            className="h-4"
                          />
                        </HStack>
                        <Divider orientation="horizontal" />

                        <HStack justifyContent="space-between">
                          <Text variant="body-gray-bold">Volume</Text>

                          <NumericFormat
                            value={stats?.volume?.toFixed(0)}
                            displayType="text"
                            thousandSeparator=","
                            className="h-4"
                          />
                        </HStack>
                        <Divider orientation="horizontal" />
                        <HStack justifyContent="space-between">
                          <Text variant="body-gray-bold">24HR Low</Text>

                          <NumericFormat
                            value={stats?.low_24}
                            prefix={"$"}
                            displayType="text"
                            thousandSeparator=","
                            className="h-4"
                          />
                        </HStack>
                        <Divider orientation="horizontal" />
                        <HStack justifyContent="space-between">
                          <Text variant="body-gray-bold">24HR High</Text>

                          <NumericFormat
                            value={stats?.high_24}
                            prefix={"$"}
                            displayType="text"
                            thousandSeparator=","
                            className="h-4"
                          />
                        </HStack>
                      </Stack>
                    </Container>
                  )}
                  {/* TODO need to update api for this route */}
                  {/* <Link href={`/historic-data/${coinId}`} passHref>
                    <Button width="100%" variant="large">
                      View Historic Prices
                    </Button>
                  </Link> */}

                  {individualPage ? (
                    <Container variant="box-component" h="max-content">
                      <Text variant="h-3">Bio</Text>
                      {individualPage && coinInfo?.description && (
                        <Box>
                          <Box position="relative">
                            <Collapse
                              startingHeight={
                                coinInfo.description.length > 300 ? 140 : "100%"
                              }
                              in={viewAllCoin}
                            >
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
                                height={
                                  coinInfo.description.length > 300
                                    ? !viewAllCoin
                                      ? "calc(15px * 11)"
                                      : "100%"
                                    : "100%"
                                }
                              />
                              {coinInfo.description.length > 300 && (
                                <Box
                                  position="absolute"
                                  bottom="0"
                                  background={
                                    !viewAllCoin
                                      ? colorMode === "light"
                                        ? "linear-gradient(rgba(245, 255, 255, 0) 30%, rgb(255, 255, 255) 100%)"
                                        : "linear-gradient(rgba(18, 51, 100, 0) 30%, rgb(5 19 41) 100%)"
                                      : "unset"
                                  }
                                  h="150px"
                                  w="100%"
                                />
                              )}
                            </Collapse>
                          </Box>
                          {coinInfo.description.length > 300 && (
                            <Button
                              onClick={() => setViewAllCoin(!viewAllCoin)}
                              mt="20px"
                              width="100%"
                              variant="large"
                            >
                              {!viewAllCoin ? "View More" : "View Less"}
                            </Button>
                          )}
                        </Box>
                      )}
                    </Container>
                  ) : null}
                </VStack>

                <VStack
                  width={{ base: "100%", lg: "45%" }}
                  m="0 !important"
                  gap="20px"
                  spacing="0"
                >
                  {dataRetrieved && coinInfo.symbol && (
                    <Container
                      variant="box-component"
                      width="100%"
                      h="max-content"
                    >
                      <Text variant="h-3">Circulating Supply</Text>
                      <Stack gap="11px" spacing="0">
                        <HStack justifyContent="space-between" spacing="0">
                          <NumericFormat
                            value={stats?.circulatingSupply?.toFixed(0)}
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
                          className="progress-bar"
                          borderRadius="4px"
                          variant="prog-bar"
                          value={
                            (stats.circulatingSupply * 100) / stats.totalSupply
                          }
                        />

                        <HStack justifyContent="space-between" pt="20px">
                          <Text variant="body-gray-bold">Total Supply</Text>
                          <NumericFormat
                            value={stats.totalSupply?.toFixed(0)}
                            displayType="text"
                            thousandSeparator=","
                            className="h-4"
                          />
                        </HStack>
                        <Divider orientation="horizontal" />
                        <HStack justifyContent="space-between">
                          <Text variant="body-gray-bold">
                            Circulating Supply
                          </Text>

                          <NumericFormat
                            value={stats?.circulatingSupply?.toFixed(0)}
                            displayType="text"
                            thousandSeparator=","
                            className="h-4"
                          />
                        </HStack>
                      </Stack>
                    </Container>
                  )}
                  {coinInfo.symbol.length > 0 && (
                    <Container
                      variant="box-component"
                      width="100%"
                      h="max-content"
                    >
                      <Text variant="h-3">Currency Converter</Text>

                      <InputGroup mb="10px" borderRadius="11px">
                        <InputLeftAddon
                          minW={{ base: "70px", sm: "100px" }}
                          justifyContent="center"
                          background={
                            colorMode === "light" ? "#edf2f8" : "#123364"
                          }
                        >
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
                            style={{
                              background: "transparent",
                              height: "100%",
                            }}
                          />
                        </Box>
                      </InputGroup>
                      <InputGroup>
                        <InputLeftAddon
                          minW={{ base: "70px", sm: "100px" }}
                          justifyContent="center"
                          background={
                            colorMode === "light" ? "#edf2f8" : "#123364"
                          }
                        >
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
                            style={{
                              background: "transparent",
                              height: "100%",
                            }}
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
                        This is not real time data. To use for approximation
                        only*
                      </Text>
                      <BuySell coinId={coinId} />
                    </Container>
                  )}
                  <Container
                    variant="box-component"
                    width="100%"
                    h="max-content"
                  >
                    <Text variant="h-3">Links</Text>
                    <HStack spacing={0} flexWrap="wrap" gap="11px">
                      <VStack w={{ base: "100%", sm: "48.5%" }}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={coinInfo.url}
                          className="links"
                        >
                          <Button w="100%" p="20px" variant="medium">
                            <HStack>
                              <TbWorld size={22} />
                              <Text>Website</Text>
                            </HStack>
                          </Button>
                        </a>
                      </VStack>
                      <VStack w={{ base: "100%", sm: "48.5%" }}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://www.facebook.com/${coinInfo.facebook}`}
                          className="links"
                        >
                          <Button w="100%" p="20px" variant="medium">
                            <HStack>
                              <BsFacebook size={20} />
                              <Text>Facebook</Text>
                            </HStack>
                          </Button>
                        </a>
                      </VStack>
                      <VStack w={{ base: "100%", sm: "48.5%" }}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://www.twitter.com/${coinInfo.twitter}`}
                          className="links"
                        >
                          <Button w="100%" p="20px" variant="medium">
                            <HStack>
                              <AiFillTwitterCircle size="22.5px" />
                              <Text>Twitter</Text>
                            </HStack>
                          </Button>
                        </a>
                      </VStack>
                      <VStack w={{ base: "100%", sm: "48.5%" }}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={coinInfo.reddit}
                          className="links"
                        >
                          <Button w="100%" p="20px" variant="medium">
                            <HStack>
                              <FaReddit size={20} />
                              <Text>Reddit</Text>
                            </HStack>
                          </Button>
                        </a>
                      </VStack>
                      <VStack w={{ base: "100%", sm: "48.5%" }}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={coinInfo.github}
                          className="links"
                        >
                          <Button w="100%" p="20px" variant="medium">
                            <HStack>
                              <FaGithub size="20px" />
                              <Text>Github</Text>
                            </HStack>
                          </Button>
                        </a>
                      </VStack>
                    </HStack>
                  </Container>
                </VStack>
              </Stack>

              <Container
                variant="box-component"
                width="100%"
                h="max-content"
                mt="20px"
              >
                <Tabs width="100%">
                  <TabList
                    borderBottom="unset"
                    pb="20px"
                    gap={{ base: "20px", md: "28px" }}
                  >
                    {articles.length > 0 ? (
                      <Tab
                        fontSize={{ base: "24px", sm: "26px" }}
                        fontWeight="700"
                        pb="20px"
                        className="tab"
                      >
                        News
                      </Tab>
                    ) : null}
                    {videos.length > 0 ? (
                      <Tab
                        fontSize={{ base: "24px", sm: "26px" }}
                        fontWeight="700"
                        pb="20px"
                        className="tab"
                      >
                        Videos
                      </Tab>
                    ) : null}
                  </TabList>
                  <TabPanels padding="0">
                    <TabPanel padding="0">
                      {articles?.length > 0 && individualPage && (
                        <Box overflow="scroll" className="container">
                          <HStack
                            columnGap="20px"
                            overflow="hidden"
                            width="max-content"
                            alignItems="flex-start"
                          >
                            {articles.map((el: any, idx: number) => (
                              <Stack
                                flexDir={{ base: "column" }}
                                // gap="20px"
                                key={`${el.link}-${idx}`}
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
                                  <a href={el.link}>
                                    <Text
                                      variant="h-4"
                                      fontWeight="700"
                                      pb="6px"
                                    >
                                      {50 < el.title.length
                                        ? `${el.title
                                            .replace(/[^a-zA-Z ]/g, "")
                                            .substring(0, 50)}...`
                                        : el.title.replace(/[^a-zA-Z ]/g, "")}
                                      <span
                                        style={{
                                          display: "inline-block",
                                          marginLeft: "8px",
                                          lineHeight: "1.5",
                                        }}
                                      >
                                        <BiLinkExternal
                                          size={24}
                                          fill="#4983c7"
                                        />
                                      </span>
                                    </Text>
                                    <Text fontWeight="bold">
                                      {dateParse(el.publication_time)}
                                    </Text>
                                  </a>
                                  <Text
                                    lineHeight="1.5"
                                    fontSize="16px"
                                    maxW="100%"
                                  >
                                    {150 < el.description.length
                                      ? `${el.description.substring(0, 150)}...`
                                      : el.description}
                                  </Text>
                                </VStack>
                              </Stack>
                            ))}
                          </HStack>
                        </Box>
                      )}
                    </TabPanel>
                    <TabPanel padding="0">
                      {videos.length > 0 && individualPage && (
                        <Box overflow="scroll" className="container">
                          <HStack
                            gap="20px"
                            overflow="hidden"
                            width="max-content"
                            alignItems="flex-start"
                          >
                            {videos.map((el: any, idx: number) => (
                              <VStack
                                key={`${el.id}-${idx}`}
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
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Container>
            </Box>
          ) : null}
        </>
      )}
    </>
  );
};

export default IndividualCoin;
