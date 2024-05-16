// pages/api/top-movers.js
import { NextApiRequest, NextApiResponse } from "next";
import { getData } from "../../lib/market-assets";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const globalMetrics = await getData(
        "Global-Metrics",
        "https://api.coingecko.com/api/v3/global"
      );
    res.status(200).json(globalMetrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch top movers data" });
  }
};

export default handler;
