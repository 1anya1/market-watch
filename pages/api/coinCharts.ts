

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest,
   res: NextApiResponse) {
  const { timeframe, idx } = req.query;

  const apiKey =  process.env.COINBASE_API;
  const headers = {
    "x-cg-demo-api-key": apiKey ?? '',
  };

  try {
    const [ohlcResponse, coinDataResponse] = await Promise.all([
      fetch(`https://api.coingecko.com/api/v3/coins/${idx}/ohlc?vs_currency=usd&days=${timeframe? timeframe : 1}`, { headers }),
      fetch(`https://api.coingecko.com/api/v3/coins/${idx}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, { headers }),
    ]);

    if (!ohlcResponse.ok || !coinDataResponse.ok) {
      throw new Error('Failed to fetch data from CoinGecko');
    }

    const [ohlcData, coinData] = await Promise.all([
      ohlcResponse.json(),
      coinDataResponse.json(),
    ]);

    const { symbol } = coinData;
    const cryptoId = await fetch(`https://price-api.crypto.com/meta/v1/all-tokens`)
      .then((res) => res.json())
      .then((data) => {
        const findId = data.data.find((el:any) => el.symbol.toLowerCase() === symbol);
        return findId?.id;
      });

    const news = await fetch(`https://price-api.crypto.com/market/v2/token/${cryptoId}/news`)
      .then((res) => res.json())
      .then((data) => data);

    res.status(200).json({ ohlcData, coinData, news });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

