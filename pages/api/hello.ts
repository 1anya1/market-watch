// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = await fetch(
    `https://newsapi.org/v2/everything?q=crypto&from=2022-11-08&sortBy=popularity&apiKey=${process.env.NEWS_KEY}&language=en`
  ).then((response) => response.json());

  res.json(data);
}
