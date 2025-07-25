import {
  createChart,
  ColorType,
  ISeriesApi,
  SeriesOptionsMap,
} from "lightweight-charts";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { NumericFormat } from "react-number-format";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { RiSettings3Fill } from "react-icons/ri";
import numberFormater from "../../../helper-functions/number-formatter";

const MiniChart = (props: any) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const toolTipRef = useRef<HTMLDivElement>(null);
  const [cryptoData, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState("Line");
  const [showToolTip, setShowTooltip] = useState(false);
  const [percentChange, setPercentChange] = useState(0);
  const [tooltipDate, setTooltipData] = useState<JSX.Element | null>(null);
  const [coordinates, setCoordinates] = useState({
    top: "unset",
    left: "unset",
  });
  const { colorMode } = useColorMode();
  const { data, renderTimeSelection, volume, title } = props;

  const [currWidth, setWidth] = useState(0);
  // const currTimeFrameSelection = useCallback(() => {
  //   (data, renderTimeSelection);
  //   const time = timeFrames.filter((el: any) => el.query === timeFrame);
  //   ({ time });
  //   return time[0].name;
  // }, [timeFrame, timeFrames]);

  useEffect(() => {
    if (data) {
      const percent =
        (data[data?.length - 1]?.value * 100) / data[0]?.value - 100;
      setPercentChange(percent);
    }
  }, [data]);

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
    if (chartContainerRef?.current && data?.length > 0) {
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
          chart.options;
        }
      };

      // const handleResize =()=>{
      //   ('inhere')
      // }
      const end = data[data.length - 1]?.value;
      const start = data[0]?.value;

      const chart = createChart(chartContainerRef?.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: colorMode === "light" ? "black" : "white",

          // responsive: true,
          // maintainAspectRatio: false,
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
          vertLine: { visible: true, labelVisible: false },
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
          // lockVisibleTimeRangeOnResize: true,
          borderVisible: false,
          barSpacing: 4,
          minBarSpacing: 0,
          timeVisible: true,
          tickMarkFormatter: (time: number, tickMarkType = 1) => {
            const hours = new Date(time * 1000);
            const withPmAm = hours.toLocaleTimeString("en-US", {
              // en-US can be set to 'default' to use user's browser settings
              hour: "2-digit",
              minute: "2-digit",
            });

            const date = new Date(time * 1000).toISOString();
            const t = date.slice(0, 10).split("-");
            const month = `${t[1]}/${t[2]}`;
            const year = `${t[1]}/${t[2]}/${t[0]}`;
            return year;
          },
        },
        leftPriceScale: {
          // visible: chartContainerRef?.current?.clientWidth > 480 ? true : false,
          visible: false,
          borderVisible: false,
          drawTicks: false,
        },
        rightPriceScale: {
          visible: false,
          scaleMargins: {
            top: volume ? 0.1 : undefined,
            bottom: volume ? 0.4 : undefined,
          },
        },
      });
      chart.timeScale().fitContent();
      // chart.resize(

      //   chartContainerRef?.current?.clientWidth,
      //   chartContainerRef?.current?.clientHeight,
      // );

      if (data.length > 0) {
        let newSeries: ISeriesApi<keyof SeriesOptionsMap>;
        let newVolume: ISeriesApi<keyof SeriesOptionsMap>;

        switch (chartType) {
          case "Line":
            setShowTooltip(false);
            newSeries = chart.addLineSeries({
              color: start > end ? colors.red : colors.green,
              lastValueVisible: false,
              priceLineColor: "transparent",
              crosshairMarkerVisible: true,
              crosshairMarkerRadius: 6,
            });
            newSeries.setData(data);
            if (volume) {
              newVolume = chart.addHistogramSeries({
                color: colorMode === "light" ? "#1099fa" : "#133364",
                priceFormat: {
                  type: "volume",
                },
                scaleMargins: {
                  top: 0.9,
                  bottom: 0,
                },
                priceScaleId: "",
              });
              newVolume.setData(volume);
            }

            break;

          case "Candle":
            setShowTooltip(false);
            newSeries = chart.addCandlestickSeries({
              upColor: colors.green,
              downColor: colors.red,
              borderVisible: false,
              wickUpColor: colors.green,
              wickDownColor: colors.red,
            });

            newSeries.setData(data);

            break;
        }

        chart.subscribeCrosshairMove((param) => {
          if (
            param.point === undefined ||
            !param.time ||
            param.point.x < 0 ||
            param.point.y < 0
          ) {
            setShowTooltip(false);
          } else {
            const day = new Date(Number(param.time) * 1000);
            const mIDX = day.getMonth();
            const dIDX = day.getDay();
            const year = day.getFullYear();
            const d = day.getDate();
            const days = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];
            const monthNames = [
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

            // const date = new Date(Number(param.time) * 1000).toISOString();
            // const t = date.slice(0, 10).split("-");


            const startingVal = data[0].value;
            let close = 0;
            let high = 0;
            let low = 0;
            const val: any = param.seriesPrices.get(newSeries);
            const volume = param?.seriesPrices?.get(newVolume);
            if (chartType === "Candle") {
              close = Number(val?.close) || 0;
              // high = Number(val?.high) || 0;
              // low = val?.low || 0;
            } else if (chartContainerRef.current) {
              close = Number(val);
            }

            const currPercentChange =
              (Number(close) * 100) / Number(startingVal) - 100;

            const tooltipHeight = (toolTipRef?.current?.clientHeight || 0) + 20;
            const tooltipWidth = (toolTipRef?.current?.clientWidth || 0) + 10;
            const containerWidth = chartContainerRef?.current?.clientWidth || 0;
            let left = Number(param.point.x) + 20;
            if (left + tooltipWidth > containerWidth - left) {
              const right =
                containerWidth - (containerWidth - left + tooltipWidth);
              if (right < 0) {
                left =
                  Number(param.point.x) - Number(tooltipWidth) - right + 40;
              } else {
                left = Number(param.point.x) - Number(tooltipWidth) + 20;
              }
            }

            const chartHeight = currWidth > 992 ? 300 : 200;

            let top = Number(param.point.y);
            if (param.point.y < 176) {
              top = param.point.y + 85;
            }

            if (Number(param.point.y) >= 98) {
              if (currWidth < 552) {
                top = param.point.y;
              } else {
                top = param.point.y - 10;
              }
            }

            const timeAndDate = (
              <>
                <HStack>
                  <Text variant="small-font">{`${days[dIDX]}, ${monthNames[mIDX]} ${d}, ${year}`}</Text>
                </HStack>
                <HStack>
                  <Text variant="small-font">
                    {volume ? "Total Value (USD)" : "Price (USD)"}
                  </Text>
                  <FormattedNumber value={Number(close)} prefix="$" />
                </HStack>
                <HStack>
                  <Text variant="small-font">Change:</Text>
                  <HStack spacing="0" gap="2px">
                    {currPercentChange > 0 ? (
                      <AiFillCaretUp fill="var(--green)" size={14} />
                    ) : (
                      // eslint-disable-next-line react/jsx-no-undef
                      <AiFillCaretDown fill="var(--red)" size={14} />
                    )}

                    <Text
                      variant="price-tip"
                      color={currPercentChange > 0 ? "green" : "red"}
                    >
                      {Math.abs(currPercentChange).toFixed(2)}%
                    </Text>
                  </HStack>
                </HStack>
                {volume && (
                  <HStack>
                    <Text variant="small-font">Volume (USD):</Text>
                    <FormattedNumber value={Number(volume)} prefix="$" />
                  </HStack>
                )}
              </>
            );

            setCoordinates({
              top: `${top}px`,

              left: `${left}px`,
            });
            setTooltipData(timeAndDate);
            setShowTooltip(true);
          }
        });
      }

      window.addEventListener("resize", handleResize);

      return () => {

        window.removeEventListener("resize", handleResize);

        chart.remove();
      };
    }
  }, [chartType, colorMode, cryptoData, currWidth, data, volume]);
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
          fontWeight: "bold",
        }}
      />
    );
  };

  return (
    <>
      {data?.length > 0 ? (
        <Box w="100%">
          <HStack
            spacing="0"
            justifyContent="space-between"
            gap="10px"
            flexWrap="wrap"
          >
            <HStack>
              <Box fontSize={{ base: "18px", sm: "24px", md: "28px" }}>
                <Text variant="h-3" pb="0">
                  $
                  {numberFormater(
                    data[data.length - 1].value > 0
                      ? data[data.length - 1].value
                      : data[data.length - 1].value
                  )}
                </Text>
              </Box>
              <HStack
                spacing="0"
                bg={percentChange > 0 ? "green" : "red"}
                gap="2px"
                p="2px 4px"
                borderRadius="4px"
              >
                {percentChange > 0 ? (
                  <AiFillCaretUp fill="white" size={12} />
                ) : (
                  <AiFillCaretDown fill="white" size={12} />
                )}
                <HStack margin="0 !important">
                  <Text color="white" variant="chart-percent">
                    {percentChange.toFixed(2)}%
                  </Text>
                </HStack>
              </HStack>
            </HStack>
            <HStack>
              {renderTimeSelection()}
              {!volume && (
                <Menu>
                  <MenuButton>
                    <RiSettings3Fill
                      fill={
                        // colorMode === "light" ? colors.gray : colors.blue
                        // "#4983c6"
                        colorMode === "light" ? "#1099fa" : "white"
                      }
                      size={18}
                    />
                  </MenuButton>
                  <MenuList zIndex="10">
                    <MenuItem onClick={() => setChartType("Line")}>
                      Line
                    </MenuItem>

                    <MenuItem onClick={() => setChartType("Candle")}>
                      Candlestick
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </HStack>
          </HStack>
          <Box
            ref={chartContainerRef}
            height={{ base: "300px", lg: "400px" }}
            w="100%"
          >
            {!volume && (
              <Text fontSize="10px" position="absolute" bottom="2" right="5">
                Powered by CoinGecko API
              </Text>
            )}
          </Box>
          <Box
            position="absolute"
            zIndex="15"
            pointerEvents="none"
            ref={toolTipRef}
            top={coordinates ? coordinates.top : "unset"}
            left={coordinates ? coordinates.left : "unset"}
            bg={colorMode === "light" ? "#f5f6fa" : "#030c19"}
            borderRadius="8px"
            display={showToolTip ? "block" : "none"}
            p="10px"
            minW="160px"
            shadow="md"
          >
            {tooltipDate}
          </Box>
        </Box>
      ) : (
        <Stack
          ref={chartContainerRef}
          height={{ base: "300px", lg: "400px" }}
          alignItems="center"
          w="inherit"
        >
          <Text variant="h-4">No Data Available</Text>
        </Stack>
      )}
    </>
  );
};

export default MiniChart;
