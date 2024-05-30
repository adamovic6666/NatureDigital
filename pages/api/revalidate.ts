import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = req.headers.authorization;

  if (!secret || !secret.startsWith("Secret ") || secret.split(" ")[1] !== process.env.NEXT_REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const slug = req.query.slug as string;

  if (!slug) {
    return res.status(400).json({ message: "Invalid slug" });
  }

  try {
    await res.revalidate(slug);

    return res.json({ revalidated: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error revalidating");
  }
}
