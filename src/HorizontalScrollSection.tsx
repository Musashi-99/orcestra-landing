import React from 'react';

export default function HorizontalScrollSection() {
  return (
    <div className="relative w-full bg-black flex justify-center items-center py-20">
      {/* 
        Just an exact static image placed at the specified scroll point (7909px). 
        Please drop your PNG into the public/assets folder and rename it to '01-step.png',
        or update the src attribute below to match your file's name.
      */}
      <img 
        src="/assets/01-step.png" 
        alt="Horizontal Scroll Section Graphic" 
        className="w-full max-w-[1200px] h-auto object-contain mx-auto"
      />
    </div>
  );
}
