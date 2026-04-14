import React from 'react';

import { GetStaticProps } from 'next';

import { NewsCard } from '../components/NewsCard';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { getAllPosts } from '../utils/Content';

export type ICSNewsProps = {
  news: any[];
};

import { ReactElement } from 'react';

const CSNewsPage = ({ news }: ICSNewsProps) => (
  <>
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">CS2 News Feed</h1>
      <p className="text-gray-500 dark:text-gray-400">Archived official Counter-Strike news with market impact analysis.</p>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {news.length > 0 ? (
        news.map((item: any, idx: number) => (
          <NewsCard key={idx} item={{
            ...item,
            description: item.content
          }} />
        ))
      ) : (
        <div className="p-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <p className="text-gray-500">No news found. Please check back later.</p>
        </div>
      )}
    </div>

    <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Market Impact Analysis</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Our system automatically scans news content for mentions of skins, cases, collections, and stickers to provide early volatility warnings for the Kanocs community.
      </p>
    </div>
  </>
);

CSNewsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main
      meta={
        <Meta 
          title="CS2 News Feed - Kanocs" 
          description="Market updates and official news cached locally from Steam Counter-Strike feed." 
        />
      }
    >
      {page}
    </Main>
  );
};

export const getStaticProps: GetStaticProps<ICSNewsProps> = async () => {
  const news = getAllPosts(
    ['title', 'date', 'type', 'marketImpact', 'link', 'content', 'slug'],
    '_cs-news'
  );

  return {
    props: {
        news: news.map(p => ({
            ...p,
            pubDate: p.date
        })),
    },
    revalidate: 3600,
  };
};

export default CSNewsPage;
