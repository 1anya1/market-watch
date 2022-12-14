import {
  createChart,
  ColorType,
  ISeriesApi,
  SeriesOptionsMap,
} from "lightweight-charts";
import { SetStateAction, useEffect, useRef, useState } from "react";

import {
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { NumericFormat } from "react-number-format";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { RiSettings3Fill } from "react-icons/ri";

const MiniChart = (props: any) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // const toolTipRef = useRef<HTMLDivElement>(null);
  // const [cryptoData, setData] = useState<any[]>([]);
  // const [chartType, setChartType] = useState("Line");
  // const [showToolTip, setShowTooltip] = useState(false);
  // const [percentChange, setPercentChange] = useState(0);
  // const [tooltipDate, setTooltipData] = useState<JSX.Element | null>(null);
  // const [coordinates, setCoordinates] = useState({
  //   top: "unset",
  //   left: "unset",
  // });
  const { colorMode } = useColorMode();
  const { data, table } = props;

  const endingValue = data[data.length - 1];
  const startingValue = data[0];
  const [dataChart, setDataChart] = useState<any[]>([]);
  useEffect(() => {
    const dataArr: SetStateAction<any[]> = [];
    data.forEach((el: any, idx: any) => dataArr.push({ value: el, time: idx }));

    setDataChart(dataArr);
  }, [data]);
  //   useEffect(() => {
  //     const arr: SetStateAction<any[]> = [];
  //     data.forEach((el: any) => {
  //       const dataArr: SetStateAction<any[]> = [];
  //       console.log(dataArr);
  //       el.sparkline_in_7d.price.forEach((val: any, idx: any) =>
  //         dataArr.push({ value: val, time: idx })
  //       );
  //       arr.push(dataArr);
  //     });
  //     setDataChart(arr);
  //   }, [data]);

  const [currWidth, setWidth] = useState(0);

  // useEffect(() => {
  //   console.log(data[0]);
  //   const percent = (data[data.length - 1].value * 100) / data[0].value - 100;
  //   setPercentChange(percent);
  // }, [data]);

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

          //   tickMarkFormatter: (time: number, tickMarkType = 1) => {
          //     const hours = new Date(time * 1000);
          //     const withPmAm = hours.toLocaleTimeString("en-US", {
          //       // en-US can be set to 'default' to use user's browser settings
          //       hour: "2-digit",
          //       minute: "2-digit",
          //     });

          //     const date = new Date(time * 1000).toISOString();
          //     const t = date.slice(0, 10).split("-");
          //     const month = `${t[1]}/${t[2]}`;
          //     const year = `${t[1]}/${t[2]}/${t[0]}`;
          //     return year;
          //   },
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
        // dataChart?.forEach((series: [], index: number) => {
        //   newSeries = chart.addLineSeries({
        //     color: colors.blue,
        //     lastValueVisible: false,
        //     priceLineColor: "transparent",
        //     crosshairMarkerVisible: true,
        //     crosshairMarkerRadius: 6,
        //   });
        //   newSeries.setData(series);
        // });
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
  }, [colorMode, currWidth, data, dataChart]);

  return dataChart.length > 0 ? (
    <Box
      ref={chartContainerRef}
      height={table ? { base: "50px", sm: "75px" } : "311px"}
    >
      <Text fontSize="10px" position="absolute" bottom="2" right="5">
        Powered by CoinGecko API
      </Text>
    </Box>
  ) : (
    <Text>Hello there</Text>
  );
};

export default MiniChart;
