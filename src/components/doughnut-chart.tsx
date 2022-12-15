// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// import {
//   Doughnut,
//   getDatasetAtEvent,
//   getElementAtEvent,
// } from "react-chartjs-2";
// import randomColor from "randomcolor";
// import { Box, Container, HStack, Stack, useColorMode } from "@chakra-ui/react";
// import { MdLegendToggle } from "react-icons/md";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const DoughnutChart = (props: any) => {
//   const { global } = props;
//   console.log(global);
//   const [ref, setRef] = useState<any>();
//   const marketCap = global.market_cap_percentage;
//   console.log(marketCap);
//   const backgroundColor: any[] = [];
//   const labels: string[] = [];
//   const values: any[] = [];
//   Object.keys(marketCap).forEach((key, idxl) => {
//     const color = randomColor();
//     backgroundColor.push(color);
//     labels.push(key);
//     values.push(marketCap[key]);
//   });
//   const bg = randomColor({ hue: "blue", count: Object.keys(marketCap).length });
//   console.log(bg);

//   const colors = [
//     "rgba(255, 99, 132, 0.6)",
//     "rgba(54, 162, 235, 0.6)",
//     "rgba(255, 206, 86, 0.6)",
//     "rgba(75, 192, 192, 0.6)",
//     "rgba(113, 34, 109, 0.6)",
//     "rgba(255, 109, 64, 0.6)",
//     "rgba(28, 96, 102, 0.6)",
//     "rgba(248, 51, 140, 0.6)",
//     "rgba(51, 138, 248, 0.6)",
//     "rgba(153, 102, 255, 0.6)",
//   ];

//   const [legend, setLegend] = useState();

//   const onRefChange = useCallback((node) => {
//     // console.log(node, ref)
//     setRef(node); // e.g. change ref state to trigger re-render
//     console.log(node);

//     if (node !== null) {
//       //   setLegend(node);
//     }
//   }, []);

//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: "Percent",
//         data: values,
//         // backgroundColor: bg,
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(75, 192, 192, 0.6)",
//           "rgba(113, 34, 109, 0.6)",
//           "rgba(255, 109, 64, 0.6)",
//           "rgba(28, 96, 102, 0.6)",
//           "rgba(248, 51, 140, 0.6)",
//           "rgba(51, 138, 248, 0.6)",
//           "rgba(153, 102, 255, 0.6)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(113, 34, 109, 1)",
//           "rgba(255, 109, 64, 1)",
//           "rgba(28, 96, 102, 1)",
//           "rgba(248, 51, 140, 1)",
//           "rgba(51, 138, 248, 1)",
//           "rgba(153, 102, 255, 1)",
//         ],
//         borderWidth: 0.5,
//       },
//     ],
//   };
//   //   window.addEventListener("resize", handleResize)
//   //   return () => {
//   //     window.removeEventListener("resize", handleResize)
//   //     chart.remove()
//   //   }

//   const handleClick = (evt, item, legend) => {
//     console.log(evt, item, legend);

//     item.fontColor = "purple";
//     const current = legend.active;
//     console.log({ current });
//     legend.active = !current;
//     legend.chart.update();
//   };

