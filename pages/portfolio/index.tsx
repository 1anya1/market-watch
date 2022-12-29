import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../context/clientApp";
import {
  Text,
  Td,
  Tr,
  useColorMode,
  Box,
  HStack,
  VStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import DataTable from "../../src/components/table/table";
import FormattedNumber from "../../src/components/number-formatter";
import Image from "next/image";
import Link from "next/link";
import PercentChange from "../../src/components/percent-change-table";
import dynamic from "next/dynamic";
import { TbArrowsLeftRight } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";
import DeleteModal from "../../src/components/modals/delete-modal";
import Favorite from "../../src/components/table/nameColumn";
import EmptyState from "../../src/components/empty-state";
import BuySellModal from "../../src/components/modals/buy-sell-modal";
import { setLogLevel } from "firebase/app";
const Chart = dynamic(
  () => import("../../src/components/charts/simple-chart"),
  {
    ssr: false,
  }
);

const Portfolio = () => {
  const { user } = useAuth();
  const [coins, setCoins] = useState<any>({});
  const [coinIDs, setCoinIDs] = useState<any>([]);
  const [coinData, setCoinData] = useState<any>([]);
  const { colorMode } = useColorMode();
  const [loaded, setLoaded] = useState(false);
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

  useEffect(() => {
    if (user.name) {
      const getPortfolio = async () => {
        const query = await getDocs(
          collection(database, "users", user.name, "portfolio")
        );
        const coinObj: any = {};
        const coinID: string[] = [];
        query.forEach((doc) => {
          coinObj[doc.id] = doc.data();
          coinID.push(doc.id);
        });
        setCoins(coinObj);
        setCoinIDs(coinID);
        const coinString = [...coinID].join("%2C");
        if (coinID.length > 0) {
          await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinString}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
          )
            .then((resData) => {
              if (resData.ok) {
                return resData.json();
              }
            })
            .then((data) => {
              setCoinData(data);
              setLoaded(true);
            });
        }
      };
      getPortfolio();
    }
  }, [user]);

  const Modal = (props: any) => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const { delteteFunction, text } = props;
    return (
      <>
        <Button variant="medium-hollow" onClick={onOpen}>
          <AiFillDelete size={18} />
        </Button>
        {isOpen && (
          <DeleteModal
            isOpen={isOpen}
            onClose={onClose}
            delteteFunction={delteteFunction}
            text={text}
          />
        )}
      </>
    );
  };
  const [liked, setLiked] = useState<any[] | []>([]);
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

  const renderData = useCallback(() => {
    const deleteFromDatabase = async (id: string) => {
      if (user.name) {
        await deleteDoc(doc(database, "users", user.name, "portfolio", id));
        const state = [...coinIDs];
        const prevCoins = { ...coins };
        const prevCoinData = [...coinData];
        delete prevCoins.id;
        const newState = state.filter((el) => el !== id);
        const newStateCoinData = prevCoinData.filter((el) => el.id !== id);
        setCoinIDs(newState);
        setCoins(prevCoins);
        setCoinData(newStateCoinData);
      }
    };
    return coinData.map((coin: any) => (
      <Tr key={coin.id} borderTop="unset" h="64px">
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
          <Favorite
            coin={coin}
            liked={liked}
            setLiked={setLiked}
            link={`${window.location}/${coin.id}`}
          />
        </Td>
        <Td padding="5px 10px">
          {coins[coin.id.toLowerCase()]?.holdingsValue ? (
            <Box>
              <FormattedNumber
                value={coins[coin.id.toLowerCase()]?.holdingsValue}
                prefix="$"
                className="table-cell-bold"
              />
            </Box>
          ) : (
            <Text variant="table-cell-bold">{"---"}</Text>
          )}
          <Box>
            <FormattedNumber
              value={coins[coin.id.toLowerCase()]?.holdings}
              sufffix={`\u00A0${coin.symbol.toUpperCase()}`}
              className="table-cell-small-bold "
            />
          </Box>
        </Td>

        <Td padding="5px 10px">
          <FormattedNumber
            value={coin.current_price}
            prefix="$"
            className="table-cell"
          />
        </Td>
        <Td padding="5px 10px">
          <PercentChange value={coin.price_change_percentage_1h_in_currency} />
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
        <Td padding="5px 16px">
          <Box w="150px">
            <Chart data={coin.sparkline_in_7d.price} table={true} />
          </Box>
        </Td>

        <Td>
          <HStack>
            <Link href={`${window.location}/${coin.id}`} passHref scroll>
              <Button variant="medium-hollow">
                <TbArrowsLeftRight size={18} />
              </Button>
            </Link>

            <Modal
              delteteFunction={() => deleteFromDatabase(coin.id)}
              text={`Are you sure you want to delete ${coin.name} from portfolio? Doing so will remove all the associated transactions.`}
            />
            <BuySell coinId={coin.id} />
          </HStack>
        </Td>
      </Tr>
    ));
  }, [coinData, coinIDs, coins, colorMode, liked, user]);

  const tableColumns = [
    "Coin",
    "Holdings",
    "Price",
    "1h%",
    "24h%",
    "7d%",
    "Market Cap",
    "7 Day Trend",
    "Actions",
  ];

  return (
    <>
      <Text variant="h-3">My Porfolio</Text>
      {user.name && loaded ? (
        coinData.length > 0 ? (
          <DataTable renderData={renderData} tableColumns={tableColumns} />
        ) : (
          <EmptyState
            header="You do not have any coing in portfolio."
            action="Buy or Sell coins to get started!"
          />
        )
      ) : !loaded ? null : (
        <Box>
          <Text>Sign up or sign in to add to favoriets</Text>
        </Box>
      )}
    </>
  );
};

export default Portfolio;
