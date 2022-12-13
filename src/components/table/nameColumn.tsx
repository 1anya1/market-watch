import { Box, HStack, VStack, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { database } from "../../../context/clientApp";
import { useEffect, useState } from "react";
import Link from "next/link";
const Favorite = (props: any) => {
  const { colorMode } = useColorMode();
  const { coin, liked, setLiked } = props;
  const { user } = useAuth();
  const [favoredItems, setFavored] = useState<string | number[]>([]);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);
  const deleteFromDatabase = async (id: string) => {
    console.log("in delete");
    if (user.name) {
      await deleteDoc(doc(database, "users", user.name, "liked", id));
      const state = [...liked];
      const newState = state.filter((el) => el !== id);
      setLiked(newState);
    }
  };
  const addToDatabase = async (name: any, sym: any) => {
    console.log("in add ");
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
  return (
    <HStack gap={{ base: "10px", lg: "20px" }} spacing="0">
      <Box pl="4px">
        <FaStar
          onClick={() =>
            liked.indexOf(coin.id as never) !== -1
              ? deleteFromDatabase(coin.id)
              : addToDatabase(coin.id, coin.symbol)
          }
          fill={
            liked.indexOf(coin.id as never) === -1
              ? "#d3d5ea"
              : colorMode === "light"
              ? "#1099fa"
              : "yellow"
          }
        />
      </Box>
      <HStack spacing="0" gap={{ base: "8px", lg: "14px" }}>
        <Box
          h={width < 575 ? "20px" : "26px"}
          w={width < 575 ? "22px" : "26px"}
        >
          <Image
            src={coin.image}
            alt={coin.name}
            height={width < 575 ? "22px" : "26px"}
            width={width < 575 ? "22px" : "26px"}
          />
        </Box>

        <Link href={`/coins/${coin.id}`}>
          <VStack spacing="0" gap="4px" alignItems="flex-start">
            <Text
              variant="bold-xsmall"
              maxW={{ base: "75px", lg: "unset" }}
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {coin.name}
            </Text>
            <Text variant="xxs-text">{coin.symbol.toUpperCase()}</Text>
          </VStack>
        </Link>
      </HStack>
    </HStack>
  );
};

export default Favorite;
