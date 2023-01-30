import {
  Text,
  Tr,
  useColorMode,
  Td,
  HStack,
  Box,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  Popover,
  PopoverContent,
  Button,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../context/clientApp";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { BiDotsVerticalRounded } from "react-icons/bi";
import FormattedNumber from "../../src/components/number-formatter";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import dynamic from "next/dynamic";
import DataTable from "../../src/components/table/table";
import Favorite from "../../src/components/table/nameColumn";
import BuySellModal from "../../src/components/modals/buy-sell-modal";

import Image from "next/image";
import EmptyState from "../../src/components/empty-state";
const TableChartComponent = dynamic(
  () => import("../../src/components/charts/table-chart"),
  {
    ssr: false,
  }
);
const LikedItems = () => {
  const { user } = useAuth();
  const [liked, setLiked] = useState<any[] | []>([]);
  const { colorMode } = useColorMode();
  const [data, setData] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const tableColumns = [
    "Name",
    "",
    "Price",
    "1h%",
    "24h%",
    "7D%",
    "Market Cap",
    "Volume",
    "Circulating Supply",
    "Last 7 Days",
  ];
  const BuySell = (props: any) => {
    const { coinId } = props;
    const { onOpen, onClose, isOpen } = useDisclosure();

    return (
      <>
        <Button variant="medium-hollow" onClick={onOpen}>
          Buy/Sell
        </Button>
        <BuySellModal name={coinId} onClose={onClose} isOpen={isOpen} />
      </>
    );
  };
  const [error, setError] = useState<null | string>(null);
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
          setLiked([]);
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
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          setData(data);
          setLoaded(true);
        })
        .catch((error) => {
          if (error.message === "Failed to fetch") {
            setError(
              "Exceeded the Rate Limit. Please wait a few minutes and refresh the page"
            );
          }
        });
    } else {
      setData([]);
      setLoaded(true);
    }
  }, [liked]);

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
      <Tr key={coin.id} borderTop="unset" height="64px">
        <Td
          position="sticky"
          left="-1"
          zIndex="2"
          bg={
            colorMode === "light"
              ? "linear-gradient(to left , rgba(245,255,255, 0) 3%, rgba(255,255,255, 1) 14%)"
              : "linear-gradient(to left , rgba(8,28,59, 0) 3%, rgb(3 12 26) 14%)"
          }
          padding="5px 30px 5px 10px"
          // maxW={{ base: "150px", sm: "unset" }}
        >
          <HStack flexWrap="wrap">
            <Favorite coin={coin} setLiked={setLiked} liked={liked} />
          </HStack>
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
          <PercentChange value={coin.price_change_24h} />
        </Td>
        <Td padding="5px 10px">
          <PercentChange value={coin.price_change_percentage_24h} />
        </Td>
        <Td padding="5px 10px">
          <PercentChange value={coin.price_change_percentage_7d_in_currency} />
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
            value={coin.total_volume}
            prefix="$"
            className="table-cell"
          />
        </Td>
        <Td padding="5px 10px">
          <FormattedNumber
            value={coin?.circulating_supply?.toFixed() || null}
            prefix=""
            // sufffix={` ${coin.symbol.toUpperCase()}`}
            className="table-cell"
          />
        </Td>
        <Td padding="5px 10px" width="110px">
          <HStack spacing="0" gap="20px" w="100%">
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
                    <Link passHref href={`/historic-data/${coin.id}`}>
                      <Text>View Charts</Text>
                    </Link>
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
  }, [colorMode, data, liked]);
  return (
    <>
      <Text variant="h-3">Watchlist</Text>

      {user.name ? (
        data.length > 0 && !error && loaded ? (
          <DataTable tableColumns={tableColumns} renderData={renderTableRow} />
        ) : error ? (
          <Text>{error}</Text>
        ) : !loaded ? null : (
          <EmptyState
            header=" You do not have any favorite coins yet."
            action="Add a new coin to get started!"
          />
        )
      ) : (
        <Box>
          <Text>Sign up or sign in to add to favoriets</Text>
        </Box>
      )}
    </>
  );
};

export default LikedItems;
