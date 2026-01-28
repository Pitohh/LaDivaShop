import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface TransformationProps {
  beforeImage: string;
  afterImage: string;
}

export function Transformation({ beforeImage, afterImage }: TransformationProps) {
  return (
    <section className="w-full bg-white py-10 sm:py-12 md:py-14 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title - Style Bellami */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#D63384] mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            RÉSULTATS RÉELS
          </h2>
          <p
            className="text-[#D63384]/70 text-sm sm:text-base"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            La transformation capillaire La Diva
          </p>
        </div>

        {/* Before/After Split */}
        <div className="grid md:grid-cols-2 gap-0.5 sm:gap-1 max-w-6xl mx-auto">
          {/* Before */}
          <div className="relative aspect-[3/4] overflow-hidden group">
            <ImageWithFallback
              src={beforeImage}
              alt="Before transformation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <span
                className="inline-block bg-white/90 text-[#D63384] px-3 sm:px-4 py-1.5 sm:py-2 text-base sm:text-lg md:text-xl rounded-sm font-medium"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                AVANT
              </span>
            </div>
          </div>

          {/* After */}
          <div className="relative aspect-[3/4] overflow-hidden group">
            <ImageWithFallback
              src={afterImage}
              alt="After transformation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <span
                className="inline-block bg-[#064E3B] text-white px-3 sm:px-4 py-1.5 sm:py-2 text-base sm:text-lg md:text-xl rounded-sm font-medium"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                APRÈS
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12">
          <button
            className="bg-[#D63384] text-white px-6 sm:px-8 md:px-10 lg:px-12 py-3 md:py-4 hover:bg-[#D63384]/90 transition-colors rounded-sm text-sm sm:text-base lg:text-lg font-medium min-w-[220px]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            DÉCOUVRIR NOS MÈCHES
          </button>
        </div>
      </div>
    </section>
  );
}
