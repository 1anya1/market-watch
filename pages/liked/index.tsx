import {
  Table,
  TableCaption,
  TableContainer,
  Text,
  Thead,
  Tr,
  Th,
  Tbody,
  useColorMode,
  Td,
  HStack,
  Box,
  Stack,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
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
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { NumericFormat } from "react-number-format";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import dynamic from "next/dynamic";

const TableChartComponent = dynamic(
  () => import("../../src/components/table-chart"),
  {
    ssr: false,
  }
);
const LikedItems = () => {
  const { user } = useAuth();
  const [liked, setLiked] = useState<any[] | []>([]);
  const { colorMode } = useColorMode();
  const [data, setData] = useState<any[]>([]);
  const tableColumns = [
    "Name",
    "Price",
    "1h%",
    "24h%",
    "7D%",
    "Market Cap",
    "Volume",
    "Circulating Supply",
    "Last 7 Days",
  ];
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
        }
      }
    };
    liked();
  }, [user]);
  useEffect(() => {
    if (liked.length > 0) {
      const query = liked.join(",").replaceAll(",", "%2C");
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${query}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=price_change_percentage=1h%2C24h%2C7d`
      )
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, [liked]);

  const FormattedNumber = (props: any) => {
    const { value, prefix, sufffix } = props;
    let num =
      Number(value) > 0 ? Number(value).toFixed(2) : Number(value).toFixed(6);

    return (
      <Box>
        <NumericFormat
          value={num}
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

  const renderTableRow = useCallback(() => {
    return data.map((coin, idx) => (
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
            // onClick={() =>
            //   liked.indexOf(coin.id) !== -1
            //     ? deleteFromDatabase(coin.id)
            //     : addToDatabase(coin.id, coin.symbol)
            // }
            // fill={liked.indexOf(coin.id) !== -1 ? "yellow" : "white"}
            // strokeWidth="1px"
            // stroke={favoredItems.indexOf(coin.id) !== -1 ? "yellow" : "white"}
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
                <Text fontSize="14px" fontWeight="bold" margin="0 !important">
                  {coin.name}
                </Text>
                <Text fontSize="10px" fontWeight="medium" margin="0 !important">
                  {coin.symbol.toUpperCase()}
                </Text>
              </Stack>
            </Link>
          </HStack>
        </Td>
        <Td padding="5px 10px">
          <FormattedNumber value={coin.current_price} prefix="$" />
        </Td>
        <Td padding="5px 10px">
          <PercentChange value={coin.price_change_24h} />
        </Td>
        <Td padding="5px 10px">
          <PercentChange value={coin.price_change_percentage_24h} />
        </Td>
        <Td padding="5px 10px">
          <PercentChange value={coin.price_change_percentage_7d_in_currency} />
        </Td>

        <Td padding="5px 10px">
          <FormattedNumber value={coin.market_cap} prefix="$" />
        </Td>
        <Td padding="5px 10px">
          <FormattedNumber value={coin.total_volume} prefix="$" />
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
                    <Link passHref href={`/historic-data/${coin.id}`}>
                      <Text>Historic Data</Text>
                    </Link>
                  </PopoverBody>
                </PopoverContent>
              </div>
            </Popover>
          </HStack>
        </Td>
      </Tr>
    ));
  }, [colorMode, data]);
  return (
    <>
      <Text variant="h-3">Watchlist</Text>
      <TableContainer mt="40px">
        <Table>
          <TableCaption fontSize="10px" textAlign="right">
            Powered by CoinGecko API
          </TableCaption>
          <Thead>
            <Tr
              bg={colorMode === "light" ? "#f5f6fa" : "#133364"}
              fontSize="10px"
            >
              {tableColumns.map((el, idx) => (
                <Th
                  //   textTransform="capitalize"
                  key={el}
                  fontSize="12px"
                  position={idx === 0 ? "sticky" : "unset"}
                  left={idx === 0 ? "-1" : "unset"}
                  zIndex={idx === 0 ? "2" : "unset"}
                  borderRadius={idx === 0 ? "8px 0 0 0" : "unset"}
                  bgColor={colorMode === "light" ? "#f5f6fa" : "#103363"}
                  bg={
                    idx === 0
                      ? colorMode === "light"
                        ? "linear-gradient(to left , rgba(245,246,250, 0) 3%, rgba(245,246,250, 1) 14%)"
                        : "linear-gradient(to left , rgba(17,51,99, 0) 3%, rgba(17,51,99, 1) 14%)"
                      : "unset"
                  }
                >
                  {el}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>{data.length > 0 ? renderTableRow() : "undefiend"}</Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LikedItems;