import {
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  useColorMode,
  Table,
} from "@chakra-ui/react";

type Props = {
  tableColumns: any[];
  renderData: any;
};

const DataTable = (props: Props) => {
  const { tableColumns, renderData } = props;
  const { colorMode } = useColorMode();
  
  return (
    <TableContainer>
      <Table>
        <TableCaption fontSize="10px" textAlign="right">
          Powered by CoinGecko API
        </TableCaption>
        <Thead>
          <Tr
            bg={colorMode === "light" ? "#f5f6fa" : "#0b254a"}
            fontSize="10px"
            borderTop="1.25px #ffffff29 solid"
            borderBottom="1.25px #ffffff29 solid"
          >
            {tableColumns.map((el, idx) => {
              if (idx === 0) {
                return (
                  <Th
                    key="idx"
                    position="sticky"
                    left="-1"
                    zIndex="2"
                    fontSize="12px"
                    bg={
                      colorMode === "light"
                        ? "linear-gradient(to left , rgba(245,246,250, 0) 3%, rgba(245,246,250, 1) 14%)"
                        : "linear-gradient(to left , rgba(11,37,74, 0) 3%, rgba(11,37,74, 1) 14%)"
                    }
                  >
                    {el}
                  </Th>
                );
              } else {
                return (
                  <Th key={idx} fontSize="12px" fontWeight="500">
                    {el}
                  </Th>
                );
              }
            })}
          </Tr>
        </Thead>
        <Tbody>{renderData()}</Tbody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
