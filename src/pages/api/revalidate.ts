import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret token to prevent unauthorized revalidation
  // Currently disabled for simplicity, but recommended in production
  // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //   return res.status(401).json({ message: 'Invalid token' });
  // }

  try {
    const { path } = req.query;

    if (path) {
      // Revalidate a specific path
      await res.revalidate(path as string);
      return res.json({ revalidated: true, path });
    }

    // Default: revalidate the main entry points
    await res.revalidate('/');
    await res.revalidate('/articles');
    await res.revalidate('/tweets');
    await res.revalidate('/insights');

    return res.json({ revalidated: true, msg: 'Main pages revalidated' });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
