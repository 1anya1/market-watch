import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
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
} from "@chakra-ui/react";
import {
  createChart,
  ColorType,
  ISeriesApi,
  SeriesOptionsMap,
} from "lightweight-charts";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { NumericFormat } from "react-number-format";
const Chart = dynamic(() => import("../../src/components/mini-chart"), {
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
  const [chartType, setChartType] = useState("Line");
  const router = useRouter();
  const coin = router.query.idx;
  const [data, setData] = useState<DataPoints[] | []>([]);
  const { colorMode } = useColorMode();
  const [tooltipDate, setTooltipData] = useState<JSX.Element | null>(null);
  const [onDay, setOnDay] = useState<any[] | []>([]);
  const timeFrameOptions = [7, 30, 160, 365, "max"];
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
          `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=max&interval=daily`
        ),
      ])

        .then(async ([ohlcRes, marketRes, allTime]) => {
          const market = await marketRes.json();
          const ohlc = await ohlcRes.json();
          const allTimeData = await allTime.json();
          return [market, ohlc, allTimeData];
        })
        .then(async ([ohlc, market, allTimeData]) => {
          const startingPoint = new Date(allTimeData.prices[0][0]);
          console.log(new Date(startingPoint));
          const endingPoint = new Date(ohlc.prices[ohlc.prices.length - 1][0]);
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

          for (let i = 0; i <= timeDifference; i++) {
            const date = new Date(endingPoint);
            const year = date.getFullYear();
            const newYear = year - i;
            const d = date.setFullYear(newYear);
            const el = d.toString().slice(0, 5);
            timeFrames.push(el);
            obj[el] = 1;
          }
          console.log(obj);
          const thisDay: { time: any; value: any }[] = [];
          allTimeData.prices.forEach((frame: any[]) => {
            const t = frame[0].toString().slice(0, 5);
            if (timeFrames.indexOf(t) !== -1 && obj[t]) {
              obj[t] = obj[t] - 1;
              thisDay.push({ time: frame[0], value: frame[1] });
            }
          });

          const data: any = [];
          market.forEach((el: any) => {
            const [time, open, high, low, close] = el;
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
          setOnDay(thisDay);
        });
    };
    getData();
  }, [coin, days]);

  const formatTime = (time: number) => {
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
    return `${month[date.getMonth()]} ${date.getDate()}`;
  };
  const FormattedNumber = (props: any) => {
    let { value, prefix, sufffix } = props;
    if (value < 1) {
      value = value.toFixed(6);
    } else {
      value = value.toFixed(2);
    }
    return (
      <NumericFormat
        value={value}
        prefix={prefix}
        suffix={sufffix}
        displayType="text"
        thousandSeparator=","
        style={{
          fontSize: "inherit",
          fontWeight: "700",
        }}
      />
    );
  };

  return (
    <>
      <HStack>
        <Text textTransform="capitalize" variant="h-3">
          {coin} Historic Data
        </Text>
        <Menu>
          <MenuButton as={Button}>Actions</MenuButton>
          <MenuList zIndex="10">
            {timeFrameOptions.map((el) => (
              <MenuItem key={el} onClick={() => setDays(el)}>
                {el}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </HStack>

      {data.length > 0 && onDay.length > 0 && (
        <Stack flexDir={{ base: "column", xl: "row" }} spacing="0" gap="20px">
          <Container
            variant="box-component"
            width={{ base: "100%", xl: "calc(100% - 400px)" }}
            maxW="100%"
            padding="20px 20px 40px 20px"
            // backgroundColor={colorMode === "light" ? "#f5f6fa" : "#133364"}
            position="relative"
            overflow="hidden"
            height="max-content"
          >
            <Chart data={data} />
          </Container>

          <Container
            mt="20px"
            variant="box-component"
            width={{ base: "100%", xl: "400px" }}
            // maxW="100%"
            height="max-content"
            padding="20px 20px 40px 20px"
            // backgroundColor={colorMode === "light" ? "#f5f6fa" : "#133364"}
            position="relative"
            overflow="scroll"
            maxH="606px"
          >
            <Text variant="h-3" pb="0">
              Prices On {formatTime(data[data.length - 1].time)}
            </Text>
            <Text variant="h-4" pb="20px" textTransform="capitalize">
              Historic {coin} Prices
            </Text>
            {onDay.reverse().map((el, idx) => (
              <VStack
                key={`${el.time}`}
                alignItems="flex-start"
                width={{ base: "100%" }}
              >
                <Divider
                  orientation="vertical"
                  height={6}
                  display={idx > 0 ? "block" : "none"}
                  marginInlineStart="10px !important"
                  color="#a0aec0"
                  opacity={1}
                />
                <HStack
                  gap={{ base: "10vw", md: "20px" }}
                  width={{ base: "100%" }}
                  spacing="0"
                  justifyContent="space-between"
                >
                  <HStack
                    gap="10px"
                    spacing="0"
                    flexDir={{ base: "column", xxs: "row" }}
                  >
                    <BiTimeFive size={24} fill="#a0aec0" />

                    <Text variant="med-text-bold" color="#a0aec0">
                      {`
                ${idx > 0 ? idx : ""}

                ${idx === 1 ? "Year Ago" : idx === 0 ? "Today" : "Years Ago"} `}
                    </Text>
                  </HStack>
                  <Box fontSize={{ base: "22px", sm: "24px" }}>
                    <FormattedNumber value={el.value} prefix="$" />
                  </Box>
                </HStack>
              </VStack>
            ))}
          </Container>
        </Stack>
      )}

      <TableContainer mt="40px">
        <Table>
          <TableCaption fontSize="10px" textAlign="right">
            Powered by CoinGecko API
          </TableCaption>
          <Thead>
            <Tr
              bg={colorMode === "light" ? "#f5f6fa" : "#133364"}
              fontSize="10px"
            >
              {columnNames.map((el, idx) => (
                <Th
                  //   textTransform="capitalize"
                  key={el}
                  fontSize="12px"
                  position={idx === 0 ? "sticky" : "unset"}
                  left={idx === 0 ? "-1" : "unset"}
                  zIndex={idx === 0 ? "2" : "unset"}
                  borderRadius={idx === 0 ? "8px 0 0 0" : "unset"}
                  bgColor={colorMode === "light" ? "#f5f6fa" : "#103363"}
                  bg={
                    idx === 0
                      ? colorMode === "light"
                        ? "linear-gradient(to left , rgba(245,246,250, 0) 3%, rgba(245,246,250, 1) 14%)"
                        : "linear-gradient(to left , rgba(17,51,99, 0) 3%, rgba(17,51,99, 1) 14%)"
                      : "unset"
                  }
                >
                  {el}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0
              ? data.reverse().map((el) => (
                  <Tr key={el.time} borderTop="unset">
                    <Td
                      p="20px 40px 20px 20px"
                      position="sticky"
                      left="-1"
                      zIndex="2"
                      bg={
                        colorMode === "light"
                          ? "linear-gradient(to left , rgba(245,255,255, 0) 3%, rgba(255,255,255, 1) 14%)"
                          : "linear-gradient(to left , rgba(8,28,59, 0) 3%, rgba(8,28,59, 1) 14%)"
                      }
                      // padding="5px 30px 5px 10px"
                      // maxW={{ base: "150px", sm: "unset" }}
                    >
                      {formatTime(el.time)}
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={el.value} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={el.open} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={el.high} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={el.low} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={el.close} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={el.volume} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={el.marketCap} prefix="$" />
                    </Td>
                  </Tr>
                ))
              : "undefiend"}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default HistoricData;
