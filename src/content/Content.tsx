import React, { ReactNode } from 'react';

type IContentProps = {
  children: ReactNode;
};

const Content = (props: IContentProps) => (
  <div className="content">
    {props.children}

    <style jsx>
      {`
        .content :global(*) {
          @apply break-words;
        }

        .content :global(p) {
          margin-top: 2.25rem;
          margin-bottom: 2.25rem;
          line-height: 1.8;
          word-break: break-word;
        }

        .content :global(ul) {
          margin-top: 2.25rem;
          margin-bottom: 2.25rem;
          padding-left: 1.5rem;
          list-style-type: disc;
        }

        .content :global(ol) {
          margin-top: 2.25rem;
          margin-bottom: 2.25rem;
          padding-left: 1.5rem;
          list-style-type: decimal;
        }

        .content :global(li) {
          margin-bottom: 0.75rem;
        }

        .content :global(h1) {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .content :global(h2) {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .content :global(h3) {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.2;
        }

        .content :global(blockquote) {
          border-left: 4px solid #45AAF2;
          padding-left: 1rem;
          font-style: italic;
          margin-top: 2.25rem;
          margin-bottom: 2.25rem;
          color: #4a5568;
        }
      `}
    </style>
  </div>
);

export { Content };
