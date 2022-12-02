import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "../../../context/AuthContext";

const SignOut = (props: any) => {
  const { setUserActive, setUserInfo } = props;
  const { user, logOut } = useAuth();
  console.log(user);
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setUserActive(true);
    }
  }, [setUserActive]);
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return <Button onClick={handleLogout}>Sign Out</Button>;
};

export default SignOut;
