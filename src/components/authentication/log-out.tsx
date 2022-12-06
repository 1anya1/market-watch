import { Button } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "../../../context/AuthContext";

const SignOut = () => {
  const { logOut } = useAuth();
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <Button onClick={handleLogout} variant="medium">
      Sign Out
    </Button>
  );
};

export default SignOut;
