import React, { useState } from 'react';

const Carousel = ({ children }: { children: React.ReactNode }) => {
  const images: React.ReactNode[] = [];
  
  React.Children.forEach(children, (child: any) => {
    if (!child) return;
    
    // Direct image
    if (child.type === 'img' || child.props?.mdxType === 'img') {
      images.push(child);
    } 
    // Image wrapped in a paragraph (common in MDX)
    else if (child.type === 'p' && child.props?.children) {
      React.Children.forEach(child.props.children, (innerChild: any) => {
        if (innerChild?.type === 'img' || innerChild?.props?.mdxType === 'img') {
          images.push(innerChild);
        }
      });
    }
  });

  // If there's only one or no images, just render normally
  if (images.length <= 1) {
    return <div className="flex flex-wrap gap-2 justify-center">{children}</div>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative group my-8 bg-gray-50 dark:bg-gray-900/30 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl mx-auto max-w-2xl">
      <div className="relative aspect-video flex items-center justify-center bg-black/5">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center p-4 ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {img}
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-4 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-3 px-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        <div className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
