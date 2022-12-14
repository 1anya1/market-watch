import { Text, Tr, Td, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { doc, getDoc, collection } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../context/clientApp";
import { useCallback, useEffect, useState } from "react";
import DataTable from "../../src/components/table/table";
import FormattedNumber from "../../src/components/number-formatter";

const Transactions = () => {
  const { user } = useAuth();
  const router = useRouter();
  const coinId = router.query.idx;
  const [data, setData] = useState<any>([]);
  const { colorMode } = useColorMode();

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

  useEffect(() => {
    console.log(data);
  }, [data]);

  const tableColumns = [
    "Date",
    "Type",
    "Price",
    "Quantity",
    "Cost",
    "Proceeds",
  ];
  const renderData = useCallback(() => {
    return data.transactions.map((transaction: any) => {
      const { date, transactionType, price, quantity, totalValue } =
        transaction;
      return (
        <Tr key={date} borderTop="unset">
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
          >
            <Text>{date}</Text>
          </Td>
          <Td padding="5px 10px">
            <Text>{transactionType}</Text>
          </Td>
          <Td padding="5px 10px">
            <Text>{price}</Text>
          </Td>
          <Td padding="5px 10px">
            <Text>{quantity}</Text>
          </Td>
          <Td padding="5px 10px">
            {transactionType === "buy" ? (
              <FormattedNumber
                value={totalValue}
                prefix="$"
                className="body-gray-bold-sm"
              />
            ) : (
              <Text variant="body-gray-bold-sm"> {"---"}</Text>
            )}
          </Td>
          <Td padding="5px 10px">
            {transactionType === "sell" ? (
              <FormattedNumber
                value={totalValue}
                prefix="$"
                className="body-gray-bold-sm"
              />
            ) : (
              <Text variant="body-gray-bold-sm"> {"---"}</Text>
            )}
          </Td>
        </Tr>
      );
    });
  }, [colorMode, data.transactions]);

  return (
    <>
      <Text variant="h-3" pt="40px">
        Transaction History
      </Text>
      {data?.transactions?.length > 0 && (
        <DataTable renderData={renderData} tableColumns={tableColumns} />
      )}
    </>
  );
};
export default Transactions;
