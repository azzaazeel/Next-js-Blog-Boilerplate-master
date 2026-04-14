import React from 'react';

import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

import { EmbedPost } from '../../components/EmbedPost';
import { Insight } from '../../components/Insight';
import { Content } from '../../content/Content';
import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { getAllPosts, getPostBySlug } from '../../utils/Content';
import { useBlogCharts } from '../../utils/useBlogCharts';

const components = {
  Insight,
  EmbedPost,
};

type IPostUrl = {
  slug: string;
};

type IPostProps = {
  title: string;
  description: string;
  date: string;
  modified_date: string;
  image: string;
  content: MDXRemoteSerializeResult;
};

import { ReactElement } from 'react';

const DisplayPost = (props: IPostProps) => {
  useBlogCharts([props.content.compiledSource]);

  return (
    <>
      <div className="pt-10 pb-12 text-center">
        <h1 className="font-light text-5xl text-gray-600 mb-4 tracking-tight">
          {props.title}
        </h1>
        <div className="text-gray-400">
          {format(new Date(props.date), 'LLLL d, yyyy')}
        </div>
      </div>

      <Content>
        <MDXRemote {...props.content} components={components} />
      </Content>
    </>
  );
};

DisplayPost.getLayout = function getLayout(page: ReactElement) {
  const props = page.props as IPostProps;
  return (
    <Main
      meta={
        <Meta
          title={props.title}
          description={props.description}
          post={{
            image: props.image,
            date: props.date,
            modified_date: props.modified_date,
          }}
        />
      }
    >
      {page}
    </Main>
  );
};

export const getStaticPaths: GetStaticPaths<IPostUrl> = async () => {
  const posts = getAllPosts(['slug'], '_insights');

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IPostProps, IPostUrl> = async ({
  params,
}) => {
  const post = getPostBySlug(
    params!.slug,
    [
      'title',
      'description',
      'date',
      'modified_date',
      'image',
      'content',
      'slug',
    ],
    '_insights'
  );
  if (!post.title) {
    return {
      notFound: true,
    };
  }
  const content = await serialize(post.content || '', {
    mdxOptions: {
      remarkPlugins: [remarkGfm as any],
    },
  });

  return {
    props: {
      title: post.title || '',
      description: post.description || '',
      date: post.date || new Date().toISOString(),
      modified_date: post.modified_date || post.date || new Date().toISOString(),
      image: post.image || '',
      content,
    },
    revalidate: 10,
  };
};

export default DisplayPost;
