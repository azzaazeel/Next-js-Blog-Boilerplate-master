import React from 'react';

import { GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

import { BlogGallery, IBlogGalleryProps } from '../blog/BlogGallery';
import { Meta } from '../layout/Meta';
import { IPaginationProps } from '../pagination/Pagination';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';
import { getAllPosts } from '../utils/Content';

import { ReactElement } from 'react';

const Index = (props: IBlogGalleryProps) => (
  <BlogGallery posts={props.posts} pagination={props.pagination} />
);

Index.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main
      meta={<Meta title={AppConfig.title} description={AppConfig.description} />}
    >
      {page}
    </Main>
  );
};

export const getStaticProps: GetStaticProps<IBlogGalleryProps> = async () => {
  const postsFromTweets: any[] = getAllPosts(
    [
      'title',
      'date',
      'modified_date',
      'image',
      'slug',
      'description',
      'content',
    ],
    '_tweets'
  ).map((p) => ({ ...p, category: 'tweets' }));

  const rawPosts = [...postsFromTweets].sort((a: any, b: any) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  const pagination: IPaginationProps = {};

  if (rawPosts.length > AppConfig.pagination_size) {
    pagination.next = '/page2';
  }

  const posts = await Promise.all(
    rawPosts.slice(0, AppConfig.pagination_size).map(async (post: any) => {
      const content = await serialize(post.content || '', {
        mdxOptions: {
          remarkPlugins: [remarkGfm as any],
        },
      });
      return { ...post, content };
    })
  );

  return {
    props: {
      posts,
      pagination,
    },
    revalidate: 10,
  };
};

export default Index;
