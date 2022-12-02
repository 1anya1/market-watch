import {
  HStack,
  useColorMode,
  Text,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useRouter } from "next/router";
import Logo from "../images/logo";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import SignUp from "./authentication/sign-up";
import SignIn from "./authentication/log-in";
import SignOut from "./authentication/log-out";
import { useAuth } from "../../context/AuthContext";

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [userLogin, setUserLogin] = useState("sign-up");
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  return (
    <>
      <HStack pt="20px" justifyContent="space-between" gap="20px">
        <Box>
          <Link href="/" passHref>
            <Box>
            <Logo />
            </Box>
          </Link>
        </Box>
        <HStack justifyContent="flex-end" gap="20px">
          <Link href="/">
            <Text
              color={
                router.pathname === "/"
                  ? "#4983c6"
                  : colorMode === "light"
                  ? "black"
                  : "#a0aec0"
              }
              fontSize="14px"
              fontWeight={700}
            >
              Home
            </Text>
          </Link>

          <Link href="/coins">
            <Text
              color={
                router.pathname === "/crypto"
                  ? "#4983c6"
                  : colorMode === "light"
                  ? "black"
                  : "#a0aec0"
              }
              fontSize="14px"
              fontWeight={700}
            >
              Crypto
            </Text>
          </Link>

          {user?.name && (
            <>
              <Link href="/liked">
                <Text
                  color={
                    router.pathname === "/crypto"
                      ? "#4983c6"
                      : colorMode === "light"
                      ? "black"
                      : "#a0aec0"
                  }
                  fontSize="14px"
                  fontWeight={700}
                >
                  My Items
                </Text>
              </Link>
              <HStack>
                <Text>Hi, {user.name}</Text>
                <CgProfile />
              </HStack>
            </>
          )}
          {!user.name ? (
            <>
              <Button
                onClick={() => {
                  onOpen();
                  setUserLogin("log-in");
                }}
              >
                Log In
              </Button>
              <Button
                onClick={() => {
                  onOpen();
                  setUserLogin("sign-up");
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <SignOut />
          )}
          <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent>
              <Box p="20px" borderRadius="11px">
                <Button
                  variant="authentication"
                  onClick={() => setUserLogin("log-in")}
                  borderBottom={
                    userLogin === "log-in" ? "1px solid white" : "unset"
                  }
                >
                  Log In
                </Button>
                <Button
                  variant="authentication"
                  onClick={() => setUserLogin("sign-up")}
                  borderBottom={
                    userLogin !== "log-in" ? "1px solid white" : "unset"
                  }
                >
                  Sign Up
                </Button>
                <ModalCloseButton />
                {userLogin === "log-in" ? (
                  <SignIn onClose={onClose} />
                ) : (
                  <SignUp onClose={onClose} />
                )}
              </Box>
            </ModalContent>
          </Modal>

          <HStack>
            {colorMode === "light" ? (
              <MdDarkMode size={20} onClick={toggleColorMode} />
            ) : (
              <MdLightMode size={20} onClick={toggleColorMode} />
            )}
          </HStack>
        </HStack>
      </HStack>
      {children}
    </>
  );
};

export default Navigation;
