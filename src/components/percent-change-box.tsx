import { HStack, Box, Text } from "@chakra-ui/react";
import { BsFillTriangleFill } from "react-icons/bs";
import FormattedNumber from "./number-formatter";

const PercentChangeBox = (props: any) => {
  const { val } = props;
  return (
    <HStack
      bg={val < 0 ? "red" : "green"}
      spacing="0"
      gap="4px"
      padding="4px 6px"
      borderRadius="4px"
      width='max-content'
    >
      <Box transform={val < 0 ? "rotate(180deg)" : "rotate(0deg)"}>
        {val !== 0 && <BsFillTriangleFill size={8} fill="white" />}
      </Box>
      <Text variant="chart-percent" color="white">
        {val.toFixed(2)}%
      </Text>
      s
    </HStack>
  );
};

export default PercentChangeBox;
