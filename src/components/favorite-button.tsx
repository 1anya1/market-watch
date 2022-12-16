import { FaStar } from "react-icons/fa";

import { database } from "../../context/clientApp";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

import {
  Button,
  useColorMode,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

import UserAuth from "./authentication/user-auth-modal";
import DeleteModal from "./modals/delete-modal";
import { useEffect, useState } from "react";
const FavoriteButton = (props: any) => {
  const { coinId, coinSym, liked, setLiked } = props;
  const { user } = useAuth();
  const {
    isOpen: isOpenLike,
    onOpen: onOpenLike,
    onClose: onCloseLike,
  } = useDisclosure();

  const toast = useToast();
  const [toastMessage, setToastMessage] = useState<any>(null);
  useEffect(() => {
    if (toastMessage) {
      const { title, body } = toastMessage;
      toast({
        title: title,
        description: body,
        status: "success",
        variant: "solid",
        duration: 2000,
        position: "top",
        containerStyle: {
          backgroundColor: "green",
          borderRadius: "8px",
        },
      });
    }
    setToastMessage(null);
  }, [toastMessage, toast]);

  const { colorMode } = useColorMode();

  const addToDatabase = async () => {
    if (user.name) {
      const data = {
        name: coinId,
        sym: coinSym,
      };
      await setDoc(doc(database, "users", user.name, "liked", coinId), data);
      setLiked(true);
      setToastMessage({
        title: "Token Added",
        body: `Successfully added ${coinId} to watchlist.`,
      });
    }
  };
  const deleteFromDatabase = async () => {
    if (user.name) {
      await deleteDoc(doc(database, "users", user.name, "liked", coinId));
      setLiked(false);
      onCloseLike();
      
    }
  };
  const likeFunctionality = () => {
    if (user.name) {
      if (liked) {
        return onOpenLike();
      } else {
        addToDatabase();
      }
    } else {
      onOpenLike();
    }
  };
  return (
    <>
      <Button
        variant="medium-hollow"
        onClick={user.name ? undefined : onOpenLike}
      >
        <FaStar
          size={18}
          onClick={likeFunctionality}
          fill={
            !liked ? "#d3d5ea" : colorMode === "light" ? "#1099fa" : "yellow"
          }
        />
      </Button>
      {!user.name && <UserAuth isOpen={isOpenLike} onClose={onCloseLike} />}
      {isOpenLike && user.name && (
        <DeleteModal
          isOpen={isOpenLike}
          onClose={onCloseLike}
          delteteFunction={deleteFromDatabase}
          coinId={coinId}
          text={`Are you sure you want to remove ${coinId} from watchlist?`}
        />
      )}
    </>
  );
};

export default FavoriteButton;
