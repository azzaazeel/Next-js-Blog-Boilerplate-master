import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

import { Main } from '../../templates/Main';
import { Meta } from '../../layout/Meta';
import { Content } from '../../content/Content';
import { getPatchBySlug, getAllPatches, PatchItem } from '../../utils/PatchContent';
import { Insight } from '../../components/Insight';
import { EmbedPost } from '../../components/EmbedPost';
import Carousel from '../../components/Carousel';
import YouTube from '../../components/YouTube';
import Callout from '../../components/Callout';
import { useBlogCharts } from '../../utils/useBlogCharts';



type IPatchUrl = {
  slug: string;
};

type IPatchProps = {
  patch: PatchItem;
  mdxContent: MDXRemoteSerializeResult;
};

const PatchPost = (props: IPatchProps) => {
  useBlogCharts([props.mdxContent.compiledSource]);

  // Ensure components are locally available and properly mapped
  const mdxComponents = { 
    Insight, 
    EmbedPost, 
    Carousel,
    YouTube,
    Callout,
    carousel: Carousel,
    youtube: YouTube,
    callout: Callout
  };

  return (
    <Main
      meta={
        <Meta
          title={props.patch.title}
          description={`Patch notes for Counter-Strike 2 - Build ${props.patch.buildId}`}
        />
      }
    >
      <div className="pt-10 pb-12 mb-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Game Update
          </span>
          <span className="text-gray-400 font-medium text-sm">
            Build {props.patch.buildId}
          </span>
        </div>
        <h1 className="text-5xl font-extrabold text-secondary mb-6 leading-tight">
          {props.patch.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {props.patch.date}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {props.patch.time}
          </div>
        </div>
      </div>

      <Content>
        <MDXRemote {...props.mdxContent} components={mdxComponents} />
      </Content>
      
      <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
        <a 
           href="/patches"
           className="text-primary hover:underline font-bold text-lg inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all patches
        </a>
      </div>
    </Main>
  );
};

export const getStaticPaths: GetStaticPaths<IPatchUrl> = async () => {
  const patches = getAllPatches();

  return {
    paths: patches.map((patch) => ({
      params: {
        slug: patch.slug,
      },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IPatchProps, IPatchUrl> = async ({
  params,
}) => {
  const patch = getPatchBySlug(params!.slug);

  if (!patch) {
    return {
      notFound: true,
    };
  }

  // Pre-process markdown to wrap consecutive images in <Carousel>
  const carouselRegex = /((?:!\[.*?\]\(.*?\)\s*){2,})/g;
  let processedContent = patch.content.replace(carouselRegex, (match) => {
    return `\n<Carousel>\n\n${match.trim()}\n\n</Carousel>\n`;
  });

  // Pre-process to convert standalone YouTube links to <YouTube /> component
  const youtubeRegex = /^\s*https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})\s*$/gm;
  processedContent = processedContent.replace(youtubeRegex, (_, id) => {
    return `\n<YouTube id="${id}" />\n`;
  });

  const mdxContent = await serialize(processedContent || '', {
    mdxOptions: {
      remarkPlugins: [remarkGfm as any],
    },
  });

  return {
    props: {
      patch,
      mdxContent,
    },
    revalidate: 60,
  };
};

export default PatchPost;
