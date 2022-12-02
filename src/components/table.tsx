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
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Button,
  PopoverFooter,
} from "@chakra-ui/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { NumericFormat } from "react-number-format";
import { SlStar } from "react-icons/sl";
import { FaStar } from "react-icons/fa";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { TiStarFullOutline } from "react-icons/ti";
import { BsFillBookmarkFill } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../context/clientApp";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  Firestore,
  deleteDoc,
} from "firebase/firestore";

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
  const lastPage = 530;
  const { colorMode } = useColorMode();
  const [favoredItems, setFavored] = useState<any[]>([]);
  const { user } = useAuth();

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
  }, [lastPage, page]);

  const pagination = (page: number, lastPage: number) => {
    if (page + 3 < lastPage) {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        arr.push(page + i);
      }

      return arr;
    } else {
      const arr = [];
      for (let i = 2; i >= 0; i--) {
        arr.push(page - i);
      }

      return arr;
    }
  };
  const favored = (id: string) => {
    const item = [...favoredItems];
    const index = item.indexOf(id);
    if (index !== -1) {
      const newArr = item.filter((el) => el !== id);
      setFavored([...newArr]);
    } else setFavored([...item, id]);
  };

  const [liked, setLiked] = useState<string[] | []>([]);
  useEffect(() => {
    const liked = async () => {
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
          console.log("No such document!");
        }
      } else {
        console.log("not happening");
      }
    };
    liked();
  }, [user]);
  const deleteFromDatabase = async (id: string) => {
    if (user.name) {
      await deleteDoc(doc(database, "users", user.name, "liked", id));
      const state = [...liked];
      const newState = state.filter((el) => el !== id);
      setLiked(newState);
    }
  };
  const addToDatabase = async (name: any, sym: any) => {
    if (user.name) {
      const data = {
        name,
        sym,
      };
      await setDoc(doc(database, "users", user.name, "liked", name), data);
      const newState = [...liked, name];
      setLiked(newState);
    }
  };
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
                <Th fontSize="12px">1h</Th>
                <Th fontSize="12px">24h</Th>
                <Th fontSize="12px">7d</Th>
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
                if (idx <= 25)
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
                        // maxW={{ base: "150px", sm: "unset" }}
                      >
                        <HStack flexWrap="wrap">
                          <FaStar
                            onClick={() =>
                              liked.indexOf(coin.id) !== -1
                                ? deleteFromDatabase(coin.id)
                                : addToDatabase(coin.id, coin.symbol)
                            }
                            fill={
                              liked.indexOf(coin.id) !== -1 ? "yellow" : "white"
                            }
                            strokeWidth="1px"
                            stroke={
                              favoredItems.indexOf(coin.id) !== -1
                                ? "yellow"
                                : "white"
                            }
                          />
                          <Box
                            h="25px"
                            w="25px"
                            backgroundImage={coin.image}
                            backgroundSize="contain"
                          />

                          <Link href={`/coins/${coin.id}`}>
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
                      <Td padding="5px 10px">
                        <PercentChange
                          value={coin.price_change_percentage_1h_in_currency}
                        />
                      </Td>
                      <Td padding="5px 10px">
                        <PercentChange
                          value={coin.price_change_percentage_24h}
                        />
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
                          value={coin?.circulating_supply?.toFixed() || null}
                          prefix=""
                          // sufffix={` ${coin.symbol.toUpperCase()}`}
                        />
                      </Td>
                      <Td padding="5px 10px">
                        <HStack spacing="0" gap="20px">
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
                                  <Text>View Charts</Text>
                                  <Link
                                    passHref
                                    href={`/historic-data/${coin.id}`}
                                  >
                                    <Text>Historic Data</Text>
                                  </Link>
                                </PopoverBody>
                              </PopoverContent>
                            </div>
                          </Popover>
                        </HStack>
                      </Td>
                    </Tr>
                  );
                return undefined;
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <HStack>
          {page > 1 ? (
            <Box
              onClick={() => setPage(1)}
              backgroundColor={1 === page ? "#4783c5" : "#123363"}
              p="5px 10px"
              borderRadius="4px"
            >
              1
            </Box>
          ) : null}
          {pagination(page, lastPage).map((el) => (
            <Box
              key={el}
              onClick={() => setPage(el)}
              backgroundColor={el === page ? "#4783c5" : "#123363"}
              p="5px 10px"
              borderRadius="4px"
            >
              {el}
            </Box>
          ))}
          <Box
            onClick={() => setPage(530)}
            backgroundColor={530 === page ? "#4783c5" : "#123363"}
            p="5px 10px"
            borderRadius="4px"
          >
            530
          </Box>
        </HStack>
      </>
    );
  }
  return null;
};

export default DataTable;
