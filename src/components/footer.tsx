import { Box, HStack, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import Logo from "../images/logo";

const Footer = () => {
  const { colorMode } = useColorMode();
  return (
    <Box bg={colorMode === "light" ? "#f5f6fa" : "#051329"} mt="40px" p="20px">
      <Link href="/" passHref>
        <HStack pb='20px'>
          <Box>
            <Logo />
          </Box>

          <Text variant='h-4' color='#4983c6'>Crypto-XChanges</Text>
        </HStack>
      </Link>

      <Link href="/about" passHref>
        <Text variant="bold-small">About</Text>
      </Link>
      <Link href="/disclamer" passHref>
        <Text variant="bold-small">Disclamer</Text>
      </Link>
    </Box>
  );
};
export default Footer;
