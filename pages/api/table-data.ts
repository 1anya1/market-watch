// pages/api/top-movers.js
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = process.env.COINBASE_API;
  const headers = {
    "x-cg-demo-api-key": apiKey ?? "",
  };

  const { page } = req.query;
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch crypto data:", error);
    res.status(500).json({ error: "Failed to fetch crypto data" });
  }
};

export default handler;