//   const totalValue = values.reduce((total, el) => total + el);
//   console.log(totalValue);
//   const options = {
//     elements: {
//       arc: {
//         // borderJoinStyle: "miter",
//       },
//     },
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         labels: {
//           color: "pink",
//           boxHeight: 20,
//           boxWidth: 20,
//           generateLabels(chart) {
//             console.log({ chart });
//             const data = chart.data;
//             if (data.labels.length && data.datasets.length) {
//               const {
//                 labels: { pointStyle },
//               } = chart.legend.options;

//               return data.labels.map((label, i) => {
//                 const meta = chart.getDatasetMeta(0);
//                 const style = meta.controller.getStyle(i);

//                 return {
//                   text: `${label.toUpperCase()} - ${chart.data.datasets[0].data[
//                     i
//                   ].toFixed(2)}%`,
//                   fillStyle: style.backgroundColor,
//                   strokeStyle: style.borderColor,
//                   lineWidth: style.borderWidth,
//                   pointStyle: pointStyle,
//                   hidden: !chart.getDataVisibility(i),
//                   index: i,
//                   borderRadius: 10,
//                   fontColor: "white",
//                   lineDash: [10],
//                   rotation: 20,
//                 };
//               });
//             }
//             return [];
//           },
//         },
//       },
//       afterDatasetUpdate: function (chart, args, options) {
//         if (chart.data.labels.length) {
//           const chartId = chart.canvas.id;
//           const legendId = `${chartId}-legend`;
//           const ul = document.createElement("ul");
//         //   ul.setAttribute("data-chart-id", chart.id);
//         //   chart.data.labels.forEach((label, i) => {
//         //     ul.innerHTML += `
//         //         <li>
//         //           <span style="background-color: ${chart.data.datasets[0].backgroundColor[i]}"></span>
//         //           ${label}
//         //         </li>
//         //     `;
//         //   });
//         //   $(`#${legendId}`).delegate("li", "click", legendClick);
//         //   $(`#${legendId}`).delegate(
//         //     "li",
//         //     "mouseenter mouseleave",
//         //     legendHover
//         //   );
//           return document.getElementById(legendId).appendChild(ul);
//         }
//         return;
//       },

//       //   legendCallback: (chart) => {
//       //     const renderLabels = (chart) => {
//       //       const { data } = chart;
//       //       return data.datasets[0].data
//       //         .map(
//       //           (_, i) =>
//       //             `<li>
//       //                 <div id="legend-${i}-item" class="legend-item">
//       //                   <span style="background-color:
//       //                     ${data.datasets[0].backgroundColor[i]}">
//       //                     &nbsp;&nbsp;&nbsp;&nbsp;
//       //                   </span>
//       //                   ${
//       //                     data.labels[i] &&
//       //                     `<span class="label">${data.labels[i]}: $${data.datasets[0].data[i]}</span>`
//       //                   }
//       //                 </div>
//       //             </li>
//       //           `
//       //         )
//       //         .join("");
//       //     };
//       //     return `
//       //       <ul class="chartjs-legend">
//       //         ${renderLabels(chart)}
//       //       </ul>`;
//       //   },
//       //   legendCallback: function (chart) {
//       // var text = [];
//       // text.push('<ul class="' + chart.id + '-legend">');
//       // for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
//       //   text.push(
//       //     '<li><span style="background-color:' +
//       //       chart.data.datasets[0].backgroundColor[i] +
//       //       '">'
//       //   );
//       //   if (chart.data.labels[i]) {
//       //     text.push(chart.data.labels[i]);
//       //   }
//       //   text.push("</span></li>");
//       // }
//       //     // text.push("</ul>");
//       //     return text.join("");
//       //   },

//       //   legend: {
//       //     // onClick: handleClick,
//       //     labels: {
//       //         fillStyle:'pink',
//       //         color:'white',
//       //         boxHeight:20,
//       //         boxWidth:20,
//       //         borderRadius:50,
//       //       // This more specific font property overrides the global property
//       //       font: {
//       //         size: 20,

//       //       },
//       //       generateLabels(chart) {
//       //         console.log({chart})
//       //         const data = chart.data;
//       //         if (data.labels.length && data.datasets.length) {
//       //           const {labels: {pointStyle}} = chart.legend.options;

//       //           return data.labels.map((label, i) => {
//       //             const meta = chart.getDatasetMeta(0);
//       //             const style = meta.controller.getStyle(i);

//       //             return {
//       //               text:  `${label.toUpperCase()} - ${chart.data.datasets[0].data[i].toFixed(2)}%`,
//       //               fillStyle: style.backgroundColor,
//       //               strokeStyle: style.borderColor,
//       //               lineWidth: style.borderWidth,
//       //               pointStyle: pointStyle,
//       //               hidden: !chart.getDataVisibility(i),
//       //               backgroundColor:'purple',
//       //               index: i
//       //             };
//       //           });
//       //         }
//       //         return [];
//       //       }

//       //     },
//       //   },
//       tooltip: {
//         backgroundColor: "white",
//         callbacks: {
//           title: function (tooltipItem: { label: string }[]) {
//             return tooltipItem[0].label.toUpperCase();
//           },
//           label: function (tooltipItem) {
//             console.log(tooltipItem);
//             return tooltipItem.label.toUpperCase();
//           },
//           afterLabel: function (tooltipItem) {
//             return `${((tooltipItem.formattedValue * 100) / totalValue).toFixed(
//               2
//             )}%`;
//             // var dataset = data["datasets"][0];
//             // var percent = Math.round(
//             //   (dataset["data"][tooltipItem["index"]] /
//             //     dataset["_meta"][0]["total"]) *
//             //     100
//             // );
//             // return "(" + percent + "%)";
//           },
//         },
//       },
//     },
//   };
//   //   chargenerateLegend()
//   const chartRef = useRef<any>(null);
//   useEffect(() => {
//     // document.getElementById(
//     //   "legend"
//     // ).innerHTML = chartRef.current.chartInstance.generateLegend();
//     console.log(chartRef.current);
//   }, []);

//   return (
//     <Stack
//       flexDir={{ base: "column", lg: "row" }}
//       spacing="0"
//       gap="40px"
//       width="100%"
//     >
//       <Container
//         w={{ base: "100%", lg: "calc(50% - 20px)" }}
//         h="1000px"
//         variant="box-component"
//       >
//         <Box h="300px">
//           <Doughnut data={data} options={{ maintainAspectRatio: false }} />
//         </Box>
//       </Container>
//       <Container
//         w={{ base: "100%", lg: "calc(50% - 20px)" }}
//         h="1000px"
//         variant="box-component"
//       >
//         <Box h="300px">
//           <Doughnut data={data} options={options} ref={onRefChange} />
//           {legend}
//         </Box>
//       </Container>
//     </Stack>
//   );
// };
// export default DoughnutChart;

import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Container,
  HStack,
  Stack,
  useColorMode,
  VStack,
  Text,
  Button,
  textDecoration,
  Grid,
  Divider,
} from "@chakra-ui/react";
import { SetStateAction, useCallback, useState } from "react";
import { RiCopperCoinFill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import FormattedNumber from "./number-formatter";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("./charts/simple-chart"), {
  ssr: false,
});

