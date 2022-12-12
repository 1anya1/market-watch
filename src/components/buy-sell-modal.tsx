import {
  Box,
  Button,
  HStack,
  Text,
  useColorMode,
  Image,
  VStack,
  InputLeftAddon,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";

const BuySellModal = (props: any) => {
  const {
    name,
    image,
    currencyExchange,
    handleChangeExchange,
    onClose,
    isOpen,
  } = props;
  const { colorMode } = useColorMode();
  const [cointQuantity, setCoinQuantity] = useState<number>(0);
  const handleChange = (e: any) => {
    setCoinQuantity(e.target.value);
  };
  const date = new Date();
  const time = date.toISOString();
  console.log(time);
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay bg='#000000a8' />
      <ModalContent >
        <ModalHeader>
          <Text variant="h-3" pb="10px">
            Add Transaction
          </Text>
          <HStack spacing="0" gap="10px">
            <Button>Buy</Button>
            <Button>Sell</Button>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <HStack spacing="0" gap="10px" pb="10px">
              <Box>
                <Image
                  src={image}
                  alt={name}
                  width={{ base: "28px", md: "34px" }}
                  height={{ base: "28px", md: "34px" }}
                />
              </Box>
              <Text variant="h-4" pb="0">
                {name}
              </Text>
            </HStack>
            <HStack>
              <FormControl>
                <FormLabel>Quantity</FormLabel>
                <NumberInput max={50} min={10}>
                  <NumberInputField
                    value={cointQuantity}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </NumberInput>
              </FormControl>
              <FormControl isDisabled>
                <FormLabel opacity="1 !important">Price Per Coin USD</FormLabel>
                <InputGroup>
                  <InputLeftAddon justifyContent="center">
                    <Text variant="bold-xsmall">$</Text>
                  </InputLeftAddon>
                  <Box
                    pl="10px"
                    border={
                      colorMode === "light"
                        ? "1px solid #e2e8f1"
                        : "1px solid #4e5767"
                    }
                    width="100%"
                    borderRadius="0 6px 6px  0"
                    cursor="not-allowed"
                  >
                    <NumericFormat
                      value={currencyExchange}
                      displayType="input"
                      thousandSeparator=","
                      className="h-4"
                      onChange={handleChangeExchange}
                      style={{
                        background: "transparent",
                        height: "100%",
                        cursor: "not-allowed",
                        outline: "none",
                      }}
                    />
                  </Box>
                </InputGroup>
              </FormControl>
            </HStack>

            <VStack
              p="20px"
              borderRadius="8px"
              mt="20px"
              spacing="0"
              alignItems="flex-start"
              border={
                colorMode === "light"
                  ? "1px solid #e2e8f1"
                  : "1px solid #4e5767"
              }
            >
              <Text variant="h-5">Total Spent</Text>
              <NumericFormat
                value={
                  cointQuantity * currencyExchange >= 1
                    ? (cointQuantity * currencyExchange).toFixed(2)
                    : (cointQuantity * currencyExchange).toFixed(6)
                }
                displayType="text"
                thousandSeparator=","
                className="h-3"
                prefix="$"
                onChange={handleChangeExchange}
              />
            </VStack>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="large-blue" onClick={onClose} w="100%">
            Add Transaction
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default BuySellModal;
