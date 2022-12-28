import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  HStack,
  Stack,
  useColorMode,
  VStack,
  Text,
  Button,
  Divider,
  Container,
} from "@chakra-ui/react";
import { SetStateAction, useCallback, useState } from "react";
import { RiCopperCoinFill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import FormattedNumber from "./number-formatter";
import dynamic from "next/dynamic";
import numberFormater from "../../helper-functions/number-formatter";
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
    value,
    topTen,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
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

const CustomLegend = (props: any) => {
  const { colorMode } = useColorMode();

  const { payload, id, arrVal, setActiveIndexMarketCap } = props;
 

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


  const marketCap = Object?.entries(global?.market_cap_percentage);
  const totalVolume = Object?.entries(global?.total_volume);
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
    <>
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
            Top 10 Coins
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
                onClick={onPieEnter}
              >
                {marketCapData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

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
            <Link href={`/coins/${topTen[activeIndexMarketCap].id}`} passHref>
              <Button variant="medium">View More</Button>
            </Link>
          </HStack>

          {activeIndexMarketCap !== undefined && (
            <Chart data={topTen[activeIndexMarketCap].sparkline_in_7d.price} />
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
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export default DoughnutChart;
