import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  HStack,
  Text,
  useColorMode,
  Stack,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { NumericFormat } from "react-number-format";
import Link from "next/link";

const FormattedNumber = (props: any) => {
  const { value, prefix, sufffix } = props;
  return (
    <Box>
      <NumericFormat
        value={value}
        prefix={prefix}
        suffix={sufffix}
        displayType="text"
        thousandSeparator=","
        style={{
          fontSize: "14px",
          fontWeight: "500",
        }}
      />
    </Box>
  );
};
const PercentChange = (props: any) => {
  const { value } = props;
  return (
    <HStack gap="3px">
      {value > 0 ? (
        <AiFillCaretUp size={14} fill="var(--green)" />
      ) : value < 0 ? (
        <AiFillCaretDown size={14} fill="var(--red)" />
      ) : undefined}
      <Text
        fontSize="14px"
        fontWeight="500"
        color={value > 0 ? "green" : value < 0 ? "red" : "white"}
        margin="0 !important"
      >
        {Math.abs(value).toFixed(2)}%
      </Text>
      ;
    </HStack>
  );
};

const DataTableNoChart = () => {
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

  if (data.length > 0) {
    return (
      <TableContainer>
        <Table>
          <TableCaption fontSize="10px" textAlign="right">
            Powered by CoinGecko API
          </TableCaption>
          <Thead>
            <Tr bg={colorMode === "light" ? "#ececec" : "#133364"}>
              <Th
                position="sticky"
                left="-1"
                zIndex="2"
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
              if (idx < 25)
                return (
                  <Tr key={coin.id}>
                    <Link href={`/crypto/${coin.id}`}>
                      <Td
                        position="sticky"
                        left="-1"
                        zIndex="2"
                        bg={
                          colorMode === "light"
                            ? "linear-gradient(to left , rgba(245,246,249, 0) 3%, rgba(245,246,249, 1) 14%)"
                            : "linear-gradient(to left , rgba(8,28,59, 0) 3%, rgba(8,28,59, 1) 14%)"
                        }
                        padding="5px 30px 5px 10px"
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
                              sm: "baseline",
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
                    </Link>
                    <Td padding="5px 10px">
                      <FormattedNumber value={coin.current_price} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <PercentChange
                        value={coin.price_change_percentage_1h_in_currency}
                      />
                    </Td>
                    <Td padding="5px 10px">
                      <PercentChange value={coin.price_change_percentage_24h} />
                    </Td>
                    <Td padding="5px 10px">
                      <PercentChange
                        value={coin.price_change_percentage_7d_in_currency}
                      />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={coin.total_volume} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber value={coin.market_cap} prefix="$" />
                    </Td>
                    <Td padding="5px 10px">
                      <FormattedNumber
                        value={coin.circulating_supply.toFixed()}
                        prefix=""
                        sufffix={` ${coin.symbol.toUpperCase()}`}
                      />
                    </Td>
                    <Td padding="5px 10px"></Td>
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

export default DataTableNoChart;
