import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { timeframe, idx } = req.query;

  const apiKey = process.env.COINBASE_API;
  const headers: HeadersInit = {
    "x-cg-demo-api-key": apiKey ?? "",
  };

  try {
    const [ohlcResponse, coinDataResponse] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/${idx}/ohlc?vs_currency=usd&days=${timeframe}`,
        { headers }
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/${idx}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        { headers }
      ),
    ]);

    if (!ohlcResponse.ok || !coinDataResponse.ok) {
      throw new Error("Failed to fetch data from CoinGecko");
    }

    const [ohlcData, coinData] = await Promise.all([
      ohlcResponse.json(),
      coinDataResponse.json(),
    ]);
   
    res.status(200).json({ ohlcData, coinData });
  } catch (e) {

    res.status(500).json({ error: "Failed to fetch data" });
  }
}
