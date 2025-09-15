import Image from 'next/image';
import Star from './Star';

export default function HeroMascot() {
  return (
    <div className="relative flex flex-col items-center py-12">
      {/* Stars positioned around mascot */}
      <Star className="absolute top-4 left-8 w-4 h-4 text-yellow-300 animate-twinkle" style={{ animationDelay: '0s' }} />
      <Star className="absolute top-16 right-12 w-3 h-3 text-yellow-200 animate-twinkle" style={{ animationDelay: '0.5s' }} />
      <Star className="absolute bottom-20 left-16 w-5 h-5 text-yellow-400 animate-twinkle" style={{ animationDelay: '1s' }} />
      <Star className="absolute bottom-8 right-8 w-4 h-4 text-yellow-300 animate-twinkle" style={{ animationDelay: '1.5s' }} />
      
      {/* Mascot with float animation */}
      <div className="animate-float">
        <Image
          src="/4x.png"
          alt="TEAMITAKA 캐릭터"
          width={200}
          height={200}
          className="w-48 h-48 sm:w-56 sm:h-56"
          priority
        />
      </div>
      
      {/* Soft orange shadow ellipse - Safari safe positioning */}
      <div 
        className="mx-auto h-3 w-48 rounded-full bg-[var(--brand)]/30 blur-md -mt-4 relative z-0" 
        aria-hidden="true"
        style={{
          marginTop: '-1rem',
          maxWidth: '12rem'
        }}
      />
    </div>
  );
}