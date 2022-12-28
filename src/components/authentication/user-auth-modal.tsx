import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import SignIn from "./log-in";
import SignUp from "./sign-up";

const UserAuth = (props: any) => {
  const { userLogin, setUserLogin, isOpen, onClose, nav } = props;
  const [logIn, setLogIn] = useState("log-in");
  const { colorMode } = useColorMode();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent zIndex="100">
        <Box p="20px" borderRadius="11px" className="inhere" mt='20px'>
          <HStack
            spacing="0"
            gap="6px"
            bg={colorMode === "light" ? "#e7ecf0" : " #051329"}
            width={{ base: "100%", sm: "max-content" }}
            p="6px"
            borderRadius="8px"
          >
            <Button
              onClick={() =>
                userLogin ? setUserLogin("log-in") : setLogIn("log-in")
              }
              bg={
                userLogin
                  ? userLogin === "log-in"
                    ? colorMode === "light"
                      ? "white !important"
                      : "#133364 !important"
                    : "transparent"
                  : logIn === "log-in"
                  ? colorMode === "light"
                    ? "white !important"
                    : "#133364 !important"
                  : "transparent"
              }
              width={{ base: "48%", sm: "100px" }}
            >
              Log In
            </Button>
            <Button
              onClick={() =>
                userLogin ? setUserLogin("sign-up") : setLogIn("sign-up")
              }
              bg={
                userLogin
                  ? userLogin === "sign-up"
                    ? colorMode === "light"
                      ? "white !important"
                      : "#133364 !important"
                    : "transparent"
                  : logIn === "sign-up"
                  ? colorMode === "light"
                    ? "white !important"
                    : "#133364 !important"
                  : "transparent"
              }
              width={{ base: "48%", sm: "100px" }}
            >
              Sign Up
            </Button>
          </HStack>

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
