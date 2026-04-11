import React from 'react';

import { GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

import { BlogGallery, IBlogGalleryProps } from '../../blog/BlogGallery';
import { Meta } from '../../layout/Meta';
import { IPaginationProps } from '../../pagination/Pagination';
import { Main } from '../../templates/Main';
import { AppConfig } from '../../utils/AppConfig';
import { getAllPosts } from '../../utils/Content';

const ArticlesPage = (props: IBlogGalleryProps) => (
  <Main
    meta={
      <Meta title="Articles" description="In-depth articles and analysis" />
    }
  >
    <div className="mb-10">
      <h1 className="text-5xl font-extrabold text-secondary mb-2">Articles</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        In-depth analysis, comprehensive guides, and long-form content about the CS2 economy.
      </p>
    </div>
    <BlogGallery posts={props.posts} pagination={props.pagination} />
  </Main>
);

export const getStaticProps: GetStaticProps<IBlogGalleryProps> = async () => {
  const raw: any[] = getAllPosts(
    [
      'title',
      'date',
      'modified_date',
      'image',
      'slug',
      'description',
      'content',
      'category',
    ],
    '_articles'
  )
    .filter((p) => p.category !== 'legal')
    .map((p) => ({ ...p, category: 'articles' }))
    .sort((a: any, b: any) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

  const pagination: IPaginationProps = {};

  const posts = await Promise.all(
    raw.slice(0, AppConfig.pagination_size).map(async (post: any) => {
      const content = await serialize(post.content || '', {
        mdxOptions: { remarkPlugins: [remarkGfm as any] },
      });
      return { ...post, content };
    })
  );

  return { props: { posts, pagination }, revalidate: 10 };
};

export default ArticlesPage;
