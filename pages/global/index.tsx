import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DoughnutChart from "../../src/components/doughnut-chart";

const GlobalData = () => {
  const [global, setGlobal] = useState<any>(null);
  const [defi, setDefi] = useState<any>(null);
  const [topTen, setTopTen] = useState<any>(null);
  useEffect(() => {
    console.log("calling these damn apiss");
    Promise.all([
      fetch("https://api.coingecko.com/api/v3/global"),
      fetch(
        "https://api.coingecko.com/api/v3/global/decentralized_finance_defi"
      ),
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h"
      ),
    ])
      .then(async ([resGlobal, resDefi, resTopTen]) => {
        const g = await resGlobal.json();
        const d = await resDefi.json();
        const a = await resTopTen.json();
        return [g, d, a];
      })
      .then((data) => {
        console.log({ data });
        setGlobal(data[0].data);
        setDefi(data[1].data);
        setTopTen(data[2]);
      });
  }, []);

  useEffect(() => {
    if (topTen && global) {
      console.log(topTen);
    }
  }, [global, topTen]);
  return (
    <>
      <Text variant="h3">Global Data</Text>
      {global && topTen && <DoughnutChart global={global} topTen={topTen} />}
      
    </>
  );
};

export default GlobalData;
