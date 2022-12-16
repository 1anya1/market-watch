import {
  createChart,
  ColorType,
  ISeriesApi,
  SeriesOptionsMap,
} from "lightweight-charts";
import { SetStateAction, useEffect, useRef, useState } from "react";

import {
  Box,
 
  Text,
  useColorMode,
} from "@chakra-ui/react";


const MiniChart = (props: any) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
 
  const { colorMode } = useColorMode();
  const { data, table } = props;

  const endingValue = data[data.length - 1];
  const startingValue = data[0];
  console.log(startingValue, endingValue)
  const [dataChart, setDataChart] = useState<any[]>([]);
  useEffect(() => {
    const dataArr: SetStateAction<any[]> = [];
    data.forEach((el: any, idx: any) => dataArr.push({ value: el, time: idx }));

    setDataChart(dataArr);
  }, [data]);


  const [currWidth, setWidth] = useState(0);

 

  useEffect(() => {
    if (currWidth === 0) {
      setWidth(window.innerWidth);
    }
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [currWidth]);

  useEffect(() => {
    const colors = {
      red: "#f13d3d",
      green: "#039f65",
      blue: colorMode === "light" ? "#1099fa" : "#4983C6",
      gray: "#ECECEC",
    };
    if (chartContainerRef?.current) {
      const handleResize = () => {
        if (chartContainerRef?.current?.clientWidth) {
          chart.applyOptions({
            width: chartContainerRef?.current?.clientWidth,
            height: chartContainerRef?.current?.clientHeight,
            leftPriceScale: {
              visible: false,
              // chartContainerRef?.current?.clientWidth > 480 ? true : false,
            },
            handleScale: {
              axisPressedMouseMove: {
                time: false,
                price: false,
              },
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
          vertLine: { visible: false, labelVisible: false },
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
          barSpacing: 20,
          minBarSpacing: 2,
          visible: false,

   
        },
        leftPriceScale: {
          // visible: chartContainerRef?.current?.clientWidth > 480 ? true : false,
          visible: false,
          borderVisible: false,
          drawTicks: false,
        },
        rightPriceScale: {
          visible: false,
        },
      });
      chart.timeScale().fitContent();

      if (dataChart.length > 0) {
        let newSeries: ISeriesApi<keyof SeriesOptionsMap>;
     
        newSeries = chart.addLineSeries({
          color: startingValue > endingValue ? colors.red : colors.green,
          lastValueVisible: false,
          priceLineColor: "transparent",
        });
        newSeries.setData(dataChart);
      }

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);

        chart.remove();
      };
    }
  }, [colorMode, currWidth, data, dataChart, endingValue, startingValue]);

  return dataChart.length > 0 ? (
    <Box
      ref={chartContainerRef}
      height={table ? { base: "50px", sm: "75px" } : "311px"}
    >
      {!table && (
        <Text fontSize="10px" position="absolute" bottom="2" right="5">
          Powered by CoinGecko API
        </Text>
      )}
    </Box>
  ) : (
    <Text>Hello there</Text>
  );
};

export default MiniChart;
