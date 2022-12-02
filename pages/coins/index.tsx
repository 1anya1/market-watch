import { Box, Text } from "@chakra-ui/react";
import DataTableNoChart from "../../src/components/crypto-table-no-chart";
import Navigation from "../../src/components/navigation";

const Crypto = () => {
  return (
    <>
      <Box p="40px 0">
        <Text fontSize="32px" fontWeight={700} pb="20px">
          Market Cap{" "}
        </Text>
        <DataTableNoChart />
      </Box>
    </>
  );
};
export default Crypto;
