import { Box, Container, HStack, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import Logo from "../images/logo";

const Footer = () => {
  const { colorMode } = useColorMode();
  return (
    <Box bg={colorMode === "light" ? "#f5f6fa" : "#051329"}>
      <Container variant="page" mt="40px" padding="20px 3%">
        <Link href="/" passHref>
          <HStack pb="20px">
            <Box>
              <Logo />
            </Box>

            <Text variant="h-4" color="#4983c6">
              Crypto-XChanges
            </Text>
          </HStack>
        </Link>

        <Link href="/about" passHref>
          <Text variant="bold-small">About</Text>
        </Link>
        <Link href="/disclamer" passHref>
          <Text variant="bold-small">Disclamer</Text>
        </Link>
      </Container>
    </Box>
  );
};
export default Footer;
