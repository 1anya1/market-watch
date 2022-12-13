import {
  Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import SignIn from "./log-in";
import SignUp from "./sign-up";

const UserAuth = (props: any) => {
  const { userLogin, setUserLogin, isOpen, onClose, nav } = props;
  const [logIn, setLogIn] = useState("log-in");
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent zIndex="100">
        <Box p="20px" borderRadius="11px" className="inhere">
          <Button
            variant="authentication"
            onClick={() => (nav ? setUserLogin("log-in") : setLogIn("log-in"))}
            borderBottom={
              nav
                ? userLogin === "log-in"
                  ? "1px solid white"
                  : "unset"
                : logIn === "log-in"
                ? "1px solid white"
                : "unset"
            }
          >
            Log In
          </Button>
          <Button
            variant="authentication"
            onClick={() =>
              nav ? setUserLogin("sign-up") : setLogIn("sign-up")
            }
            borderBottom={
              nav
                ? userLogin !== "log-in"
                  ? "1px solid white"
                  : "unset"
                : logIn !== "log-in"
                ? "1px solid white"
                : "unset"
            }
          >
            Sign Up
          </Button>
          <ModalCloseButton />
          {nav ? (
            userLogin === "log-in" ? (
              <SignIn onClose={onClose} />
            ) : (
              <SignUp onClose={onClose} />
            )
          ) : logIn === "log-in" ? (
            <SignIn onClose={onClose} />
          ) : (
            <SignUp onClose={onClose} />
          )}
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default UserAuth;
