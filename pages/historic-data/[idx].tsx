import {
  Tr,
  Td,
  Text,
  useColorMode,
  Box,
  HStack,
  Container,
  Divider,
  VStack,
  Stack,
  MenuButton,
  Menu,
  MenuItem,
  Button,
  MenuList,
  Collapse,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { FaShareAlt } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import { AiOutlineDown } from "react-icons/ai";
import FormattedNumber from "../../src/components/number-formatter";
import DataTable from "../../src/components/table/table";
const Chart = dynamic(() => import("../../src/components/charts/mini-chart"), {
  ssr: false,
});

type DataPoints = {
  time: number;
  open: number;
  high: number;
  low: any;
  close: number;
  marketCap: number;
  value: number;
  volume: number;
};
const HistoricData = () => {
  const [days, setDays] = useState<string | number>(30);
  const router = useRouter();
  const coin = router.query.idx;
  const [data, setData] = useState<DataPoints[] | []>([]);
  const { colorMode } = useColorMode();
  const [dataFetched, setDataFetched] = useState(false);
  const [onDay, setOnDay] = useState<any[] | []>([]);
  const [coinData, setCoinData] = useState<any>({});

  const timeFrameOptions = [
    { query: "7 Days", val: 7 },
    { query: "14 Days", val: 14 },
    { query: "30 Days", val: 30 },
    { query: "90 Days", val: 90 },
    { query: "6 Months", val: 180 },
    { query: "1 Year", val: 365 },
    { query: "All Time", val: "max" },
  ];
  const columnNames = [
    "Date",
    "Price",
    "Open",
    "High",
    "Low",
    "Close",
    "Volume",
    "MarketCap",
  ];

  useEffect(() => {
    const getData = async () => {
      await Promise.all([
        await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=usd&days=${days}`
        ),

        await fetch(`
      https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}&interval=daily`),

        await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
        ),
      ])

        .then(async ([ohlcRes, marketRes, coinRes]) => {
          const market = await marketRes.json();
          const ohlc = await ohlcRes.json();
          const coin = await coinRes.json();

          return [market, ohlc, coin];
        })
        .then(async ([ohlc, market, coin]) => {
          const data: any = [];
          market.forEach((el: any) => {
            const [time, open, high, low, close] = el;
            const t = new Date(time).toISOString().split("T")[0];
            const idx = ohlc.prices.findIndex(
              (item: any[]) => item[0] === time
            );

            if (idx !== -1) {
              const [, marketCap] = ohlc.market_caps[idx];
              const [, value] = ohlc.prices[idx];
              const [, volume] = ohlc.total_volumes[idx];

              const timeData: DataPoints = {
                time: new Date(time / 1000).getTime(),
                open,
                high,
                low,
                close,
                marketCap,
                value,
                volume,
              };
              data.push(timeData);
            }
          });

          setData(data);
          setDataFetched(true);
          setCoinData(coin);
        });
    };
    getData();
  }, [coin, days]);

  useEffect(() => {
    if (data.length > 0 && onDay.length < 1) {
      fetch(
        `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=max&interval=daily`
      )
        .then((res) => res.json())
        .then((allTimeData) => {
          // getting the year difference in order

          const startingPoint = new Date(allTimeData.prices[0][0]);
          const endingPoint = new Date(
            allTimeData.prices[allTimeData.prices.length - 1][0]
          );
          let timeDifference =
            endingPoint.getFullYear() - startingPoint.getFullYear();

          if (startingPoint.getMonth() <= endingPoint.getMonth()) {
            timeDifference =
              endingPoint.getFullYear() - startingPoint.getFullYear();
          } else {
            timeDifference =
              endingPoint.getFullYear() - startingPoint.getFullYear() - 1;
          }

          const timeFrames: string[] = [];
          const obj: any = {};

          // getting timestamps a year apart
          for (let i = 0; i <= timeDifference; i++) {
            const date = new Date(endingPoint);
            const year = date.getFullYear();
            const newYear = year - i;
            const d = date.setFullYear(newYear);
            const dateIOS = new Date(d).toISOString().split("T")[0];
            timeFrames.push(dateIOS);
          }

          const thisDay: { time: any; value: any }[] = [];
          allTimeData.prices.forEach((frame: any[]) => {
            const t = new Date(frame[0]).toISOString().split("T")[0];
            if (timeFrames.indexOf(t) !== -1 && !obj[t]) {
              obj[t] = 1;
              thisDay.push({ time: frame[0], value: frame[1] });
            }
          });
          setOnDay(thisDay);
        });
    }
  }, [coin, data, onDay]);

  const renderTableRow = useCallback(() => {
    const d = [...data];
    return d.reverse().map((el) => (
      <Tr key={el.time} borderTop="unset" h="64px">
        <Td
          p="20px 40px 20px 20px"
          position="sticky"
          left="-1"
          zIndex="2"
          bg={
            colorMode === "light"
              ? "linear-gradient(to left , rgba(245,255,255, 0) 3%, rgba(255,255,255, 1) 14%)"
              : "linear-gradient(to left , rgba(8,28,59, 0) 3%, #030c19 14%)"
          }
        >
          <span style={{ fontSize: "14px", fontWeight: "600" }}>
            {formatTime(el.time, true)}
          </span>
        </Td>
        <Td padding="5px 10px">
          <Box fontSize="14px" fontWeight="500">
            <FormattedNumber
              value={el.value}
              prefix="$"
              className="table-cell"
            />
          </Box>
        </Td>
        <Td padding="5px 10px">
          <Box fontSize="14px" fontWeight="500">
            <FormattedNumber
              value={el.open}
              prefix="$"
              className="table-cell"
            />
          </Box>
        </Td>
        <Td padding="5px 10px">
          <Box fontSize="14px" fontWeight="500">
            <FormattedNumber
              value={el.high}
              prefix="$"
              className="table-cell"
            />
          </Box>
        </Td>
        <Td padding="5px 10px">
          <Box fontSize="14px" fontWeight="500">
            <FormattedNumber value={el.low} prefix="$" className="table-cell" />
          </Box>
        </Td>
        <Td padding="5px 10px">
          <Box fontSize="14px" fontWeight="500">
            <FormattedNumber
              value={el.close}
              prefix="$"
              className="table-cell"
            />
          </Box>
        </Td>
        <Td padding="5px 10px">
          <Box fontSize="14px" fontWeight="500">
            <FormattedNumber
              value={el.volume}
              prefix="$"
              className="table-cell"
            />
          </Box>
        </Td>
        <Td padding="5px 10px">
          <Box fontSize="14px" fontWeight="500">
            <FormattedNumber
              value={el.marketCap}
              prefix="$"
              className="table-cell"
            />
          </Box>
        </Td>
      </Tr>
    ));
  }, [colorMode, data]);
  const formatTime = (time: number, withYear: boolean) => {
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(time * 1000);
    return withYear
      ? `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
      : `${month[date.getMonth()]} ${date.getDate()}`;
  };

  const [heightShow, setHeightShow] = useState(false);

  // using callback to memoize already present data
  const renderOnDay = useCallback(() => {
    const d = [...onDay];

    return d.reverse().map((el, idx) => (
      <VStack
        key={`${el.time}`}
        alignItems="flex-start"
        width={{ base: "100%" }}
        spacing="0"
      >
        <Divider
          orientation="vertical"
          height={6}
          display={idx > 0 ? "block" : "none"}
          marginInlineStart="8px !important"
          color="#a0aec0"
          opacity={1}
          m="6px 0"
        />
        <HStack
          width={{ base: "100%" }}
          spacing="0"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <HStack
            gap={{ base: "8px", sm: "14px" }}
            spacing="0"
            flexDir={{ base: "column", xxs: "row" }}
            alignItems={{ base: "flex-start", xxs: "center" }}
          >
            <BiTimeFive
              size={18}
              fill={colorMode === "light" ? "#77818f" : "#a0aec0"}
            />

            <Text variant="body-gray-bold">
              {`${idx > 0 ? idx : ""} ${
                idx === 1
                  ? "Year Ago"
                  : idx === 0
                  ? formatTime(data[data.length - 1].time, true)
                  : "Years Ago"
              } `}
            </Text>
          </HStack>

          <FormattedNumber value={el.value} prefix="$" className="h-4" />
        </HStack>
      </VStack>
    ));
  }, [colorMode, data, onDay]);
  const [hxCompoentnHeight, sethxCompoentnHeight] = useState(0);
  const [maxHX, setMaxHX] = useState(0);
  useEffect(() => {
    const width = window.innerWidth;
    if (width > 991) {
      sethxCompoentnHeight(340);
      setMaxHX(5);
    } else {
      sethxCompoentnHeight(170);
      setMaxHX(3);
    }
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 991) {
        sethxCompoentnHeight(340);
        setMaxHX(5);
      } else {
        sethxCompoentnHeight(170);
        setMaxHX(3);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <VStack pb="20px" pt="40px" alignItems="flex-start">
        <HStack>
          {coinData?.image?.small && (
            <Box
              position="relative"
              h={{ base: "28px", lg: "32px" }}
              w={{ base: "28px", md: "32px" }}
            >
              <Image src={coinData.image.small} alt="coin name" layout="fill" />
            </Box>
          )}
          <Text textTransform="capitalize" variant="h-3" pb="0">
            {coin} Historic Data
          </Text>
        </HStack>
        <HStack>
          <Menu>
            <MenuButton>
              <HStack>
                <Text>Date Range</Text>

                <AiOutlineDown size={12} style={{ strokeWidth: "20" }} />
              </HStack>
            </MenuButton>
            <MenuList zIndex="14">
              {timeFrameOptions.map((el) => (
                <MenuItem
                  key={el.val}
                  onClick={() => setDays(el.val)}
                  bg={el.val === days ? "rgba(255, 255, 255, 0.06)" : "unset"}
                  _focus={{ bg: "unset" }}
                >
                  {el.query}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Link passHref href={`/coins/${coin}`}>
            <Button variant="medium-hollow">View Coin</Button>
          </Link>
          <Button variant="medium-hollow">
            <FaShareAlt />
          </Button>
        </HStack>
      </VStack>
      <Stack
        flexDir={{ base: "column", lg: "row" }}
        spacing="0"
        gap="20px"
        pb="20px"
      >
        {dataFetched ? (
          <Container
            variant="box-component"
            width={{ base: "100%", lg: "calc(100% - 400px)" }}
            maxW="100%"
            padding="20px 20px 40px 20px"
            position="relative"
            overflow="hidden"
            height="max-content"
          >
            <Chart data={data} />
          </Container>
        ) : (
          <Box
            padding="6"
            boxShadow="lg"
            bg={colorMode === "light" ? "white" : "#133364"}
            width={{ base: "100%", lg: "calc(100% - 400px)" }}
            h="503px"
          />
        )}
        {onDay.length > 0 ? (
          <Container
            variant="box-component"
            width={{ base: "100%", lg: "400px" }}
            p="20px"
          >
            <Text variant="h-3" pb="20px" textTransform="capitalize">
              Historic {coin} Prices
            </Text>

            <Collapse
              startingHeight={
                onDay.length <= maxHX ? "100%" : hxCompoentnHeight
              }
              in={heightShow}
            >
              <Stack spacing="0">{renderOnDay()}</Stack>
            </Collapse>
            {onDay.length > maxHX && (
              <Box pt="20px">
                {!heightShow ? (
                  <HiArrowCircleDown
                    size={36}
                    style={{ margin: "0 auto" }}
                    fill="#4983c6"
                    onClick={() => setHeightShow(!heightShow)}
                  />
                ) : (
                  <HiArrowCircleUp
                    size={36}
                    style={{ margin: "0 auto" }}
                    fill="#4983c6"
                    onClick={() => setHeightShow(!heightShow)}
                  />
                )}
              </Box>
            )}
          </Container>
        ) : (
          <Box
            padding="6"
            boxShadow="lg"
            width={{ base: "100%", lg: "400px" }}
            h="503px"
            bg={colorMode === "light" ? "white" : "#133364"}
          />
        )}
      </Stack>
      <DataTable tableColumns={columnNames} renderData={renderTableRow} />
    </>
  );
};

export default HistoricData;
