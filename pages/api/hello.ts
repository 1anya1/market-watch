// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}


// export default async function handler(req, res) {
//   const data = await fetch(
//     `https://www.test.com/api/hello?apiKey=${process.env.API_KEY}`
//   ).then((response) => response.json());

//   res.json(data);
// }