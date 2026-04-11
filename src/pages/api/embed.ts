import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

import { getPostBySlug } from '../../utils/Content';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug, type } = req.query;

  if (!slug || !type) {
    return res.status(400).json({ message: 'Missing slug or type' });
  }

  try {
    const post = getPostBySlug(
      slug as string,
      ['title', 'content'],
      type as string
    );
    const mdxSource = await serialize(post.content || '', {
      mdxOptions: {
        remarkPlugins: [remarkGfm as any],
      },
    });

    return res.status(200).json({
      title: post.title,
      mdxSource,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch embedded post' });
  }
}
