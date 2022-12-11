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
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
} from "@chakra-ui/react";
import Link from "next/link";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useRouter } from "next/router";
import Logo from "../images/logo";
import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import SignUp from "./authentication/sign-up";
import SignIn from "./authentication/log-in";
import SignOut from "./authentication/log-out";
import { useAuth } from "../../context/AuthContext";
import { HiMenuAlt3 } from "react-icons/hi";

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
  const btnRef = useRef();
  useEffect(() => {
    console.log("user in the nav", user);
  }, [user]);
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
                variant="medium"
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
        {/* <Button
          ref={btnRef}
          colorScheme="teal"
          onClick={onOpenNav}
          display={{ base: "box", md: "none" }}
        > */}
        <Box
          // ref={btnRef}
          onClick={onOpenNav}
          display={{ base: "box", md: "none" }}
          cursor='pointer'
        >
          <HiMenuAlt3 size={30} />
        </Box>
        {/* </Button> */}
        <Drawer
          isOpen={navOpen}
          placement="right"
          onClose={onCloseNav}
          // finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>

            <DrawerBody>
              <Box>
                <Link href="/" passHref>
                  <Box onClick={onCloseNav}>
                    <Logo />
                  </Box>
                </Link>
              </Box>

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
                    variant="medium"
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
                </>
              ) : (
                <SignOut />
              )}
              <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size="lg"
               
              >
                <ModalOverlay />
                <ModalContent zIndex="100">
                  <Box p="20px" borderRadius="11px" className="inhere">
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
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onCloseNav}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </HStack>
      {children}
    </>
  );
};

export default Navigation;
