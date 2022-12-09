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
} from "@chakra-ui/react";
import { useCallback } from "react";
import { RiCopperCoinFill } from "react-icons/ri";

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
const CustomTooltip = ({ active, payload, label }: any) => {
  const { colorMode } = useColorMode();
  if (active && payload && payload.length) {
    console.log({ active }, { label }, { payload });
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
  };

  const handleMouseLeave = (val: string) => {
    const variable = document.querySelector(`[name=${val}]`);
    const currentColor = variable?.getAttribute("fill");
    if (currentColor) {
      variable?.setAttribute("fill", currentColor?.replace("0.6", "0.9"));
      variable?.setAttribute("stroke", "white");
    }
  };
  const { payload } = props;

  return (
    <Box width="max-content" maxW="100%">
      <HStack gap="10px" spacing="0" flexWrap="wrap" justifyContent="center">
        {payload.map((entry: { value: string }, index: string | number) => {
          return (
            <HStack
              key={entry.value.toUpperCase()}
              bg={colorMode === "light" ? "#e7ecf0" : "#081c3b"}
              p="10px 20px 10px 14px"
              border={
                colorMode === "light"
                  ? "0.5px solid #e7ecf0"
                  : "0.5px solid #081c3b"
              }
              borderRadius="8px"
              w="90px"
              spacing="0"
              gap="6px"
              onMouseEnter={() => handleMouseEnter(entry.value)}
              onMouseLeave={() => handleMouseLeave(entry.value)}
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
              <Text variant="toast">{entry.value.toUpperCase()}</Text>
            </HStack>
          );
        })}
      </HStack>
    </Box>
  );
};

const DoughnutChart = (props: any) => {
  const { global } = props;
  const marketCap = Object.entries(global.market_cap_percentage);
  const { colorMode } = useColorMode();
  console.log(Object.keys(global.market_cap_percentage));

  console.log(marketCap);
  const data: any[] = [];
  Object.keys(marketCap).forEach((key, idx) => {
    console.log(key);
    data.push({ name: marketCap[idx][0], value: marketCap[idx][1] });
  });

  console.log({ data });
  const renderLegend = useCallback((props: { payload: any }) => {
    const { payload } = props;
    return (
      <Box width="max-content" maxW="100%">
        <HStack gap="10px" spacing="0" flexWrap="wrap" justifyContent="center">
          {payload.map((entry: { value: string }, index: number) => {
            return (
              <HStack
                key={entry.value.toUpperCase()}
                bg={colorMode === "light" ? "#e7ecf0" : "#081c3b"}
                p="10px 20px 10px 14px"
                borderRadius="8px"
                w="90px"
                spacing="0"
                gap="6px"
              >
                <Box>
                  <RiCopperCoinFill fill={COLORS[index]} size={16} />
                </Box>
                <Text variant="toast">{entry.value.toUpperCase()}</Text>
              </HStack>
            );
          })}
        </HStack>
      </Box>
    );
  }, []);

  return (
    <Stack
      flexDir={{ base: "column", lg: "row" }}
      spacing="0"
      gap="40px"
      width="100%"
    >
      <Container
        w={{ base: "100%", lg: "calc(50% - 20px)" }}
        h="600px"
        variant="box-component"
        position="relative"
        stroke={colorMode === "light" ? "#dddfe1" : "white"}
      >
        <Text variant="h-5">Market Cap</Text>
        {/* <Box height='100%' w='100%'> */}
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              //   fill="#8884d8"
              stroke="inherit"
              paddingAngle={3}
              dataKey="value"
            >
              {marketCap.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            {/* <Legend content={renderLegend}  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/> */}
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        {/* </Box> */}
      </Container>
      <Container
        w={{ base: "100%", lg: "calc(50% - 20px)" }}
        h="600px"
        variant="box-component"
        position="relative"
        stroke={colorMode === "light" ? "#dddfe1" : "white"}
      >
        <Text variant="h-5">Market Cap</Text>
        {/* <Box height='100%' w='100%'> */}
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              //   fill="#8884d8"
              stroke="inherit"
              paddingAngle={3}
              dataKey="value"
            >
              {marketCap.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            {/* <Legend content={renderLegend}  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/> */}
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        {/* </Box> */}
      </Container>
    </Stack>
  );
};

export default DoughnutChart;
