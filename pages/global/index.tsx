import {
  Text,
  Container,
  Menu,
  MenuButton,
  HStack,
  MenuList,
  MenuItem,
  Box,
  useColorMode,
  Grid,
} from "@chakra-ui/react";

import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import numberFormater from "../../helper-functions/number-formatter";
import { getData } from "../../lib/market-assets";
import DoughnutChart from "../../src/components/doughnut-chart";
import FormattedNumber from "../../src/components/number-formatter";
const Chart = dynamic(() => import("../../src/components/charts/mini-chart"), {
  ssr: false,
});

const GlobalData = (props: any) => {
  const { topTen, globalMetrics } = props;
  const { colorMode } = useColorMode();
  const [marketCapChartData, setMarketCapChartData] = useState<any>(null);
  const [timeSelect, setDays] = useState(1);
  const timeFrameOptions = [
    { query: 1, name: "24 Hrs" },
    { query: 7, name: "7 Days" },
    { query: 14, name: "14 Days" },
    { query: 30, name: "30 Days" },
    { query: 60, name: "60 Days" },
    { query: 90, name: "90 Days" },
    { query: 0, val: "max", name: "Max" },
  ];

  const renderTimeSelection = useCallback(() => {
    const currentVal = () => {
      const val = timeFrameOptions.filter((el) => el.query === timeSelect);
      return val[0].name;
    };

    return (
      <Menu>
        <MenuButton>
          <HStack>
            <Text>{currentVal()}</Text>

            <AiOutlineDown size={12} style={{ strokeWidth: "20" }} />
          </HStack>
        </MenuButton>
        <MenuList zIndex="14">
          {timeFrameOptions.map((el) => (
            <MenuItem
              key={el.query}
              onClick={() => setDays(el.query)}
              bg={
                el.query === timeSelect ? "rgba(255, 255, 255, 0.06)" : "unset"
              }
              _focus={{ bg: "unset" }}
            >
              {el.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }, [timeSelect]);

  return (
    <>
      <Text variant="h-2" pb="10px">
        Global Market
      </Text>
      <Text pb="20px">
        The total market cap represents data from{" "}
        {globalMetrics?.data?.active_cryptocurrencies} cryptocurrencies tracked
        across {globalMetrics?.data?.markets} market exchanges.
      </Text>

      {topTen && globalMetrics && (
        <Grid
          w={{ base: "100%", lg: "900px" }}
          gap="10px"
          gridTemplateColumns={{
            base: "1fr",
            fold: "1fr 1fr",
            med: "1fr 1fr 1fr",
            lg: "repeat(6, 1fr)",
          }}
          borderRadius="10px"
          mb="20px"
          justifyItems="center"
        >
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Market Cap Change 24 HRS
            </Text>
            <Text variant="h-5" textAlign="center">
              {globalMetrics?.data?.market_cap_change_percentage_24h_usd.toFixed(
                2
              )}
              %{" "}
            </Text>
          </Box>
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Active Coins
            </Text>
            <Text variant="h-5" textAlign="center">
              {globalMetrics?.data?.active_cryptocurrencies}{" "}
            </Text>
          </Box>
          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Total Markets
            </Text>
            <Text variant="h-5" textAlign="center">
              {globalMetrics?.data?.markets}{" "}
            </Text>
          </Box>

          <Box
            minW="120px"
            border={
              colorMode === "light"
                ? " 1px solid #dddfe1"
                : " 1px solid #051329"
            }
            bg={colorMode === "light" ? "#f5f6fa" : "#051329"}
            p="10px"
            borderRadius="10px"
            w="100%"
          >
            <Text variant="xxs-text" margin="auto" textAlign="center">
              Dominance
            </Text>
            <Text variant="h-5" textAlign="center">
              BTC: {globalMetrics?.data?.market_cap_percentage?.btc.toFixed(0)}%
            </Text>
          </Box>
        </Grid>
      )}

      {marketCapChartData?.volume && (
        <Container
          w="100%"
          variant="box-component"
          position="relative"
          mb="20px"
          pb="40px"
        >
          <Chart
            volume={marketCapChartData?.volume}
            data={marketCapChartData?.data}
            renderTimeSelection={renderTimeSelection}
          />
        </Container>
      )}

      {globalMetrics && topTen && (
        <DoughnutChart global={globalMetrics.data} topTen={topTen} />
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const globalMetrics = await getData(
    "Global-Metrics",
    "https://api.coingecko.com/api/v3/globalMetrics"
  );

  const topTen = await getData(
    "Global-Markets",
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h%2C7d%2C30d"
  );

  return {
    props: {
      globalMetrics,
      topTen,
    },
  };
};

export default GlobalData;
