import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

type Props = {
  chartType: string;
  data: any;
};

const ChartComponent = (props: Props) => {
  const { data, chartType } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // const [data, setData] = useState<any[]>([]);
  // useEffect(() => {
  //   const getData = async () => {
  //     let data = [];
  //     const bitcoinData = await fetch(
  //       "https://price-api.crypto.com/price/v2/d/bitcoin"
  //     );
  //     if (bitcoinData.ok) {
  //       const resData = await bitcoinData.json();
  //       data = resData.prices;
  //     }
  //     setData(data);
  //   };
  //   getData();
  // });

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

    // const newSeries = chart.addAreaSeries({
    //   //   lineColor,
    //   //   topColor: areaTopColor,
    //   //   bottomColor: areaBottomColor,
    // });
    // newSeries.setData(data);

    let newSeries;
    switch (chartType) {
      case "Area":
        newSeries = chart.addAreaSeries({
          //   lineColor,
          topColor: "purple",
          //   bottomColor: areaBottomColor,
        });
        newSeries.setData(data);
        break;

      case "Bar":
        newSeries = chart.addHistogramSeries({
          color: "green",
        });
        newSeries.setData(data);
        break;
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, chartType]);

  return <Box ref={chartContainerRef} height="200px" />;
};

const initialData = [
  { time: "2018-12-22", value: 32.51 },
  { time: "2018-12-23", value: 31.11 },
  { time: "2018-12-24", value: 27.02 },
  { time: "2018-12-25", value: 27.32 },
  { time: "2018-12-26", value: 25.17 },
  { time: "2018-12-27", value: 28.89 },
  { time: "2018-12-28", value: 25.46 },
  { time: "2018-12-29", value: 23.92 },
  { time: "2018-12-30", value: 22.68 },
  { time: "2018-12-31", value: 22.67 },
];

const Chart = (props: any) => {
  return <ChartComponent {...props} data={initialData}></ChartComponent>;
};

export default Chart;
