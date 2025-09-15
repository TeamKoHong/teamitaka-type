'use client';

import Image from 'next/image';
import { useState } from 'react';
import { safePublicSrc } from '@/lib/imagePath';
import { useBrowserOptimization } from '@/lib/hooks/useBrowserOptimization';

type TimiCardProps = { 
  name: string; 
  front: string; 
  back: string; 
  initialFace?: 'front' | 'back' 
};

export default function TimiCard({ 
  name, 
  front, 
  back, 
  initialFace = 'front' 
}: TimiCardProps) {
  const [face, setFace] = useState<'front' | 'back'>(initialFace);
  const isFront = face === 'front';
  const browserOptimization = useBrowserOptimization();

  const handleFlip = () => {
    setFace(isFront ? 'back' : 'front');
  };

  return (
    <div className="flex flex-col items-center h-full">
      <button
        type="button"
        aria-pressed={!isFront}
        onClick={handleFlip}
        className="group relative w-full h-full cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
      >
        <div
          className={`relative h-full w-full rounded-xl shadow-md transition-transform duration-500 [transform-style:preserve-3d] ${
            isFront ? '' : '[transform:rotateY(180deg)]'
          }`}
        >
          {/* 앞면 */}
          <div className="absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] z-10">
            <img
              src={safePublicSrc(front)}
              alt={`${name} 앞면`}
              className={`w-full h-full object-contain ${browserOptimization.imageClass}`}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                aspectRatio: 'auto'
              }}
            />
          </div>
          
          {/* 뒷면 */}
          <div className="absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <img
              src={safePublicSrc(back)}
              alt={`${name} 뒷면`}
              className={`w-full h-full object-contain ${browserOptimization.imageClass}`}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                aspectRatio: 'auto'
              }}
            />
          </div>
        </div>
      </button>
    </div>
  );
}
