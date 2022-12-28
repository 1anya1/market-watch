import { Box, Container, HStack, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import Logo from "../images/logo";
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { BiWorld } from "react-icons/bi";

const Footer = () => {
  const { colorMode } = useColorMode();
  return (
    <Box bg={colorMode === "light" ? "#f5f6fa" : "#051329"}>
      <Container variant="page" mt="40px" padding="40px 3%">
        <Link href="/" passHref>
          <HStack pb="20px">
            <Box>
              <Logo />
            </Box>

            <Text variant="h-4" color="#4983c6">
              Crypto-XChange
            </Text>
          </HStack>
        </Link>

        <Link href="/about" passHref>
          <Text variant="footer-link">About</Text>
        </Link>
        <Link href="/disclamer" passHref>
          <Text variant="footer-link">Roadmap</Text>
        </Link>
        <Link href="/disclamer" passHref>
          <Text variant="footer-link">Disclamer</Text>
        </Link>
        <HStack
          justifyContent={{ base: "flex-start", sm: "center" }}
          pt="20px"
          spacing="0"
          gap="14px"
        >
          <AiFillGithub size={24} />
          <AiFillLinkedin size={24} />
          <BiWorld size={24} />
        </HStack>
      </Container>
    </Box>
  );
};
export default Footer;
