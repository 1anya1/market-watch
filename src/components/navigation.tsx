import {
  HStack,
  useColorMode,
  Text,
  Box,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Container,
} from "@chakra-ui/react";
import Link from "next/link";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useRouter } from "next/router";
import Logo from "../images/logo";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import SignOut from "./authentication/log-out";
import { useAuth } from "../../context/AuthContext";
import { HiMenuAlt3 } from "react-icons/hi";
import UserAuth from "./authentication/user-auth-modal";
import CoinSearch from "./search/coin-search";

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [userLogin, setUserLogin] = useState("sign-up");
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  const {
    isOpen: navOpen,
    onOpen: onOpenNav,
    onClose: onCloseNav,
  } = useDisclosure();

  return (
    <Container variant="page">
      <HStack pt="20px" justifyContent="space-between" gap="20px">
        <Box>
          <Link href="/" passHref>
            <Box>
              <Logo />
            </Box>
          </Link>
        </Box>
        <HStack
          justifyContent="flex-end"
          gap="20px"
          display={{ base: "none", md: "flex" }}
        >
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

          <Link href="/global">
            <Text
              color={
                router.pathname === "/global"
                  ? "#4983c6"
                  : colorMode === "light"
                  ? "black"
                  : "#a0aec0"
              }
              fontSize="14px"
              fontWeight={700}
            >
              Global Market
            </Text>
          </Link>

          {user?.name && (
            <>
              <Link href="/watchlist">
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
                  Watchlist
                </Text>
              </Link>
              <Link href="/portfolio">
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
                  onClick={onCloseNav}
                >
                  Portfolio
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
                variant="medium-hollow"
                onClick={() => {
                  onOpen();
                  setUserLogin("log-in");
                }}
              >
                Log In
              </Button>
              <Button
                variant="medium"
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
          <UserAuth
            nav
            userLogin={userLogin}
            setUserLogin={setUserLogin}
            isOpen={isOpen}
            onClose={onClose}
          />
          <Box
            w="50px"
            h="28px"
            bg={colorMode === "light" ? "#e7ecf0" : "#123364"}
            position="relative"
            cursor="pointer"
            borderRadius="52px"
            transition="left 1000ms linear"
            onClick={toggleColorMode}
            border={
              colorMode === "light" ? "2px solid #e7ecf0" : " 2px solid #123364"
            }
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="50%"
              h="24px"
              w="24px"
              bg={colorMode === "light" ? "white" : "#081c3b"}
              position="absolute"
              className={colorMode === "light" ? "toggle-left" : "toggle-right"}
            >
              {colorMode === "light" ? (
                <MdDarkMode size={20} onClick={toggleColorMode} />
              ) : (
                <MdLightMode
                  size={20}
                  onClick={toggleColorMode}
                  fill="#a0aec0"
                />
              )}
            </Box>
          </Box>
        </HStack>

        <HStack display={{ base: "flex", md: "none" }} spacing="0" gap="14px">
          <Box
            // ref={btnRef}
            onClick={onOpenNav}
            // display={{ base: "box", md: "none" }}
            cursor="pointer"
          >
            <HiMenuAlt3 size={30} />
          </Box>
        </HStack>

        {/* </Button> */}
        <Drawer
          isOpen={navOpen}
          placement="right"
          onClose={onCloseNav}
          // finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent bg={colorMode === "light" ? "white" : "#081c3b"}>
            <DrawerHeader>
              <HStack justifyContent="space-between">
                <Box>
                  <Link href="/" passHref>
                    <Box onClick={onCloseNav}>
                      <Logo />
                    </Box>
                  </Link>
                </Box>
                <DrawerCloseButton />
              </HStack>
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing="0" alignItems="flex-start" gap="10px">
                <Box
                  w="50px"
                  h="28px"
                  bg={colorMode === "light" ? "#e7ecf0" : "#123364"}
                  position="relative"
                  borderRadius="52px"
                  transition="left 1000ms linear"
                  border={
                    colorMode === "light"
                      ? "2px solid #e7ecf0"
                      : " 2px solid #123364"
                  }
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="50%"
                    h="24px"
                    w="24px"
                    bg={colorMode === "light" ? "white" : "#081c3b"}
                    position="absolute"
                    onClick={toggleColorMode}
                    className={
                      colorMode === "light" ? "toggle-left" : "toggle-right"
                    }
                  >
                    {colorMode === "light" ? (
                      <MdDarkMode size={20} onClick={toggleColorMode} />
                    ) : (
                      <MdLightMode size={20} onClick={toggleColorMode} />
                    )}
                  </Box>
                </Box>
                {user.name && (
                  <HStack>
                    <Text>Hi, {user.name}</Text>
                    <CgProfile />
                  </HStack>
                )}
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
                    onClick={onCloseNav}
                  >
                    Home
                  </Text>
                </Link>

                <Link href="/global">
                  <Text
                    onClick={onCloseNav}
                    color={
                      router.pathname === "/global"
                        ? "#4983c6"
                        : colorMode === "light"
                        ? "black"
                        : "#a0aec0"
                    }
                    fontSize="14px"
                    fontWeight={700}
                  >
                    Global Market
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
                        onClick={onCloseNav}
                      >
                        Watchlist
                      </Text>
                    </Link>
                  </>
                )}
                {user?.name && (
                  <>
                    <Link href="/portfolio">
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
                        onClick={onCloseNav}
                      >
                        Portfolio
                      </Text>
                    </Link>
                  </>
                )}
                {!user.name ? (
                  <VStack alignItems="flex-start" spacing="0" gap="10px">
                    <Button
                      w="80px"
                      variant="medium-hollow"
                      onClick={() => {
                        onOpen();
                        setUserLogin("log-in");
                        onCloseNav();
                      }}
                    >
                      Log In
                    </Button>
                    <Button
                      variant="medium"
                      onClick={() => {
                        onOpen();
                        setUserLogin("sign-up");
                        onCloseNav();
                      }}
                    >
                      Sign Up
                    </Button>
                  </VStack>
                ) : (
                  <SignOut />
                )}
                <UserAuth
                  nav
                  userLogin={userLogin}
                  setUserLogin={setUserLogin}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </HStack>
      <CoinSearch />
      {children}
    </Container>
  );
};

export default Navigation;
