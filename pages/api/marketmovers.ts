import { marketMovers } from "../../lib/market-assets";
import type { NextApiRequest, NextApiResponse } from "next";

type Result = { result: any };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {
  res.status(200).json({ result: marketMovers() });
}
