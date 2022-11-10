import { updateCards } from "../../lib/market-assets";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ result: await updateCards() });
}
