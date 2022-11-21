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
  Link,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { NumericFormat } from "react-number-format";

const TableChartComponent = dynamic(() => import("../components/table-chart"), {
  ssr: false,
});
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

const DataTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const lastPage = 265;
  const { colorMode } = useColorMode();

  // useEffect(() => {
  //   fetch("https://api.coingecko.com/api/v3/coins/list")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setLastPage(Math.ceil(data.length / 50));
  //       setCoinTotal(data.length);
  //     });
  // }, []);
  useEffect(() => {
    if (page && lastPage) {
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
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
    }
  }, [lastPage, page]);

  if (data.length > 0) {
    return (
      <>
        <Text pt="40px" fontSize="32px" fontWeight="700">
          By Market Cap
        </Text>
        <TableContainer pt="20px">
          <Table>
            <TableCaption fontSize="10px" textAlign="right">
              Powered by CoinGecko API
            </TableCaption>
            <Thead>
              <Tr
                bg={colorMode === "light" ? "#f5f6fa" : "#133364"}
                fontSize="10px"
              >
                <Th
                  position="sticky"
                  left="-1"
                  zIndex="2"
                  fontSize="12px"
                  borderRadius="8px 0 0 0"
                  bg={
                    colorMode === "light"
                      ? "linear-gradient(to left , rgba(245,246,250, 0) 3%, rgba(245,246,250, 1) 14%)"
                      : "linear-gradient(to left , rgba(17,51,99, 0) 3%, rgba(17,51,99, 1) 14%)"
                  }
                >
                  Name
                </Th>
                <Th fontSize="12px">Price</Th>
                {/* <Th fontSize="12px">1h</Th> */}
                <Th fontSize="12px">24h</Th>
                {/* <Th fontSize="12px">7d</Th> */}
                <Th fontSize="12px">24h Volume</Th>
                <Th fontSize="12px">Mkt Cap</Th>
                <Th fontSize="12px">Circulating Supply</Th>
                <Th fontSize="12px " borderRadius="0 8px 0 0">
                  Last 7 Days
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((coin, idx) => {
                if (idx <= 50)
                  return (
                    <Tr key={coin.id} borderTop="unset">
                      <Td
                        position="sticky"
                        left="-1"
                        zIndex="2"
                        bg={
                          colorMode === "light"
                            ? "linear-gradient(to left , rgba(245,255,255, 0) 3%, rgba(255,255,255, 1) 14%)"
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
                          <Link href={`/crypto/${coin.id}`}>
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
                          </Link>
                        </HStack>
                      </Td>
                      <Td padding="5px 10px">
                        <FormattedNumber
                          value={coin.current_price}
                          prefix="$"
                        />
                      </Td>
                      {/* <Td padding="5px 10px">
                        <PercentChange
                          value={coin.price_change_percentage_1h_in_currency}
                        />
                      </Td> */}
                      <Td padding="5px 10px">
                        <PercentChange
                          value={coin.price_change_percentage_24h}
                        />
                      </Td>
                      {/* <Td padding="5px 10px">
                        <PercentChange
                          value={coin.price_change_percentage_7d_in_currency}
                        />
                      </Td> */}
                      <Td padding="5px 10px">
                        <FormattedNumber value={coin.total_volume} prefix="$" />
                      </Td>
                      <Td padding="5px 10px">
                        <FormattedNumber value={coin.market_cap} prefix="$" />
                      </Td>
                      <Td padding="5px 10px">
                        <FormattedNumber
                          value={coin?.circulating_supply?.toFixed() || null}
                          prefix=""
                          // sufffix={` ${coin.symbol.toUpperCase()}`}
                        />
                      </Td>
                      <Td padding="5px 10px">
                        <TableChartComponent
                          id={coin.id}
                          change={coin.price_change_percentage_7d_in_currency}
                          data={coin.sparkline_in_7d?.price}
                        />
                      </Td>
                    </Tr>
                  );
                return undefined;
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <HStack>
          <Box onClick={() => setPage(1)}>1</Box>
          {[...Array(page + 3)].map((_, i) =>
            (i === page  || i > page) && i !== 0 && i !== 264 ? (
              <Box key={i} onClick={() => setPage(i + 1)}>
                {i + 1}
              </Box>
            ) : null
          )}
          <Box onClick={() => setPage(265)}>265</Box>
        </HStack>
      </>
    );
  }
  return null;
};

export default DataTable;
