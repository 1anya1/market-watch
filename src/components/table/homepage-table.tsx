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
} from "@chakra-ui/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import FormattedNumber from "../number-formatter";
import DataTable from "./table";
import Favorite from "./nameColumn";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { database } from "../../../context/clientApp";

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

const HomepageTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const lastPage = 530;
  const { colorMode } = useColorMode();
  const [liked, setLiked] = useState<any[] | []>([]);
  const { user } = useAuth();

  useEffect(() => {
    const getLiked = async () => {
      console.log("here in gettinglal values");
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
    getLiked();
  }, [user]);

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

  const tableColumnNames = [
    "Name",
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
          <Tr key={coin.id} borderTop="unset">
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
            <Td padding="5px 10px"  >
              
                <FormattedNumber value={coin.current_price} prefix="$" className="table-cell"/>
             
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
             
                <FormattedNumber value={coin.total_volume} prefix="$" className="table-cell" />
             
            </Td>
            <Td padding="5px 10px">
              
                <FormattedNumber value={coin.market_cap} prefix="$" className="table-cell"/>
              
            </Td>
            <Td padding="5px 10px">
  
                <FormattedNumber
                  value={coin?.circulating_supply?.toFixed() || null}
                  prefix=""
                  className="table-cell"
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
        <Text pt="40px" variant="h-3">
          By Market Cap
        </Text>
        <DataTable tableColumns={tableColumnNames} renderData={renderData} />
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

export default HomepageTable;
