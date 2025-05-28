import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { timeframe, idx } = req.query;
  const apiKey = process.env.COINBASE_API;

  const headers = {
    "x-cg-demo-api-key": apiKey ?? "",
  };

  try {
    // Fetch OHLC and Coin Data from CoinGecko
    const [ohlcResponse, coinDataResponse] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/${idx}/ohlc?vs_currency=usd&days=${
          timeframe || 1
        }`,
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

    const { symbol } = coinData;
    let videos: any[] = [];
    let articles: any[] = [];

    try {
      const tokensResponse = await fetch(
        `https://price-api.crypto.com/meta/v1/all-tokens`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; CryptoXchangeBot/1.0)",
            Accept: "application/json",
          },
        }
      );
      const tokensData = await tokensResponse.json();

      const cryptoToken = tokensData.data.find(
        (el: any) => el.symbol.toLowerCase() === symbol.toLowerCase()
      );

      const cryptoId = cryptoToken?.id;

      if (cryptoId) {
        const newsResponse = await fetch(
          `https://price-api.crypto.com/market/v1/token/${cryptoId}/news`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; CryptoXchangeBot/1.0)",
              Accept: "application/json",
            },
          }
        );
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          videos = newsData.videos ?? [];
          articles = newsData.articles ?? [];
        }
      }
    } catch (newsError) {
      console.warn("Failed to fetch news:", newsError);
    }

    res.status(200).json({
      ohlcData,
      coinData,
      videos,
      articles,
    });
  } catch (e: any) {
    console.error("Main handler error:", e);
    res.status(500).json({ error: `Failed to fetch data: ${e.message}` });
  }
}
