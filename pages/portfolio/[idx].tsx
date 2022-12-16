import { Text, Tr, Td, useColorMode, Box, Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../context/clientApp";
import { useCallback, useEffect, useState } from "react";
import DataTable from "../../src/components/table/table";
import FormattedNumber from "../../src/components/number-formatter";
import BreadCrums from "../../src/components/breadcrum";

const tableColumns = [
  "Date",
  "Time",
  "Type",
  "Price",
  "Quantity",
  "Cost",
  "Proceeds",
];
const Transactions = () => {
  const { user } = useAuth();
  const router = useRouter();
  const coinId = router.query.idx;
  const [data, setData] = useState<any>([]);
  const { colorMode } = useColorMode();
  const breadcrums = [
    { href: "/portfolio", name: "Portfolio" },
    { href: "", name: coinId },
  ];

  useEffect(() => {
    const getData = async () => {
      if (user.name && coinId) {
        const docRef = await getDoc(
          doc(database, "users", user.name, "portfolio", coinId.toString())
        );
        if (docRef) {
          setData(docRef.data());
        }
      }
    };
    getData();
  }, [coinId, user]);

  const renderData = useCallback(() => {
    return data.transactions.map((transaction: any) => {
      const { date, transactionType, price, quantity, totalValue } =
        transaction;
      return (
        <Tr key={date} borderTop="unset" h="64px">
          <Td
            position="sticky"
            left="-1"
            zIndex="2"
            bg={
              colorMode === "light"
                ? "linear-gradient(to left , rgba(245,255,255, 0) 3%, rgba(255,255,255, 1) 14%)"
                : "linear-gradient(to left , rgba(8,28,59, 0) 3%, rgb(3 12 25) 14%);"
            }
            padding="5px 30px 5px 10px"
            width="160px"
          >
            <Text variant="table-cell">
              {new Date(date).toLocaleDateString()}
            </Text>
          </Td>
          <Td padding="5px 10px">
            <Text variant="table-cell">
              {new Date(date).toLocaleTimeString()}
            </Text>
          </Td>

          <Td padding="5px 10px">
            <Text>{transactionType.toUpperCase()}</Text>
          </Td>
          <Td padding="5px 10px">
            <FormattedNumber value={price} prefix="$" className="table-cell" />
          </Td>
          <Td
            padding="5px 10px"
            color={transactionType === "buy" ? "green" : "red"}
          >
            <Text>{transactionType === "buy" ? quantity : -quantity}</Text>
          </Td>
          <Td padding="5px 10px">
            {transactionType === "buy" ? (
              <FormattedNumber
                value={totalValue}
                prefix="$"
                className="table-cell"
              />
            ) : (
              <Text variant="table-cell"> {"---"}</Text>
            )}
          </Td>
          <Td padding="5px 10px">
            {transactionType === "sell" ? (
              <FormattedNumber
                value={totalValue}
                prefix="$"
                className="table-cell"
              />
            ) : (
              <Text variant="table-cell"> {"---"}</Text>
            )}
          </Td>
        </Tr>
      );
    });
  }, [colorMode, data]);

  return (
    <Box>
      <BreadCrums breadcrums={breadcrums}  />
      <Text variant="h-3" pt="10px">
        Transaction History
      </Text>
      {data?.transactions?.length > 0 && (
        <DataTable renderData={renderData} tableColumns={tableColumns} />
      )}
    </Box>
  );
};
export default Transactions;
