'use client';

import Image from 'next/image';
import { useState } from 'react';
import { safePublicSrc } from '@/lib/imagePath';

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

  const handleFlip = () => {
    setFace(isFront ? 'back' : 'front');
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        aria-pressed={!isFront}
        onClick={handleFlip}
        className="group relative w-full aspect-[5/7] cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
      >
        <div
          className={`relative h-full w-full rounded-xl shadow-md transition-transform duration-500 [transform-style:preserve-3d] ${
            isFront ? '' : '[transform:rotateY(180deg)]'
          }`}
        >
          {/* 앞면 */}
          <div className="absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] z-10">
            <Image
              src={safePublicSrc(front)}
              alt={`${name} 앞면`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              className="object-cover"
              priority={true}
            />
          </div>
          
          {/* 뒷면 */}
          <div className="absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Image
              src={safePublicSrc(back)}
              alt={`${name} 뒷면`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              className="object-cover"
            />
          </div>
        </div>
      </button>
      
      {/* 카드 이름 */}
      <span className="mt-2 block text-center text-sm text-neutral-800 dark:text-neutral-200 font-medium">
        {name}
      </span>
    </div>
  );
}
