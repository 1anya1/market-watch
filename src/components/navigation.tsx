import { HStack, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack>
      <Link href="/crypto">Crypto</Link>
      <HStack pt="20px">
        {colorMode === "light" ? (
          <MdDarkMode size={20} onClick={toggleColorMode} />
        ) : (
          <MdLightMode size={20} onClick={toggleColorMode} />
        )}
      </HStack>
    </HStack>
  );
};

export default Navigation;
