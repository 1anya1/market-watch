import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  ISeriesApi,
  SeriesOptionsMap,
} from "lightweight-charts";

import { NumericFormat } from "react-number-format";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  Container,
  useColorMode,
} from "@chakra-ui/react";
import { RiSettings3Fill } from "react-icons/ri";
import { AiFillCaretDown, AiFillCaretUp, AiOutlineDown } from "react-icons/ai";

const MainChart = (props: any) => {
  const {
    cryptoData,
    timeFrame,
    setTimeFrame,
    initalPricePoint,
    initialPercent,
    timeFrames,
  } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const [showToolTip, setShowTooltip] = useState(false);
  const toolTipRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState("Line");
  const [tooltipDate, setTooltipData] = useState<JSX.Element | null>(null);
  const [coordinates, setCoordinates] = useState({
    top: "unset",
    left: "unset",
  });
  const colors = {
    red: "#f13d3d",
    green: "#039f65",
    blue: colorMode === "light" ? "#1099fa" : "#4983C6",
    gray: "#ECECEC",
  };
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
          borderVisible: false,

          tickMarkFormatter: (time: number) => {
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
            return timeFrame === 1
              ? withPmAm
              : timeFrame === "max"
              ? year
              : month;
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
        },
      });
      chart.timeScale().fitContent();

      if (cryptoData.length > 0) {
        let newSeries: ISeriesApi<keyof SeriesOptionsMap>;
        switch (chartType) {
          case "Line":
            setShowTooltip(false);
            newSeries = chart.addLineSeries({
              color: colors.blue,
              lastValueVisible: false,
              priceLineColor: "transparent",
              crosshairMarkerVisible: true,
              crosshairMarkerRadius: 6,
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
              color: colorMode === "light" ? "#1099fa" : "#4983C6",
            });
            newSeries.setData(cryptoData);
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

            const date = new Date(Number(param.time) * 1000).toISOString();
            const t = date.slice(0, 10).split("-");
            const startingVal = cryptoData[0].value;
            let close = 0;
            const val: any = param.seriesPrices.get(newSeries);
            if (chartType === "Candle") {
              close = Number(val?.close) || 0;
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
                  <Text variant="small-font">{`${days[dIDX]}, ${monthNames[mIDX]} ${t[2]}, ${t[0]}`}</Text>
                </HStack>
                <HStack>
                  <Text variant="small-font">Price (USD):</Text>
                  <NumericFormat
                    value={Number(close)}
                    prefix={"$"}
                    displayType="text"
                    thousandSeparator=","
                    className="price-tip"
                  />
                </HStack>
                <HStack>
                  <Text variant="small-font">Change:</Text>
                  <HStack spacing="0" gap="2px">
                    {currPercentChange > 0 ? (
                      <AiFillCaretUp fill="var(--green)" size={14} />
                    ) : (
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
  }, [
    chartType,
    colorMode,
    colors.blue,
    colors.green,
    colors.red,
    cryptoData,
    currWidth,
    initalPricePoint,
    timeFrame,
  ]);

  return (
    <Box width="100%">
      <Container
        variant="box-component"
        width="100% !important"
        maxW="100%"
        padding="20px 20px 40px 20px"
        // backgroundColor={colorMode === "light" ? "#f5f6fa" : "#133364"}
        position="relative"
        overflow="hidden"
      >
        <HStack
          flexWrap="wrap"
          gap="11px"
          pb="20px"
          spacing="0"
          justifyContent="space-between"
        >
          <HStack>
            <Box fontSize={{ base: "18px", sm: "24px", md: "28px" }}>
              <NumericFormat
                value={initalPricePoint}
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

            <HStack
              spacing="0"
              bg={initialPercent > 0 ? "green" : "red"}
              gap="2px"
              p="2px 4px"
              borderRadius="4px"
            >
              {initialPercent > 0 ? (
                <AiFillCaretUp fill="white" size={12} />
              ) : (
                <AiFillCaretDown fill="white" size={12} />
              )}
              <HStack margin="0 !important">
                <Text color="white" variant="chart-percent">
                  {initialPercent.toFixed(2)}%
                </Text>
              </HStack>
            </HStack>
          </HStack>
          <HStack spacing="0" gap="11px">
            <Menu>
              <MenuButton>
                <HStack>
                  <Text>Date Range</Text>

                  <AiOutlineDown size={12} style={{ strokeWidth: "20" }} />
                </HStack>
              </MenuButton>
              <MenuList zIndex="14">
                {timeFrames.map((el: any, idx: number) => (
                  <MenuItem
                    key={`${el.val}-${idx}`}
                    onClick={() => setTimeFrame(el.query)}
                    bg={
                      el.val === timeFrame
                        ? "rgba(255, 255, 255, 0.06)"
                        : "unset"
                    }
                    _focus={{ bg: "unset" }}
                  >
                    {el.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

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
                <MenuItem onClick={() => setChartType("Line")}>Line</MenuItem>

                <MenuItem onClick={() => setChartType("Candle")}>
                  Candlestick
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
        <Box>
          <Box ref={chartContainerRef} height={{ base: "230px", lg: "300px" }}>
            <Text fontSize="10px" position="absolute" bottom="2" right="5">
              Powered by CoinGecko API
            </Text>
          </Box>
          <Box
            position="absolute"
            zIndex="15"
            pointerEvents="none"
            ref={toolTipRef}
            top={coordinates ? coordinates.top : "unset"}
            left={coordinates ? coordinates.left : "unset"}
            bg={colorMode === "light" ? "white" : "#030c19"}
            borderRadius="8px"
            display={showToolTip ? "block" : "none"}
            p="10px"
            minW="160px"
            shadow="md"
          >
            {tooltipDate}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MainChart;
