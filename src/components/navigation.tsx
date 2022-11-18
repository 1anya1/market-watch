import { HStack, useColorMode, Text, Box } from "@chakra-ui/react";
import Link from "next/link";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useRouter } from "next/router";
import Logo from "../images/logo";

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  return (
    <HStack pt="20px" justifyContent="space-between" gap="20px">
      <Box>
        <Link href="/">
          <Logo />
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

        <Link href="/crypto">
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
        <HStack>
          {colorMode === "light" ? (
            <MdDarkMode size={20} onClick={toggleColorMode} />
          ) : (
            <MdLightMode size={20} onClick={toggleColorMode} />
          )}
        </HStack>
      </HStack>
    </HStack>
  );
};

export default Navigation;