const COLORS = [
  "rgba(255, 99, 132, 0.9)",
  "rgba(54, 162, 235, 0.9)",
  "rgba(255, 206, 86, 0.9)",
  "rgba(75, 192, 192, 0.9)",
  "rgba(113, 34, 109, 0.9)",
  "rgba(255, 109, 64, 0.9)",
  "rgba(28, 96, 102, 0.9)",
  "rgba(248, 51, 140, 0.9)",
  "rgba(51, 138, 248, 0.9)",
  "rgba(153, 102, 255, 0.9)",
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    topTen,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  const idx = topTen.findIndex(
    (el: { symbol: any }) => el.symbol === name.split("-")[0]
  );

  return (
    <g>
      <foreignObject
        x={cx - 50}
        y={cy - 50}
        dy={8}
        height="110px"
        width="100px"
      >
        <Link
          href={`${window.location.origin}/coins/${topTen[idx].id}`}
          passHref
          scroll
        >
          <VStack spacing="0" cursor="pointer">
            <Box
              mb="10px"
              bg="#fefeff17"
              borderRadius="50%"
              h={{ xxs: "40px", md: "50px" }}
              w={{ xxs: "40px", md: "50px" }}
              position="relative"
            >
              <Image src={topTen[idx].image} alt="coin logo" layout="fill" />
            </Box>
            <Text textTransform="capitalize" variant="h-5">
              {topTen[idx].symbol.toUpperCase()}
            </Text>
            <Text textTransform="capitalize" variant="h-5">
              {value.toFixed(2)}%
            </Text>
          </VStack>
        </Link>
      </foreignObject>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};
const CustomTooltip = ({ active, payload, label }: any) => {
  const { colorMode } = useColorMode();
  if (active && payload && payload.length) {
    return (
      <HStack
        bg={colorMode === "light" ? "#e7ecf0" : "#081c3b"}
        p="10px"
        borderRadius="8px"
      >
        <Text variant="toast">{`${payload[0].name.toUpperCase()}:`}</Text>
        <Text variant="toast">{`${payload[0].value.toFixed(2)}%`}</Text>
        {/* <p className="intro">{getIntroOfPage(label)}</p> */}
        {/* <p className="desc">Anything you want can be displayed here.</p> */}
      </HStack>
    );
  }

  return null;
};
const CustomLegend = (props: any) => {
  const { colorMode } = useColorMode();
  const handleMouseEnter = (val: string) => {
    const variable = document.querySelector(`[name=${val}]`);
    const currentColor = variable?.getAttribute("fill");
    if (currentColor) {
      variable?.setAttribute("fill", currentColor?.replace("0.9", "0.6"));
      variable?.setAttribute("stroke", currentColor);
    }
    const idDisplay = val.split("-")[0];
    const idx = arrVal.findIndex((el: string[]) => el[0] === idDisplay);

    setActiveIndexMarketCap(idx);
  };

  const handleMouseLeave = (val: string) => {
    const variable = document.querySelector(`[name=${val}]`);
    const currentColor = variable?.getAttribute("fill");
    if (currentColor) {
      variable?.setAttribute("fill", currentColor?.replace("0.6", "0.9"));
      variable?.setAttribute("stroke", "white");
    }
  };
  const {
    payload,
    id,
    onPieEnter,
    arrVal,
    setActiveIndexMarketCap,
    topTen,
    renderTokenData,
  } = props;

  const handleClick = (idDisplay: string) => {
    const idx = arrVal.findIndex((el: string[]) => el[0] === idDisplay);

    setActiveIndexMarketCap(idx);
  };

  return (
    <Box width="max-content" maxW="100%" key={id} zIndex="-1">
      {/* {renderTokenData()} */}
      <HStack
        gap={{ base: "4px", sm: "10px" }}
        spacing="0"
        flexWrap="wrap"
        justifyContent="center"
      >
        {payload.map((entry: { value: string }, index: string | number) => {
          const idDisplay = entry.value.split("-")[0];

          return (
            <HStack
              key={`${id}-${entry.value.toUpperCase()}`}
              bg={colorMode === "light" ? "#e7ecf0" : "#081c3b"}
              p={{ base: "8px 16px 8px 10px", md: "10px 20px 10px 14px" }}
              border={
                colorMode === "light"
                  ? "0.5px solid #e7ecf0"
                  : "0.5px solid #081c3b"
              }
              borderRadius="8px"
              w={{ base: "80px", sm: "90px" }}
              spacing="0"
              gap="6px"
              //   onClick={onPieEnter}
              // onMouseEnter={() => handleMouseEnter(entry.value)}
              // onMouseLeave={() => handleMouseLeave(entry.value)}
              onClick={() => handleClick(idDisplay)}
              cursor="pointer"
              _hover={{
                bg: colorMode === "light" ? "#e7ecf085" : "rgba(8, 28,59, .7)",
                border:
                  colorMode === "light"
                    ? ".5px solid gray"
                    : ".5px solid white",
              }}
            >
              <Box>
                <RiCopperCoinFill fill={COLORS[Number(index)]} size={16} />
              </Box>
              <Text variant="toast">{idDisplay.toUpperCase()}</Text>
            </HStack>
          );
        })}
      </HStack>
    </Box>
  );
};

const DoughnutChart = (props: any) => {
  const { global, topTen } = props;

  const marketCap = Object.entries(global.market_cap_percentage);
  const totalVolume = Object.entries(global.total_volume);
  const { colorMode } = useColorMode();

  const marketCapData: any[] = [];
  Object.keys(marketCap).forEach((key, idx) => {
    marketCapData.push({
      name: `${marketCap[idx][0]}-market`,
      value: marketCap[idx][1],
    });
  });
  const totalVolumeData: any[] = [];
  Object.keys(totalVolume).forEach((key, idx) => {
    totalVolumeData.push({
      name: `${totalVolume[idx][0]}-volume`,
      value: totalVolume[idx][1],
    });
  });

  const [activeIndexMarketCap, setActiveIndexMarketCap] = useState(0);
  const onPieEnter = useCallback((_: any, index: SetStateAction<number>) => {
    setActiveIndexMarketCap(index);
  }, []);

  //   const renderTokenData = useCallback(() => {
  //     return activeIndexMarketCap !== undefined ? (
  //       <Box bottom={{ base: "20px", md: "20px" }}>
  //         <HStack
  //           spacing={0}
  //           alignItems="center"
  //           gap="14px"
  //           pb="20px"
  //           justifyContent="center"
  //         >
  //           <Link
  //             href={`${window.location.origin}/coins/${topTen[activeIndexMarketCap].id}`}
  //             passHref
  //             scroll
  //           >
  //             <Text
  //               cursor="pointer"
  //               variant="h-5"
  //               textTransform="capitalize"
  //               _hover={{ textDecoration: "underline" }}
  //             >
  //               {topTen[activeIndexMarketCap]?.id} Stats:
  //             </Text>
  //           </Link>

  //           <HStack spacing="0" gap="3px">
  //             {topTen[activeIndexMarketCap].market_cap_change_percentage_24h <
  //             0 ? (
  //               <AiFillCaretDown fill="var(--red)" />
  //             ) : (
  //               <AiFillCaretUp fill="var(--green)" />
  //             )}

  //             <Text
  //               variant="text-bold"
  //               color={
  //                 topTen[activeIndexMarketCap].market_cap_change_percentage_24h <
  //                 0
  //                   ? "red"
  //                   : "green"
  //               }
  //             >
  //               {Math.abs(
  //                 topTen[
  //                   activeIndexMarketCap
  //                 ].market_cap_change_percentage_24h.toFixed(2)
  //               )}
  //               %
  //             </Text>
  //           </HStack>
  //           <Text
  //             variant="text-bold"
  //             color={
  //               topTen[activeIndexMarketCap].market_cap_change_percentage_24h < 0
  //                 ? "red"
  //                 : topTen[activeIndexMarketCap]
  //                     .market_cap_change_percentage_24h > 0
  //                 ? "green"
  //                 : "inherit"
  //             }
  //           >
  //             {`$${
  //               Math.abs(topTen[activeIndexMarketCap].price_change_24h) > 1
  //                 ? topTen[activeIndexMarketCap].price_change_24h.toFixed(2)
  //                 : topTen[activeIndexMarketCap].price_change_24h.toFixed(6)
  //             }`}
  //           </Text>
  //         </HStack>
  //       </Box>
  //     ) : null;
  //   }, [activeIndexMarketCap, topTen]);

  const renderStats = (
    name: string,
    value: number,
    prefix: string,
    last: boolean
  ) => {
    return (
      <>
        <HStack
          justifyContent="space-between"
          flexDir={{ base: "column", xxs: "row" }}
        >
          <Text variant="body-gray-bold">{name}</Text>

          <FormattedNumber value={value} prefix={prefix} className="h-4" />
        </HStack>
        {last ? "" : <Divider orientation="horizontal" />}
      </>
    );
  };

  return (
    <Stack
      flexDir={{ base: "column", lg: "row" }}
      spacing="0"
      gap="20px"
      width="100%"
      mb="40px"
    >
      <Container
        w={{ base: "100%", lg: "calc(50% - 10px)" }}
        h={{ base: "490px", md: "650px", lg: "640px" }}
        variant="box-component"
        position="relative"
        pt="20px"
      >
        <Text variant="h-3" pb="unset">
          Market Cap
        </Text>
        <ResponsiveContainer height="93%">
          <PieChart style={{ paddingBottom: "20px" }}>
            <Pie
              height="50%"
              data={marketCapData}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="90%"
              stroke="inherit"
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIndexMarketCap}
              activeShape={(props) => renderActiveShape({ ...props, topTen })}
              // onMouseEnter={onPieEnter}
              onClick={onPieEnter}
            >
              {marketCapData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* <Tooltip
              content={<CustomTooltip />}

             //  position={{ y: 56, x: -150 }} wrapperStyle={{visibility: 'visible'}}
            /> 
            {/* <Legend content={renderLegend}  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/> */}

            <Legend
              content={
                <CustomLegend
                  id="market-cap"
                  arrVal={marketCap}
                  setActiveIndexMarketCap={setActiveIndexMarketCap}
                  topTen={topTen}
                  //   renderTokenData={renderTokenData}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
        {/* </Box> */}
      </Container>
      <Container
        w={{ base: "100%", lg: "calc(50% - 10px)" }}
        height="max-content"
        variant="box-component"
        position="relative"
        // stroke={colorMode === "light" ? "#dddfe1" : "white"}
        pt="20px"
      >
        <HStack>
          <Image
            height="30px"
            width="30px"
            src={topTen[activeIndexMarketCap].image}
            alt="coin logo"
          />
          <Text variant="h-3" pb="none" textTransform="capitalize">
            {topTen[activeIndexMarketCap].id}
          </Text>
          {/* <Text variant="h-5">(7 Day Trend)</Text> */}
          <Link href={`/coins/${topTen[activeIndexMarketCap].id}`} passHref>
            <Button variant="medium">View More</Button>
          </Link>
        </HStack>

        {activeIndexMarketCap !== undefined && (
          <Chart
            data={topTen[activeIndexMarketCap].sparkline_in_7d.price}
            // data={topTen}s
          />
        )}
        <Stack pb="20px">
          {renderStats(
            "Market Cap",
            topTen[activeIndexMarketCap].market_cap,
            "$",
            false
          )}
          {renderStats(
            "Circulating Supply",
            topTen[activeIndexMarketCap].circulating_supply,
            "",
            false
          )}
          {renderStats(
            "Total Volume",
            topTen[activeIndexMarketCap].total_volume,
            "$",
            false
          )}
          {renderStats(
            "Current Price",
            topTen[activeIndexMarketCap].current_price,
            "$",
            false
          )}
          {renderStats(
            "24H High",
            topTen[activeIndexMarketCap].high_24h,
            "$",
            false
          )}
          {renderStats(
            "24H Low",
            topTen[activeIndexMarketCap].low_24h,
            "$",
            true
          )}
          {/* {renderStats( 'Market Cap',  topTen[activeIndexMarketCap].market_cap)}
         {renderStats( 'Market Cap Change %:',  topTen[activeIndexMarketCap].market_cap_change_percentage_24h)}
         {renderStats( 'Market Cap Change:',  topTen[activeIndexMarketCap].market_cap_change_24h)} */}
        </Stack>

        {/* <Text variant="h-4" pb="none" textTransform="capitalize">
          Last 24 Hours
        </Text>
        <Text variant="h-5" fontWeight="500" textTransform="capitalize">
          Current Price:
        </Text>
        <Text variant="h-5" textTransform="capitalize">
          {topTen[activeIndexMarketCap].current_price}
        </Text>
        <Text variant="h-5" fontWeight="500" textTransform="capitalize">
          Hight:
        </Text>
        <Text variant="h-5" textTransform="capitalize">
          {topTen[activeIndexMarketCap].high_24h}
        </Text>
        <Text variant="h-5" fontWeight="500" textTransform="capitalize">
          Low:
        </Text>
        <Text variant="h-5" textTransform="capitalize">
          {topTen[activeIndexMarketCap].low_24h}
        </Text>
        <Text variant="h-5" fontWeight="500" textTransform="capitalize">
          Low:
        </Text>
        <Text variant="h-5" textTransform="capitalize">
          {topTen[activeIndexMarketCap].low_24h}
        </Text>
        <Text variant="h-5" fontWeight="500" textTransform="capitalize">
          Market Cap Change %:
        </Text>
        <Text variant="h-5" textTransform="capitalize">
          {topTen[activeIndexMarketCap].market_cap_change_percentage_24h}
        </Text>
        <Text variant="h-5" fontWeight="500" textTransform="capitalize">
          Market Cap Change:
        </Text>
        <Text variant="h-5" textTransform="capitalize">
          {topTen[activeIndexMarketCap].market_cap_change_24h}
        </Text> */}
      </Container>
    </Stack>
  );
};

export default DoughnutChart;

// <Container
// w={{ base: "100%", lg: "calc(50% - 20px)" }}
// h="600px"
// variant="box-component"
// position="relative"
// stroke={colorMode === "light" ? "#dddfe1" : "white"}
// >
// <Text variant="h-5">Market Cap</Text>
// {/* <Box height='100%' w='100%'> */}
// <ResponsiveContainer>
//   <PieChart>
//     <Pie
//       data={totalVolumeData}
//       cx="50%"
//       cy="50%"
//       innerRadius="70%"
//       outerRadius="80%"
//       //   fill="#8884d8"
//       stroke="inherit"
//       paddingAngle={3}
//       dataKey="value"
//       activeIndex={activeIndexMarketCap}
//       activeShape={renderActiveShape}
//       onMouseEnter={onPieEnter}
//     >
//       {totalVolumeData.map((entry, index) => (
//         <Cell
//           key={`cell-${index}`}
//           fill={COLORS[index % COLORS.length]}
//         />
//       ))}
//     </Pie>

//     <Tooltip content={<CustomTooltip />} />
//     {/* <Legend content={renderLegend}  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/> */}
//     <Legend
//       content={
//         <CustomLegend id="total-volume" onPieEnter={onPieEnter} />
//       }
//     />
//   </PieChart>
// </ResponsiveContainer>
// {/* </Box> */}
// </Container>

{
  /* <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */
}
{
  /* <foreignObject
          // x={ex + (cos >= 0 ? 10: -0) }
          // y={ey}
          x={cos >= 0 ? ex - 110 : ex}
          y={ey + 10}
          height="200px"
          width="110px"
        >
          {/* <foreignObject x={cx + 10} y={ey} height="150px" width="300px"> 
        </foreignObject> 

       <Box>
        <VStack
          background="#3b547d"
          width="110px"
          height="max-content"
          padding="10px"
          borderRadius="6px"
          spacing={0}
          alignItems="flex-start"
        >
          <Text variant="text-bold" textTransform="capitalize">
            {topTen[idx].id}
          </Text>
          <Text variant="text-bold">
            <span style={{ fontWeight: "600", fontSize: "12px" }}>MV: </span>
            {value.toFixed(2)}%
          </Text>
          <Text variant="text-bold">
            <span style={{ fontWeight: "600", fontSize: "12px" }}> 24h%: </span>
            {topTen[idx].market_cap_change_percentage_24h.toFixed(2)}%
          </Text>
        </VStack>
      </Box> */
}
