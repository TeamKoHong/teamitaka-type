'use client';

import Image from 'next/image';

export default function HeroMascot() {
  return (
    <div className="relative flex flex-col items-center py-12">
      {/* Static mascot image */}
      <img
        src="/assets/main/character.png"
        alt="TEAMITAKA 캐릭터"
        style={{ 
          width: '287px', 
          height: '330px',
          objectFit: 'contain'
        }}
      />
      
      {/* Soft orange shadow ellipse */}
      <div 
        className="mx-auto h-3 w-48 rounded-full blur-md -mt-4 relative" 
        aria-hidden="true"
        style={{
          marginTop: '-1rem',
          maxWidth: '12rem',
          zIndex: -2,
          position: 'relative',
          backgroundColor: 'rgba(247, 98, 65, 0.3)'
        }}
      />
    </div>
  );
}