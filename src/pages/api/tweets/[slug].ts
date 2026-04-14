import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

import { getPostBySlug, getAllPosts } from '../../../utils/Content';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid slug' });
  }

  const post = getPostBySlug(
    slug,
    ['title', 'description', 'date', 'modified_date', 'image', 'content', 'slug'],
    '_tweets'
  );

  if (!post.title) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Find next post
  const allPosts = getAllPosts(['slug'], '_tweets');
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost = allPosts[currentIndex + 1] || null;

  const content = await serialize(post.content || '', {
    mdxOptions: {
      remarkPlugins: [remarkGfm as any],
    },
  });

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
  res.status(200).json({
    ...post,
    content,
    nextSlug: nextPost ? nextPost.slug : null,
  });
}
