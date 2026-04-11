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
  type: string;
  marketImpact: string;
  content: MDXRemoteSerializeResult;
};

const CSNewsPost = (props: IPostProps) => {
  useBlogCharts([props.content.compiledSource]);

  return (
    <Main
      meta={
        <Meta
          title={props.title}
          description={props.description}
          post={{
            image: '',
            date: props.date,
            modified_date: props.date,
          }}
        />
      }
    >
      <div className="pt-10 pb-12 text-center max-w-2xl mx-auto">
        <div className="flex justify-center gap-2 mb-4">
             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                props.type === 'Update' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            }`}>
                {props.type}
            </span>
            {props.marketImpact === 'High' && (
                <span className="animate-pulse bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Market Alert
                </span>
            )}
        </div>
        <h1 className="font-bold text-4xl text-gray-900 dark:text-white mb-6">
          {props.title}
        </h1>
        <div className="text-gray-400 font-mono text-sm">
          {format(new Date(props.date), 'LLLL d, yyyy')}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Content>
            <MDXRemote {...props.content} components={components} />
        </Content>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 max-w-3xl mx-auto text-center">
        <p className="text-gray-400 text-sm mb-4">You are reading a cached version of the Steam Counter-Strike news feed.</p>
        <a href="https://counter-strike.net/news" target="_blank" className="text-secondary font-bold hover:underline">
            View Official Source
        </a>
      </div>
    </Main>
  );
};

export const getStaticPaths: GetStaticPaths<IPostUrl> = async () => {
  const posts = getAllPosts(['slug'], '_cs-news');

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
  const post = getPostBySlug(params!.slug, [
    'title',
    'date',
    'type',
    'marketImpact',
    'content',
  ], '_cs-news');

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
        title: post.title,
        description: `Official CS2 News: ${post.title}`,
        date: post.date,
        type: post.type || 'News',
        marketImpact: post.marketImpact || 'Low',
        content,
    },
    revalidate: 60,
  };
};

export default CSNewsPost;
