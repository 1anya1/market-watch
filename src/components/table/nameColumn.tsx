import {
  Box,
  HStack,
  VStack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { database } from "../../../context/clientApp";
import { useEffect, useState } from "react";
import Link from "next/link";
import UserAuth from "../authentication/user-auth-modal";
import DeleteModal from "../modals/delete-modal";

const Favorite = (props: any) => {
  const { colorMode } = useColorMode();
  const { coin, liked, setLiked, link } = props;
  const { user } = useAuth();
  const [width, setWidth] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  const deleteFromDatabase = async (id: string) => {
    if (user.name) {
      await deleteDoc(doc(database, "users", user.name, "liked", id));
      const state = [...liked];
      const newState = state.filter((el) => el !== id);
      setLiked(newState);
      onClose();
    }
  };
  const likeFunctionality = () => {
    if (user.name) {
      if (liked.indexOf(coin.id as never) !== -1) {
        return onOpen();
      } else {
        addToDatabase(coin.id, coin.symbol);
      }
    } else {
      onOpenLike();
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
  const {
    isOpen: isOpenLike,
    onOpen: onOpenLike,
    onClose: onCloseLike,
  } = useDisclosure();
  return (
    <HStack gap={{ base: "10px", lg: "20px" }} spacing="0">
      <Box pl="4px" cursor='pointer'>
        <FaStar
          onClick={likeFunctionality}
          fill={
            liked.indexOf(coin.id as never) === -1
              ? "#d3d5ea"
              : colorMode === "light"
              ? "#1099fa"
              : "yellow"
          }
        />
        {isOpen && (
          <DeleteModal
            isOpen={isOpen}
            onClose={onClose}
            delteteFunction={() => deleteFromDatabase(coin.id)}
            coinId={coin.id}
            text={`Are you sure you want to remove ${coin.name} from watchlist?`}
          />
        )}

        <UserAuth isOpen={isOpenLike} onClose={onCloseLike} />
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

        <Link href={link ? link : `/coins/${coin.id}`} >
          <VStack spacing="0" gap="4px" alignItems="flex-start" cursor='pointer'>
            <Text
              variant="bold-xsmall"
              maxW={{ base: "75px", lg: "150px" , xl:'unset'}}
              textOverflow="ellipsis"
              overflow="hidden"
              pr='10px'
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
