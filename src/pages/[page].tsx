import React from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

import { BlogGallery, IBlogGalleryProps } from '../blog/BlogGallery';
import { Meta } from '../layout/Meta';
import { IPaginationProps } from '../pagination/Pagination';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';
import { getAllPosts } from '../utils/Content';
import { convertTo2D } from '../utils/Pagination';

type IPageUrl = {
  page: string;
};

const PaginatePosts = (props: IBlogGalleryProps) => (
  <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
    <BlogGallery posts={props.posts} pagination={props.pagination} />
  </Main>
);

export const getStaticPaths: GetStaticPaths<IPageUrl> = async () => {
  const postsFromTweets = getAllPosts(['slug'], '_tweets');
  const posts = [...postsFromTweets];

  const pages = convertTo2D(posts, AppConfig.pagination_size);

  return {
    paths: pages.slice(1).map((_, index) => ({
      params: {
        // Index starts from zero so we need to do index + 1
        // slice(1) removes the first page so we do another index + 1
        // the first page is implemented in index.tsx
        page: `page${index + 2}`,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  IBlogGalleryProps,
  IPageUrl
> = async ({ params }) => {
  const postsFromTweets: any[] = getAllPosts(
    ['title', 'date', 'slug', 'description', 'content'],
    '_tweets'
  ).map((p) => ({ ...p, category: 'tweets' }));

  const rawPosts = [...postsFromTweets].sort((a: any, b: any) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  const pages = convertTo2D(rawPosts, AppConfig.pagination_size);
  const currentPage = Number(params!.page.replace('page', ''));
  const currentIndex = currentPage - 1;

  const pagination: IPaginationProps = {};

  if (currentPage < pages.length) {
    pagination.next = `page${currentPage + 1}`;
  }

  if (currentPage === 2) {
    pagination.previous = '/';
  } else {
    pagination.previous = `page${currentPage - 1}`;
  }

  const posts = await Promise.all(
    pages[currentIndex].map(async (post: any) => {
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

export default PaginatePosts;
