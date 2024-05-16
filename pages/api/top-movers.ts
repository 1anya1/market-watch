// pages/api/top-movers.js
import { NextApiRequest, NextApiResponse } from "next";
import { getData } from "../../lib/market-assets";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch the top movers data
    const strTopMovers = await fetch(
      "https://price-api.crypto.com/price/v1/top-movers?depth=10&tradable_on=EXCHANGE-OR-APP"
    ).then(async (response: { json: () => any; }) => {
      const movers = await response.json();
      const arr = movers.map((el: { name: string; }) =>
        el.name.replace(/[\. ,:-]+/g, "-").toLowerCase()
      );
      const str = arr.join("%2C");
      return str;
    });
    const topMovers = await getData('Top-Movers',
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${strTopMovers}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
    );
 

    // Send the processed data as the response
    res.status(200).json(topMovers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch top movers data" });
  }
};

export default handler;
