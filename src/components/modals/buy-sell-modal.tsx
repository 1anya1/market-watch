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
  NumberInput,
  NumberInputField,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { database } from "../../../context/clientApp";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import UserAuth from "../authentication/user-auth-modal";

const BuySellModal = (props: any) => {
  const { name, onClose, isOpen } = props;

  const [coinData, setData] = useState<any>({});
  const toast = useToast();
  const [toastMessage, setToastMessage] = useState<any>(null);
  useEffect(() => {
    if (toastMessage) {
      const { title, body } = toastMessage;
      toast({
        title: title,
        description: body,
        status: "success",
        variant: "solid",
        duration: 2000,
        position: "top",
        containerStyle: {
          backgroundColor: "green",
          borderRadius: "8px",
        },
      });
    }
    setToastMessage(null);
  }, [toastMessage, toast]);

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${name}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
      .then((res) => res.json())
      .then((data) => {
        const coinData = {
          image: data.image.small,
          price: data.market_data.current_price.usd,
        };
        setData(coinData);
      });
  }, [name]);
  const { user } = useAuth();
  const { colorMode } = useColorMode();
  const [cointQuantity, setCoinQuantity] = useState<number>(0);
  const [buttonAction, setButtonAction] = useState("buy");
  const buyPortfolio = async (cointQuantity: number) => {
    if (user.name) {
      const data = {
        date: new Date().getTime(),
        price: coinData.price,
        quantity: Number(cointQuantity),
        totalValue: Number(coinData.price) * Number(cointQuantity),
        transactionType: "buy",
      };
      const existingData = await getDoc(
        doc(database, "users", user.name, "portfolio", name)
      );
      const incomingData: any = existingData.data();
      let updatedData: any = {};
      if (incomingData) {
        const { transactions, holdings, holdingsValue, totalProceeds } =
          incomingData;
        updatedData = {
          transactions: transactions ? [...transactions, data] : [data],
          holdingsValue: holdingsValue
            ? Number(holdingsValue) + Number(data.totalValue)
            : Number(data.totalValue),
          holdings: holdings
            ? Number(holdings) + Number(data.quantity)
            : Number(data.quantity),
          totalProceeds: totalProceeds ? totalProceeds : 0,
        };
      } else {
        updatedData = {
          transactions: [data],
          holdings: Number(data.quantity),
          holdingdValue: Number(data.totalValue),
          totalProceeds: 0,
        };
      }
      await setDoc(
        doc(database, "users", user.name, "portfolio", name),
        updatedData
      );
      setToastMessage({
        title: "Success",
        body: `${name} buy transaction has been added to portfolio`,
      });
    }
  };
  const sellPortfolio = async (cointQuantity: number) => {
    if (user.name) {
      const data = {
        date: new Date().getTime(),
        price: coinData.price,
        quantity: Number(cointQuantity),
        totalValue: Number(coinData.price) * Number(cointQuantity),
        transactionType: "sell",
      };
      const existingData = await getDoc(
        doc(database, "users", user.name, "portfolio", name)
      );
      const incomingData: any = existingData.data();
      let updatedData: any = {};
      if (incomingData) {
        const { transactions, holdings, holdingsValue, totalProceeds } =
          incomingData;

        updatedData = {
          transactions: transactions ? [...transactions, data] : [],
          holdingsValue: holdingsValue
            ? Number(holdingsValue) - Number(data.totalValue)
            : Number(-data.totalValue),
          holdings: holdings
            ? Number(holdings) - Number(data.quantity)
            : Number(-data.quantity),
          totalProceeds: totalProceeds
            ? totalProceeds + data.totalValue
            : data.totalValue,
        };
      } else {
        updatedData = {
          transactions: [data],
          holdings: Number(-data.quantity),
          holdingsValue: Number(-data.totalValue),
          totalProceeds: data.totalValue,
        };
      }
      await setDoc(
        doc(database, "users", user.name, "portfolio", name),
        updatedData
      );
      setToastMessage({
        title: "Success",
        body: `${name} sell transaction has been added to portfolio`,
      });
    }
  };

  const handleChange = (e: any) => {
    setCoinQuantity(e.target.value);
  };
  const date = new Date();
  const time = date.toISOString();

  return (
    <>
    {user.name ? (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="#000000a8" />
      <ModalContent>
        <ModalHeader>
          <Text variant="h-3" pb="10px">
            Add Transaction To Portfolio
          </Text>
          <HStack
            spacing="0"
            gap="6px"
            bg={colorMode === "light" ? "#e7ecf0" : " #051329"}
            width="max-content"
            p="6px"
            borderRadius="8px"
          >
            <Button
              onClick={() => setButtonAction("buy")}
              bg={
                buttonAction === "buy"
                  ? colorMode === "light"
                    ? "white !important"
                    : "#133364 !important"
                  : "transparent"
              }
              width="100px"
            >
              Buy
            </Button>
            <Button
              onClick={() => setButtonAction("sell")}
              bg={
                buttonAction === "sell"
                  ? colorMode === "light"
                    ? "white !important"
                    : "#133364 !important"
                  : "transparent"
              }
              width="100px"
            >
              Sell
            </Button>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <HStack spacing="0" gap="10px" pb="20px">
              <Box>
                <Image
                  src={coinData.image}
                  alt={name}
                  width={{ base: "28px", md: "34px" }}
                  height={{ base: "28px", md: "34px" }}
                />
              </Box>
              <Text variant="h-4" pb="0" textTransform="capitalize">
                {name}
              </Text>
            </HStack>
            <Stack
              spacing="0"
              flexDir={{ base: "column", md: "row" }}
              gap="10px"
            >
              <FormControl>
                <Text variant="medium" pb="6px">
                  Quantity
                </Text>
                <NumberInput>
                  <NumberInputField
                    value={cointQuantity}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </NumberInput>
              </FormControl>
              <FormControl isDisabled>
                <Text variant="medium" pb="6px">
                  Price Per Coin USD
                </Text>

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
                      value={coinData.price}
                      displayType="text"
                      thousandSeparator=","
                      className="h-4"
                      // onChange={handleChangeExchange}
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
            </Stack>

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
                  cointQuantity * coinData.price >= 1
                    ? (cointQuantity * coinData.price).toFixed(2)
                    : (cointQuantity * coinData.price).toFixed(6)
                }
                displayType="text"
                thousandSeparator=","
                className="h-3"
                prefix="$"
                // onChange={handleChangeExchange}
              />
            </VStack>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="large-blue"
            onClick={() => {
              onClose();
              buttonAction === "buy"
                ? buyPortfolio(cointQuantity)
                : sellPortfolio(cointQuantity);
            }}
            w="100%"
          >
            Add Transaction
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    )
    : 
    (<UserAuth isOpen={isOpen} onClose={onClose} />)
          }
          </>
  );
};
export default BuySellModal;
