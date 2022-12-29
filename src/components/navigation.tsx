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
  const [inSearch, setInSearch] = useState(false);
  const calculateClick = (e: any) => {
    if (e?.target?.id) {
      setInSearch(true);
    } else {
      setInSearch(false);
    }
  };

  return (
    <Container
      variant="page"
      onClick={calculateClick}
      minHeight="calc(100vh - 280px)"
    >
      <HStack pt="20px" justifyContent="space-between" gap="20px">
        <Box>
          <Link href="/" passHref>
            <Box cursor="pointer">
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
              cursor="pointer"
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
              Coins
            </Text>
          </Link>

          <Link href="/global">
            <Text
              cursor="pointer"
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

          <>
            {user.name ? (
              <Link href="/watchlist">
                <Text
                  cursor="pointer"
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
            ) : (
              <Text
                onClick={() => {
                  onOpen();
                  setUserLogin("log-in");
                }}
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
            )}
            {user.name ? (
              <Link href="/portfolio">
                <Text
                  cursor="pointer"
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
            ) : (
              <Text
                onClick={() => {
                  onOpen();
                  setUserLogin("log-in");
                }}
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
                Portfolio
              </Text>
            )}
            {user?.name && (
              <HStack>
                <Text>Hi, {user.name}</Text>
                <CgProfile />
              </HStack>
            )}
          </>

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
          <DrawerOverlay display={{ base: "flex", md: "none" }} />
          <DrawerContent
            bg={colorMode === "light" ? "white" : "#081c3b"}
            display={{ base: "flex", md: "none" }}
          >
            <DrawerHeader>
              <HStack justifyContent="space-between">
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
                <Box position="relative" h="32px" w="32px">
                  <DrawerCloseButton position="initial" />
                </Box>
              </HStack>
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing="0" alignItems="flex-start" gap="20px">
                {user.name && (
                  <HStack pb="6px">
                    <CgProfile />
                    <Text variant="bold-small" textTransform="capitalize">
                      Hi, {user.name}
                    </Text>
                  </HStack>
                )}
                <Link href="/">
                  <Text
                    cursor="pointer"
                    color={
                      router.pathname === "/"
                        ? "#4983c6"
                        : colorMode === "light"
                        ? "black"
                        : "#a0aec0"
                    }
                    fontSize="16px"
                    fontWeight={700}
                    onClick={onCloseNav}
                  >
                    Coins
                  </Text>
                </Link>

                <Link href="/global">
                  <Text
                    cursor="pointer"
                    onClick={onCloseNav}
                    color={
                      router.pathname === "/global"
                        ? "#4983c6"
                        : colorMode === "light"
                        ? "black"
                        : "#a0aec0"
                    }
                    fontSize="16px"
                    fontWeight={700}
                  >
                    Global Market
                  </Text>
                </Link>

                {user.name ? (
                  <Link href="/watchlist">
                    <Text
                      cursor="pointer"
                      color={
                        router.pathname === "/crypto"
                          ? "#4983c6"
                          : colorMode === "light"
                          ? "black"
                          : "#a0aec0"
                      }
                      fontSize="16px"
                      fontWeight={700}
                      onClick={onCloseNav}
                    >
                      Watchlist
                    </Text>
                  </Link>
                ) : (
                  <Text
                    cursor="pointer"
                    color={
                      router.pathname === "/crypto"
                        ? "#4983c6"
                        : colorMode === "light"
                        ? "black"
                        : "#a0aec0"
                    }
                    fontSize="16px"
                    fontWeight={700}
                    onClick={() => {
                      onOpen();
                      setUserLogin("sign-up");
                      onCloseNav();
                    }}
                  >
                    Watchlist
                  </Text>
                )}

                {user.name ? (
                  <Link href="/portfolio">
                    <Text
                      cursor="pointer"
                      color={
                        router.pathname === "/crypto"
                          ? "#4983c6"
                          : colorMode === "light"
                          ? "black"
                          : "#a0aec0"
                      }
                      fontSize="16px"
                      fontWeight={700}
                      onClick={onCloseNav}
                    >
                      Portfolio
                    </Text>
                  </Link>
                ) : (
                  <Text
                    cursor="pointer"
                    color={
                      router.pathname === "/crypto"
                        ? "#4983c6"
                        : colorMode === "light"
                        ? "black"
                        : "#a0aec0"
                    }
                    fontSize="16px"
                    fontWeight={700}
                    onClick={() => {
                      onOpen();
                      setUserLogin("sign-up");
                      onCloseNav();
                    }}
                  >
                    Portfolio
                  </Text>
                )}

                {!user.name ? (
                  <VStack
                    alignItems="flex-start"
                    spacing="0"
                    gap="20px"
                    width="100%"
                  >
                    <Button
                      cursor="pointer"
                      width="100%"
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
                      cursor="pointer"
                      width="100%"
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
                  <Box
                    cursor="pointer"
                    w="100%"
                    onClick={() => {
                      onCloseNav();
                    }}
                  >
                    <SignOut />
                  </Box>
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
      <CoinSearch inSearch={inSearch} />
      {children}
    </Container>
  );
};

export default Navigation;
