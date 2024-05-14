import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getData } from "../../lib/market-assets";
import IndividualCoin from "../../src/components/individual-coin";

const CryptoCoinItem = () => {
  const router = useRouter();
  const coinId = router.query.idx;

  return <IndividualCoin coinId={coinId} individualPage={true} />;
};

export default CryptoCoinItem;

// await fetch(
//   `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${timeFrame}`
// ),
// await fetch(
//   `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
// ),
// ])
// here we are getting server side rendering of the page
export const getServerSideProps:GetServerSideProps= async (context) => {
  console.log(context.query)
  // const globalMetrics = await getData(
  //   "Global-Metrics",
  //   "https://api.coingecko.com/api/v3/global"
  // );
  // const tableData = await getData(
  //   "Table-Data",
  //   "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
  // );
  // const strTopMovers = await fetch(
  //   "https://price-api.crypto.com/price/v1/top-movers?depth=10&tradable_on=EXCHANGE-OR-APP"
  // ).then(async (res) => {
  //   const movers = await res.json();
  //   const arr: string[] = [];
  //   movers.forEach((el: { name: string }) =>
  //     arr.push(el.name.replace(/[\. ,:-]+/g, "-").toLowerCase())
  //   );
  //   const str = arr.join("%2C");
  //   return str
  // });

  // const topMovers = await getData("Top-Movers",  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${strTopMovers}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`)

  // return {
  //   props: {
  //     globalMetrics,
  //     tableData,
  //     topMovers
  //   },
  // };
  return {
    props: {
      name: "anna",
    },
  };
};
