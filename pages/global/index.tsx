import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DoughnutChart from "../../src/components/doughnut-chart";

const GlobalData = () => {
  const [global, setGlobal] = useState<any>(null);
  const [defi, setDefi] = useState<any>(null);
  useEffect(() => {
    Promise.all([
      fetch("https://api.coingecko.com/api/v3/global"),
      fetch(
        "https://api.coingecko.com/api/v3/global/decentralized_finance_defi"
      ),
    ])
      .then(async ([resGlobal, resDefi]) => {
        const g = await resGlobal.json();
        const d = await resDefi.json();
        return [g, d];
      })
      .then((data) => {
        setGlobal(data[0].data);
        setDefi(data[1].data);
      });
  }, []);
  return (
    <>
      <Text variant="h3">Global Data</Text>
      {global && <DoughnutChart global={global}  />}
    </>
  );
};

export default GlobalData;
