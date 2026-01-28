import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface HeroSectionProps {
  imageUrl: string;
  onNavigate?: (page: string) => void;
}

export function HeroSection({ imageUrl, onNavigate }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={imageUrl}
          alt="Glamorous woman"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Botanical Accent - Top Right Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 opacity-20 sm:opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#D63384]">
          <path
            d="M50,10 Q60,30 70,40 Q80,50 90,60 L85,65 Q75,55 65,45 Q55,35 50,20 Q45,35 35,45 Q25,55 15,65 L10,60 Q20,50 30,40 Q40,30 50,10"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 z-10">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-3 sm:mb-4 md:mb-6 max-w-4xl leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Révélez votre Éclat
        </h1>
        <p
          className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-6 md:mb-8 max-w-xs sm:max-w-lg lg:max-w-2xl"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Perruques & Mèches Premium pour la Femme Moderne
        </p>
        <button
          onClick={() => onNavigate?.('catalog')}
          className="bg-[#064E3B] text-white px-6 sm:px-8 md:px-10 lg:px-12 py-3 md:py-4 hover:bg-[#064E3B]/90 transition-colors rounded-sm text-sm sm:text-base lg:text-lg font-medium min-w-[200px] sm:min-w-[240px]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          COMMANDER MAINTENANT
        </button>
      </div>
    </section>
  );
}
