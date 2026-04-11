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

const InsightsPage = (props: IBlogGalleryProps) => (
  <Main
    meta={
      <Meta title="Insights" description="Market insights and data analysis" />
    }
  >
    <div className="mb-10">
      <h1 className="text-5xl font-extrabold text-secondary mb-2">Insights</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Data-driven market intelligence, trend analysis, and professional investment breakdowns.
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
    ],
    '_insights'
  )
    .map((p) => ({ ...p, category: 'insights' }))
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

export default InsightsPage;
