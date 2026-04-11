import React from 'react';

type IYouTubeProps = {
  id: string;
};

const YouTube = ({ id }: IYouTubeProps) => {
  return (
    <div className="relative w-full aspect-video my-8 rounded-2xl overflow-hidden shadow-2xl bg-black group">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      
      {/* Premium border overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"></div>
    </div>
  );
};

export default YouTube;
