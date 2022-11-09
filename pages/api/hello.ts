// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// type Data = {
//   name: string
// }

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = await fetch(
    `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_KEY}=crypto&language=en`
  ).then((response) => response.json());

  res.json(data);
}
