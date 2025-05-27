import {
  Box,
  Container,
  HStack,
  Text,
  useColorMode,
  Link as ChakraLink,
  Icon,
} from "@chakra-ui/react";
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
          <HStack pb="20px" as="a" _hover={{ textDecoration: "none" }}>
            <Box>
              <Logo />
            </Box>

            <Text variant="h-4" color="#4983c6">
              Crypto-XChange
            </Text>
          </HStack>
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
          <ChakraLink
            href="https://github.com/1anya1/market-watch"
            isExternal
            color="blue.500"
            _hover={{ color: "blue.200", transform: "scale(1.1)" }}
            transition="all 0.2s ease"
          >
            <Icon as={AiFillGithub} boxSize={12} />
          </ChakraLink>

          <ChakraLink
            href="https://www.linkedin.com/in/anna-filatova/"
            isExternal
            color="blue.500"
            _hover={{ color: "blue.200", transform: "scale(1.1)" }}
            transition="all 0.2s ease"
          >
            <Icon as={AiFillLinkedin} boxSize={12} />
          </ChakraLink>

          <ChakraLink
            href="https://anyacodes.com/"
            isExternal
            color="blue.500"
            _hover={{ color: "blue.200", transform: "scale(1.1)" }}
            transition="all 0.2s ease"
          >
            <Icon as={BiWorld} boxSize={12} />
          </ChakraLink>
        </HStack>
      </Container>
    </Box>
  );
};

export default Footer;
