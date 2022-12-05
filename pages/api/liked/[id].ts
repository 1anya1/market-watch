import type { NextApiRequest, NextApiResponse } from "next";

import { liked } from "../../../lib/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = req.query.id;

  const likes = await liked(username);
  if (likes) {
    res.status(200).json(likes);
  } else {
    res.status(400).json({ error: "Liked not found not found!" });
  }
}
