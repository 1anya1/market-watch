import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  HStack,
  Text,
  useColorMode,
  VStack,
  Stack,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TableChartComponent = dynamic(() => import("../components/table-chart"), {
  ssr: false,
});

const DataTable = () => {
  const [data, setData] = useState<any[]>([]);
  const { colorMode } = useColorMode();
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong");
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {});

  if (data.length > 0) {
    return (
      <TableContainer>
        <Table>
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr bg={colorMode === "light" ? "#ececec" : "#133364"}>
              <Th
                position="sticky"
                left="0"
                zIndex="1"
                bg={colorMode === "light" ? "#ececec" : "#133364"}
              >
                Name
              </Th>
              <Th>Price</Th>
              <Th>1h</Th>
              <Th>24h</Th>
              <Th>7d</Th>
              <Th>24h Volume</Th>
              <Th>Mkt Cap</Th>
              <Th>Circulating Supply</Th>
              <Th>Last 7 Days</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((coin, idx) => {
              if (idx < 6)
                return (
                  <Tr key={coin.id}>
                    <Td
                      position="sticky"
                      left="0"
                      zIndex="1"
                      bg={colorMode === "light" ? "#f5f6f9" : "#081c3b"}
                      padding="5px 10px"
                    >
                      <HStack>
                        <Box
                          h="25px"
                          w="25px"
                          backgroundImage={coin.image}
                          backgroundSize="contain"
                        />
                        <Stack
                          alignItems={{
                            base: "flex-start",
                            sm: "center",
                          }}
                          flexDir={{ base: "column", sm: "row" }}
                          columnGap="8px"
                        >
                          <Text
                            fontSize="14px"
                            fontWeight="bold"
                            margin="0 !important"
                          >
                            {coin.name}
                          </Text>
                          <Text
                            fontSize="10px"
                            fontWeight="medium"
                            margin="0 !important"
                          >
                            {coin.symbol.toUpperCase()}
                          </Text>
                        </Stack>
                      </HStack>
                    </Td>
                    <Td padding="5px 10px">
                      <Text>{coin.current_price}</Text>
                    </Td>
                    <Td padding="5px 10px">
                      <Text>
                        {coin.price_change_percentage_1h_in_currency.toFixed(2)}
                        %
                      </Text>
                    </Td>
                    <Td padding="5px 10px">
                      <Text>
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </Text>
                    </Td>
                    <Td padding="5px 10px">
                      <Text>
                        {coin.price_change_percentage_7d_in_currency.toFixed(2)}
                        %
                      </Text>
                    </Td>
                    <Td padding="5px 10px">
                      <Text>{coin.total_volume}</Text>
                    </Td>
                    <Td padding="5px 10px">
                      <Text>{coin.market_cap}</Text>
                    </Td>
                    <Td padding="5px 10px">
                      <Text>{coin.circulating_supply}</Text>
                    </Td>
                    <Td padding="5px 10px">
                      <TableChartComponent
                        id={coin.id}
                        change={coin.price_change_percentage_7d_in_currency}
                      />
                    </Td>
                  </Tr>
                );
              return undefined;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
  return null;
};

export default DataTable;
