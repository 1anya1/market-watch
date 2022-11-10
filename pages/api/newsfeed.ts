import { updateCards } from "../../lib/market-assets";
import type { NextApiRequest, NextApiResponse } from "next";

type Result = { result: boolean }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>,
) {
  res.status(200).json({ result: await updateCards() });
}
