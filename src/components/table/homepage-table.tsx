import {
  Tr,
  Td,
  Box,
  HStack,
  Text,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import FormattedNumber from "../number-formatter";
import DataTable from "./table";
import Favorite from "./nameColumn";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { database } from "../../../context/clientApp";
import BuySellModal from "../modals/buy-sell-modal";

const TableChartComponent = dynamic(() => import("../charts/table-chart"), {
  ssr: false,
});

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
        fontWeight="600"
        color={value > 0 ? "green" : value < 0 ? "red" : "white"}
        margin="0 !important"
      >
        {Math.abs(value).toFixed(2)}%
      </Text>
      ;
    </HStack>
  );
};

const HomepageTable = (props: any) => {
  const { numCoins } = props;
  const lastPageX = Math.ceil(Number(numCoins) / 100);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { colorMode } = useColorMode();
  const [liked, setLiked] = useState<any[] | []>([]);
  const { user } = useAuth();

  const BuySell = (props: any) => {
    const { coinId } = props;
    const { onOpen, onClose, isOpen } = useDisclosure();
    return (
      <>
        <Button variant="medium-hollow" onClick={onOpen} width="inherit">
          Buy/Sell
        </Button>
        <BuySellModal name={coinId} onClose={onClose} isOpen={isOpen} />
      </>
    );
  };

  useEffect(() => {
    const getLiked = async () => {
      if (user.name) {
        const arr: string[] = [];
        const docRef = collection(database, "users", user.name, "liked");
        const docSnap = await getDocs(docRef);
        if (docSnap.docs.length > 0) {
          docSnap.forEach((doc) => {
            arr.push(doc.id);
          });
          setLiked(arr);
        } else {
          setLiked([]);
        }
      } else {
        setLiked([]);
      }
    };
    getLiked();
  }, [user]);

  useEffect(() => {
    if (page && numCoins) {
      
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
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
  
  }, [numCoins, page]);

  const pagination = (page: number, lastPage: number) => {
    if (page + 1 <= lastPageX && page < 3) {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        arr.push(page + i);
      }

      return arr;
    } else if (page + 1 <= lastPageX && page >= 3) {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        arr.push(page - 1 + i);
      }

      return arr;
    } else {
      const arr = [];
      for (let i = 3; i > 0; i--) {
        arr.push(page - i);
      }

      return arr;
    }
  };

  const tableColumnNames = [
    "Name",
    "",
    "Price",
    "1h%",
    "24h%",
    "7d%",
    "24h Volume",
    "Market Cap",
    "Circulating Supply",
    "7 Day Trend",
  ];

  const renderData = useCallback(() => {
    return data.map((coin, idx) => {
      if (idx <= 25)
        return (
          <Tr key={coin.id} borderTop="unset" h="54px">
            <Td
              position="sticky"
              left="-1"
              zIndex="2"
              bg={
                colorMode === "light"
                  ? "linear-gradient(to left , rgba(245,255,255, 0) 3%, rgba(255,255,255, 1) 14%)"
                  : "linear-gradient(to left , rgba(8,28,59, 0) 3%, rgb(3 12 25) 14%);"
              }
              padding="5px 30px 5px 10px"
            >
              <Favorite coin={coin} liked={liked} setLiked={setLiked} />
            </Td>
            <Td>
              <BuySell coinId={coin.id} />
            </Td>
            <Td padding="5px 10px">
              <FormattedNumber
                value={coin.current_price}
                prefix="$"
                className="table-cell"
              />
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
              <FormattedNumber
                value={coin.total_volume}
                prefix="$"
                className="table-cell"
              />
            </Td>
            <Td padding="5px 10px">
              <FormattedNumber
                value={coin.market_cap}
                prefix="$"
                className="table-cell"
              />
            </Td>
            <Td padding="5px 10px">
              <FormattedNumber
                value={coin?.circulating_supply?.toFixed() || null}
                prefix=""
                className="table-cell"
              />
            </Td>
            <Td padding="5px 10px" width="110px">
              <HStack spacing="0" gap="20px" width="100%">
                <TableChartComponent
                  id={coin.id}
                  change={coin.price_change_percentage_7d_in_currency}
                  data={coin.sparkline_in_7d?.price}
                />

                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <Box>
                      <BiDotsVerticalRounded size={20} />
                    </Box>
                  </PopoverTrigger>
                  <div className="chakra-portal chart-popover">
                    <PopoverContent
                      width="max-content"
                      // _focusVisible={{ boxShadow: "unset" }}
                    >
                      <PopoverArrow />
                      <PopoverBody p=" 10px 20px">
                        <Link passHref href={`/coins/${coin.id}`}>
                          <Text cursor="pointer">View Charts</Text>
                        </Link>
                        <Link passHref href={`/historic-data/${coin.id}`}>
                          <Text cursor="pointer">Historic Data</Text>
                        </Link>
                      </PopoverBody>
                    </PopoverContent>
                  </div>
                </Popover>
              </HStack>
            </Td>
          </Tr>
        );
      return null;
    });
  }, [colorMode, data, liked]);
  if (data.length > 0) {
    return (
      <>
        <Text pt="20px" variant="h-3">
        Prices by Market Cap
        </Text>
        <DataTable tableColumns={tableColumnNames} renderData={renderData} />
        <HStack>
          {page > 1 ? (
            <Box
              onClick={() => setPage(1)}
              backgroundColor={
                colorMode === "light"
                  ? 1 === page
                    ? "#1099fa"
                    : "#f5f6fa"
                  : 1 === page
                  ? "#133364"
                  : "transparent"
              }
              border={
                colorMode === "light"
                  ? 1 === page
                    ? "#1099fa"
                    : "1px solid #dddfe1"
                  : 1 === page
                  ? "#4783c5"
                  : "1px solid #133364"
              }
              p="5px 10px"
              borderRadius="4px"
            >
              1
            </Box>
          ) : null}
          {page > 2 && <Box>...</Box>}
          {pagination(page, numCoins).map((el, idx) => {
            // if (idx === 1) {
            return (
              <Box
                key={el}
                onClick={() => setPage(el)}
                backgroundColor={
                  colorMode === "light"
                    ? el === page
                      ? "#1099fa"
                      : "#f5f6fa"
                    : el === page
                    ? "#133364"
                    : "transparent"
                }
                border={
                  colorMode === "light"
                    ? el === page
                      ? "#1099fa"
                      : "1px solid #dddfe1"
                    : el === page
                    ? "#4783c5"
                    : "1px solid #133364"
                }
                p="5px 10px"
                borderRadius="4px"
              >
                {el}
              </Box>
            );
          })}
          {page < lastPageX - 1 && <Box>...</Box>}
          {(page + 1 < lastPageX || page === lastPageX) && (
            <Box
              onClick={() => setPage(lastPageX)}
              backgroundColor={
                colorMode === "light"
                  ? lastPageX === page
                    ? "#1099fa"
                    : "#f5f6fa"
                  : lastPageX === page
                  ? "#133364"
                  : "transparent"
              }
              border={
                colorMode === "light"
                  ? lastPageX === page
                    ? "#1099fa"
                    : "1px solid #dddfe1"
                  : lastPageX === page
                  ? "#4783c5"
                  : "1px solid #133364"
              }
              p="5px 10px"
              borderRadius="4px"
            >
              {lastPageX}
            </Box>
          )}
        </HStack>
      </>
    );
  }
  return null;
};

export default HomepageTable;
