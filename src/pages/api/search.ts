import { NextApiRequest, NextApiResponse } from 'next';

import { getAllPosts } from '../../utils/Content';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Cache search results for 1 hour, allowing 59s of stale data while revalidating
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=59'
  );

  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(200).json([]);
  }

  const query = q.toLowerCase();

  const tweets = getAllPosts(['title', 'description', 'slug'], '_tweets').map(
    (p: any) => ({ ...p, category: 'tweets' })
  );
  const articles = getAllPosts(
    ['title', 'description', 'slug'],
    '_articles'
  ).map((p: any) => ({ ...p, category: 'articles' }));
  const insights = getAllPosts(
    ['title', 'description', 'slug'],
    '_insights'
  ).map((p: any) => ({ ...p, category: 'insights' }));

  const allPosts = [...tweets, ...articles, ...insights];

  const results = allPosts
    .filter(
      (post) =>
        post.title?.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query)
    )
    .slice(0, 5);

  return res.status(200).json(results);
}
