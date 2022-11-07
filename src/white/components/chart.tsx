import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
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
} from "@chakra-ui/react";
import Image from "next/image";
import Bitcoin from "../../white/btc.svg";

type Props = {
  chartType: string;
};

// TODO add timestamp to refresh data every 10 minutes
// it would be better to pull more frequently but this is a free tier with limited call requests per timeframe

const ChartComponent = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [cryptoData, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState("Area");
  const [timeFrame, setTimeFrame] = useState<number | string>(30);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [twentyFourHourValue, setTwentyFourHourValue] = useState(0);

  useEffect(() => {
    const getData = async () => {
      // const date = new Date();
      // const to = Math.floor(date.getTime() / 1000);
      // const from = (date.getTime() - timeFrame * 24 * 60 * 60 * 1000) / 1000;
      let crypto: any[] = [];
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

          crypto.push(frame);
        });
        // data = resData.prices;
      }
      setData(crypto);
      setCurrentValue(crypto[crypto.length - 1].open);
      console.log(crypto[0].value, crypto[1].value);
      setTwentyFourHourValue(crypto[0].open);
    };
    getData();
  }, [timeFrame]);

  useEffect(() => {});

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef?.current?.clientWidth,
        height: chartContainerRef?.current?.clientHeight,
      });
      chart.timeScale().fitContent();
    };

    const chart = createChart(chartContainerRef?.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "white",
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
        horzLine: {
          visible: false,
        },
      },
      timeScale: {
        borderVisible: false,
      },
      leftPriceScale: {
        visible: true,
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
        case "Area":
          newSeries = chart.addAreaSeries({
            lineColor: "#4983C6",
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
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
          });
          newSeries.setData(cryptoData);
          break;

        case "Bar":
          newSeries = chart.addBarSeries({
            upColor: "#26a69a",
            downColor: "#ef5350",
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
  }, [chartType, cryptoData]);

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
        backgroundColor="#133364"
        position="relative"
      >
        <HStack>
          <Box>
            <Image src={Bitcoin} alt="bitcoin" />
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
              <AiFillCaretUp fill="green" size={16} />
            ) : (
              <AiFillCaretDown fill="red" size={16} />
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
              <MenuButton as={Button}>Chart Type</MenuButton>
              <MenuList>
                <MenuItem onClick={() => setChartType("Area")}>Area</MenuItem>
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
                color={timeFrame === el.query ? "#1099FA" : "white"}
                fontSize="14px"
                fontWeight="medium"
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
