import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { RiSettings3Fill } from "react-icons/ri";
import { NumericFormat } from "react-number-format";
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
} from "@chakra-ui/react";
import Image from "next/image";
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

const ChartComponent = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [cryptoData, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState("Line");
  const [timeFrame, setTimeFrame] = useState<number | string>(30);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [twentyFourHourValue, setTwentyFourHourValue] = useState(0);
  const [timeFrameMax, setTimeFrameMax] = useState(0);
  const [timeFrameLow, setTimeFrameLow] = useState(0);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const getData = async () => {
      // const date = new Date();
      // const to = Math.floor(date.getTime() / 1000);
      // const from = (date.getTime() - timeFrame * 24 * 60 * 60 * 1000) / 1000;
      let crypto: any[] = [];
      let low = Infinity;
      let high = 0;
      const bitcoinData = await fetch(
        // `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`
        `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=${timeFrame}`
      );
      if (bitcoinData.ok) {
        const resData = await bitcoinData.json();
        // const from =
        //   Math.floor(new Date().getTime() - 24 * 60 * 60 * 1000) / 1000;

        resData.forEach((el: any) => {
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
        // data = resData.prices;
      }
      setData(crypto);
      setCurrentValue(crypto[crypto.length - 1].open);
      console.log(crypto[0].value, crypto[1].value);
      setTwentyFourHourValue(crypto[0].open);
      setTimeFrameMax(high);
      setTimeFrameLow(low);
    };
    getData();
  }, [timeFrame]);

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

  return (
    <Box p="40px 0">
      <Box
        padding=" 10px 14px 40px 14px"
        backgroundColor={colorMode === "light" ? "white" : "#133364"}
        position="relative"
        boxShadow="md"
      >
        <HStack>
          <Box>
            <Image
              src={colorMode === "light" ? BitcoinLightMode : Bitcoin}
              alt="bitcoin"
            />
          </Box>
          <Text fontWeight="bold">Bitcoin</Text>
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
    </Box>
  );
};

const Chart = (props: any) => {
  return <ChartComponent {...props}></ChartComponent>;
};

export default Chart;
