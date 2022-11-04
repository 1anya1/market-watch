import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

type Props = {
  chartType: string;
};

const ChartComponent = (props: Props) => {
  const { chartType } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [cryptoData, setData] = useState<any[]>([]);
  useEffect(() => {
    const getData = async () => {
      let crypto: any[] = [];
      const bitcoinData = await fetch(
        "https://price-api.crypto.com/price/v2/d/bitcoin"
      );
      if (bitcoinData.ok) {
        const resData = await bitcoinData.json();
        resData.prices.forEach((el: any) => {
          const frame = { value: el[1], time: el[0], volume: el[2] };
          crypto.push(frame);
        });
        // data = resData.prices;
      }
      setData(crypto);
    };
    getData();
  }, []);

  useEffect(() => {
    console.log(cryptoData);
  }, [cryptoData]);
  useEffect(() => {
    const handleResize = () => {
      console.log("resizing", chartContainerRef?.current?.clientWidth);
      chart.applyOptions({
        width: chartContainerRef?.current?.clientWidth,
        height: chartContainerRef?.current?.clientHeight,
      });
      chart.timeScale().fitContent();
    };

    const chart = createChart(chartContainerRef?.current, {
      layout: {
        background: { type: ColorType.Solid, color: "pink" },
        // textColor,
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
        // visible: false,
        barSpacing: 20,
        timeVisible: true,
      },
    });
    chart.timeScale().fitContent();

    if (cryptoData.length > 0) {
      let newSeries;
      switch (chartType) {
        case "Area":
          newSeries = chart.addAreaSeries({
            //   lineColor,
            topColor: "purple",
            //   bottomColor: areaBottomColor,
          });
          newSeries.setData(cryptoData);
          break;

        case "Bar":
          newSeries = chart.addHistogramSeries({
            color: "green",
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

  return <Box ref={chartContainerRef} height="200px" />;
};

const Chart = (props: any) => {
  return <ChartComponent {...props}></ChartComponent>;
};

export default Chart;
