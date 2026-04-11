import React from 'react';

import { format } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote';
import Link from 'next/link';

import { EmbedPost } from '../components/EmbedPost';
import { Insight } from '../components/Insight';
import { Content } from '../content/Content';
import { Pagination, IPaginationProps } from '../pagination/Pagination';
import { PostItems } from '../utils/Content';
import { useBlogCharts } from '../utils/useBlogCharts';

const components = { Insight, EmbedPost };

export type IBlogGalleryProps = {
  posts: PostItems[];
  pagination: IPaginationProps;
};

const BlogGallery = (props: IBlogGalleryProps) => {
  useBlogCharts([props.posts]);

  return (
    <>
      <ul>
        {props.posts.map((elt) => (
          <li
            key={elt.slug}
            className="mb-12 flex flex-col items-start border-b border-gray-100 dark:border-gray-800 pb-8"
          >
            <div className="w-full flex justify-between items-baseline mb-4">
              <Link
                href={`/${elt.category || 'articles'}/[slug]`}
                as={`/${elt.category || 'articles'}/${elt.slug}`}
                legacyBehavior
              >
                <a>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {elt.title}
                  </h2>
                </a>
              </Link>
              <div className="hidden md:block text-right text-gray-400 text-sm whitespace-nowrap ml-4">
                {elt.modified_date || elt.date ? (
                  <>
                    Updated{' '}
                    {format(
                      new Date(elt.modified_date || elt.date),
                      'LLL d, yyyy'
                    )}
                  </>
                ) : null}
              </div>
            </div>
            <div className="w-full">
              <Content>
                {elt.content && typeof elt.content === 'object' ? (
                  <MDXRemote
                    {...(elt.content as any)}
                    components={components}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: elt.content || '' }}
                  />
                )}
              </Content>
              {elt.modified_date || elt.date ? (
                <div className="md:hidden mt-4 text-gray-400 text-[11px] font-medium tracking-tight bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded inline-block">
                  Updated{' '}
                  {format(
                    new Date(elt.modified_date || elt.date),
                    'LLL d, yyyy'
                  )}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        previous={props.pagination.previous}
        next={props.pagination.next}
      />
    </>
  );
};

export { BlogGallery };
