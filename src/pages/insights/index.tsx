import React, { useState, useMemo, ReactElement } from 'react';
import { GetStaticProps } from 'next';

import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { getAllPosts } from '../../utils/Content';
import { InsightCard } from '../../components/InsightCard';

type IInsightsPageProps = {
  insights: any[];
};

const InsightsPage = (props: IInsightsPageProps) => {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique years from insights
  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    props.insights.forEach(item => {
      const parts = item.date.split(' ');
      const year = parts[parts.length - 1]; // Supporting formats like "April 13, 2026" or "13 April 2026"
      if (year && /^\d{4}$/.test(year)) {
        uniqueYears.add(year);
      }
    });
    return ['All', ...Array.from(uniqueYears).sort((a, b) => b.localeCompare(a))];
  }, [props.insights]);

  // Filter insights by selected year
  const filteredInsights = useMemo(() => {
    setCurrentPage(1); // Reset page on filter change
    if (selectedYear === 'All') return props.insights;
    return props.insights.filter(item => item.date.includes(selectedYear));
  }, [props.insights, selectedYear]);

  // Paginate insights
  const totalPages = Math.ceil(filteredInsights.length / itemsPerPage);
  const paginatedInsights = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInsights.slice(start, start + itemsPerPage);
  }, [filteredInsights, currentPage]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold text-secondary mb-2">
          Insights
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Data-driven market intelligence, trend analysis, and professional investment breakdowns.
        </p>

        {/* Year Filter */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
                selectedYear === year
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {paginatedInsights.map((post) => (
          <InsightCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-12">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, i, arr) => (
                <React.Fragment key={p}>
                  {i > 0 && arr[i-1] !== p - 1 && <span className="px-2 text-gray-400">...</span>}
                  <button
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-[40px] h-10 rounded-xl font-bold transition-all duration-200 ${
                      currentPage === p
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}

      {filteredInsights.length === 0 && (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-gray-500">No insights found for {selectedYear}.</p>
        </div>
      )}
    </>
  );
};

InsightsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main
      meta={
        <Meta title="Insights" description="Market insights and data analysis" />
      }
    >
      {page}
    </Main>
  );
};

export const getStaticProps: GetStaticProps<IInsightsPageProps> = async () => {
  const insights = getAllPosts(
    [
      'title',
      'date',
      'modified_date',
      'image',
      'slug',
      'description',
      'category',
    ],
    '_insights'
  )
    .map((p) => ({ ...p, category: p.category || 'insights' }))
    .sort((a: any, b: any) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

  return { props: { insights }, revalidate: 60 };
};

export default InsightsPage;
