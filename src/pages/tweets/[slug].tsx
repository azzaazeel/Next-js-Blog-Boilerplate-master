import React, { useEffect, useState, useRef, ReactElement } from 'react';

import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useRouter } from 'next/router';
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

type IPostData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  modified_date: string;
  image: string;
  content: MDXRemoteSerializeResult;
  nextSlug?: string | null;
};

type IPostProps = IPostData;

const TweetItem = (props: IPostData) => {
  useBlogCharts([props.content.compiledSource]);

  return (
    <div className="tweet-item mb-20 border-b border-gray-100 pb-20 last:border-0" data-slug={props.slug}>
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
    </div>
  );
};

const DisplayPost = (props: IPostProps) => {
  const router = useRouter();
  const [posts, setPosts] = useState<IPostData[]>([props]);
  const [nextSlug, setNextSlug] = useState<string | null>(props.nextSlug || null);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && nextSlug && !loading) {
          setLoading(true);
          try {
            const res = await fetch(`/api/tweets/${nextSlug}`);
            const data = await res.json();
            if (data.title) {
              setPosts((prev) => [...prev, data]);
              setNextSlug(data.nextSlug);
            }
          } catch (error) {
            console.error('Error loading next tweet:', error);
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [nextSlug, loading]);

  // Update URL on scroll
  useEffect(() => {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute('data-slug');
            if (slug && slug !== router.query.slug) {
              window.history.replaceState(null, '', `/tweets/${slug}`);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const items = document.querySelectorAll('.tweet-item');
    items.forEach((item) => scrollObserver.observe(item));

    return () => scrollObserver.disconnect();
  }, [posts, router.query.slug]);

  return (
    <div className="infinite-tweets-container">
      {posts.map((post) => (
        <TweetItem key={post.slug} {...post} />
      ))}
      
      <div ref={observerTarget} className="h-10 w-full flex justify-center items-center">
        {loading && (
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
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
  const posts = getAllPosts(['slug'], '_tweets');

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
  const allPosts = getAllPosts(['slug'], '_tweets');
  const currentIndex = allPosts.findIndex((p) => p.slug === params!.slug);
  const nextPost = allPosts[currentIndex + 1] || null;

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
    '_tweets'
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
      slug: post.slug,
      title: post.title || '',
      description: post.description || '',
      date: post.date || new Date().toISOString(),
      modified_date: post.modified_date || post.date || new Date().toISOString(),
      image: post.image || '',
      content,
      nextSlug: nextPost ? nextPost.slug : null,
    },
    revalidate: 10,
  };
};

export default DisplayPost;

