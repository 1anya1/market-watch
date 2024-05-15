import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { env } from "process";
import { getData } from "../../lib/market-assets";
import IndividualCoin from "../../src/components/individual-coin";

const CryptoCoinItem = (props: any) => {
  const { ohlcData, coinData, error, news } = props;
  const router = useRouter();
  const coinId = router.query.idx;
  console.log(ohlcData);

  return (
    <IndividualCoin
      coinId={coinId}
      individualPage={true}
      ohlcData={ohlcData}
      coinData={coinData}
      error={error}
      news={news}
    />
  );
};

export default CryptoCoinItem;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { timeframe, idx } = context.query;
  const headers: HeadersInit = {
    "x-cg-demo-api-key": process.env.COINBASE_API ?? "",
  };

  if (idx) {
    try {
      const [ohlcResponse, coinDataResponse] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/coins/${idx}/ohlc?vs_currency=usd&days=${
            timeframe ? timeframe : 1
          }`,
          {
            headers,
          }
        ),
        fetch(
          `https://api.coingecko.com/api/v3/coins/${idx}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
          {
            headers,
          }
        ),
      ]);

      const [ohlcData, coinData] = await Promise.all([
        ohlcResponse.json(),
        coinDataResponse.json(),
      ]);

      const { symbol } = coinData;
      const cryptoId = await fetch(
        `https://price-api.crypto.com/meta/v1/all-tokens`
      )
        .then((res) => res.json())
        .then((data) => {
          const findId = data.data.find(
            (el: { symbol: string }) => el.symbol.toLowerCase() === symbol
          );
          return findId?.id;
        });

      const news = await fetch(
        `https://price-api.crypto.com/market/v2/token/${cryptoId}/news`
      )
        .then((res) => res.json())
        .then((data) => {
          return data;
        });

      return {
        props: {
          ohlcData,
          coinData,
          news,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        props: {
          ohlcData: null,
          coinData: null,
          news: null,
          error: "Failed to fetch data",
        },
      };
    }
  }
  return {
    props: {
      ohlcData: null,
      coinData: null,
      news: null,
      error: "Failed to fetch data",
    }}
    
};
