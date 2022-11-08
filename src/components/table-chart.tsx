import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

import { Box, useColorMode } from "@chakra-ui/react";

// TODO add timestamp to refresh data every 10 minutes
// it would be better to pull more frequently but this is a free tier with limited call requests per timeframe

const colors = {
  red: "#f13d3d",
  green: "#039f65",
  blue: "#4983C6",
  gray: "#ECECEC",
};

const TableChartComponent = (props: any) => {
  const { id, change} = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [cryptoData, setData] = useState<any[]>([]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const getData = async () => {
      const bitcoinData = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
      );
      if (bitcoinData.ok) {
        const resData = await bitcoinData.json();
        const crypto: any[] = [];
        resData.prices.forEach((el: any) => {
          const frame = {
            value: el[1],
            time: el[0] / 1000,
          };

          crypto.push(frame);
        });
        setData(crypto);
      }
    };
    getData();
  }, [id]);

  useEffect(() => {
    if (chartContainerRef?.current && cryptoData.length > 0) {
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
          horzLine: { visible: false },
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
          visible:false,
        },
        leftPriceScale: {
          visible: false,
        },
        rightPriceScale: {
          visible: false,
        },
      });
      chart.timeScale().fitContent();

      const newSeries = chart.addLineSeries({
        color:change > 0 ? colors.green : change < 0 ? colors.red : colors.blue,
        lineWidth: 1,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineColor: "transparent",
      });
      newSeries.setData(cryptoData);

      return () => {
        chart.remove();
      };
    }
  }, [change, colorMode, cryptoData]);

  return <Box ref={chartContainerRef} height="50px" width="140px" />;
};

export default TableChartComponent;
