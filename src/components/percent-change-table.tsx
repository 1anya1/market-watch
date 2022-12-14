import { HStack, Text } from "@chakra-ui/react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const PercentChange = (props: any) => {
  const { value } = props;
  return (
    <HStack gap="3px">
      {value > 0 ? (
        <AiFillCaretUp size={14} fill="var(--green)" />
      ) : value < 0 ? (
        // eslint-disable-next-line react/jsx-no-undef
        <AiFillCaretDown size={14} fill="var(--red)" />
      ) : undefined}
      <Text
        fontSize="14px"
        fontWeight="600"
        color={value > 0 ? "green" : value < 0 ? "red" : "white"}
        margin="0 !important"
      >
        {Math.abs(value).toFixed(2)}%
      </Text>
    </HStack>
  );
};

export default PercentChange;
