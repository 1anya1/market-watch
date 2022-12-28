/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

const CoinSearch = (props: any) => {
  const { inSearch } = props;
  const { colorMode } = useColorMode();
  const [searchVal, setSearchVal] = useState("");
  const [sortedCoins, setSortedCoins] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/search?locale=en")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    if (!inSearch) {
      setSortedCoins([]);
      setSearchVal("");
    }
  }, [inSearch]);

  const handleChange = (e: { target: { value: any } }) => {
    const val = e.target.value;
    setSearchVal(val);
  };

  const search = (arr: any, val: string) => {
    console.log("in here");
    if (val.length < 1) {
      setSortedCoins([]);
    } else {
      const value = val.toLowerCase();
      const res = arr.filter(
        (el: { id: string; symbol: string }) =>
          el.id.startsWith(value) || el.symbol.toLowerCase().startsWith(value)
      );
      setSortedCoins(res);
    }
  };
  useEffect(() => {
    if (data?.coins?.length > 0) {
      if (searchVal) {
        const coins = [...data.coins];
        search(coins, searchVal);
      } else {
        setSortedCoins([]);
      }
    }
  }, [data, searchVal]);
  useEffect(() => {
    console.log(searchVal);
  }, [searchVal]);

  return (
    <HStack
      justifyContent="flex-end"
      alignItems="flex-start"
      pt={{ base: "34px", md: "40px" }}
      pb={{ base: "40px", md: "20px" }}
      flexDir={{ base: "column-reverse", md: "row" }}
      rowGap="20px"
      spacing="0"
    >
      <Box
        width={{ base: "94vw", md: "max-content" }}
        zIndex={inSearch ? "13" : "1"}
        mr="0"
      >
        <Popover
          placement="bottom-end"
          autoFocus={false}
          defaultIsOpen={true}
          returnFocusOnClose={false}
          isOpen={true}
        >
          <PopoverTrigger>
            <Button
              justifyContent="flex-start"
              gap="12px"
              variant="medium-hollow"
              margin="0 auto"
              visibility="hidden"
            >
              <BiSearch />
              <Text>Seach</Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent top="-50px" width={{ base: "94vw", md: "100%" }}>
            <InputGroup w={{ sm: "100%", md: "247px" }} maxW="94vw">
              <InputLeftElement
                pointerEvents="none"
                children={
                  <BiSearch
                    fill={colorMode === "light" ? "black" : "white"}
                    size={16}
                  />
                }
              />
              <Input
                onChange={handleChange}
                value={searchVal}
                placeholder="Search"
                border="unset"
                id="search-bar"
              />
              {searchVal.length > 0 && (
                <InputRightElement
                  pointerEvents="all"
                  children={
                    <IoMdClose
                      size={16}
                      fill={colorMode === "light" ? "black" : "white"}
                      onClick={() => {
                        setSortedCoins([]);
                        setSearchVal("");
                      }}
                    />
                  }
                />
              )}
            </InputGroup>
            {sortedCoins.length > 0 && (
              <PopoverBody
                width={{ base: "90vw", md: "240px" }}
                overflowX="hidden"
                overflowY="scroll"
                maxH={{ base: "32vh", md: "250px" }}
                pt="20px"
              >
                <VStack gap="10px">
                  {sortedCoins.map((el: any) => (
                    <Link key={el.id} href={`/coins/${el.id}`} passHref scroll>
                      <HStack
                        width="98%"
                        onClick={() => {
                          setSortedCoins([]);
                          setSearchVal("");
                        }}
                      >
                        <Box position="relative" h="20px" w="20px">
                          {el.thumb !== "missing_thumb.png" ? (
                            <Image
                              src={el?.thumb}
                              alt="coin symbol"
                              layout="fill"
                            />
                          ) : (
                            <Box bg="gray" />
                          )}
                        </Box>
                        <Text textTransform="capitalize" variant="small-bold">
                          {el?.id}
                        </Text>
                        <Text variant="table-cell-bold">{el?.symbol}</Text>
                      </HStack>
                    </Link>
                  ))}
                </VStack>
              </PopoverBody>
            )}
          </PopoverContent>
        </Popover>
      </Box>
    </HStack>
  );
};

export default CoinSearch;
