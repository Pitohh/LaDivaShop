import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface BundlesProps {
  imageUrl: string;
}

export function Bundles({ imageUrl }: BundlesProps) {
  return (
    <section className="w-full bg-[#F9FAFB] py-10 sm:py-12 md:py-14 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <div className="aspect-square rounded-sm overflow-hidden max-w-lg mx-auto md:max-w-none">
              <ImageWithFallback
                src={imageUrl}
                alt="Bundle La Diva"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content - Style Kylie */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#D63384] mb-3 sm:mb-4 lg:mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Le Look Diva
            </h2>
            <p
              className="text-[#D63384]/70 mb-6 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg lg:text-xl"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              L'ensemble complet pour une installation parfaite
            </p>

            {/* Bundle Items */}
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <div
                className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start text-sm sm:text-base lg:text-lg"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <div className="w-2 h-2 bg-[#064E3B] rounded-full flex-shrink-0"></div>
                <span className="text-[#D63384]">Perruque Premium HD Lace</span>
              </div>
              <div
                className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start text-sm sm:text-base lg:text-lg"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <div className="w-2 h-2 bg-[#064E3B] rounded-full flex-shrink-0"></div>
                <span className="text-[#D63384]">Colle Ultra-Hold</span>
              </div>
              <div
                className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start text-sm sm:text-base lg:text-lg"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <div className="w-2 h-2 bg-[#064E3B] rounded-full flex-shrink-0"></div>
                <span className="text-[#D63384]">Spray Fixateur Longue Durée</span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start mb-3 sm:mb-4">
                <span
                  className="text-gray-400 line-through text-base sm:text-lg lg:text-xl"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  85.000 FCFA
                </span>
                <span
                  className="text-[#064E3B] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  65.000 FCFA
                </span>
              </div>
              <p
                className="text-[#D63384]/60 text-xs sm:text-sm lg:text-base"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Économisez 20.000 FCFA
              </p>
            </div>

            <button
              className="bg-[#064E3B] text-white px-6 sm:px-8 md:px-10 lg:px-12 py-3 md:py-4 hover:bg-[#064E3B]/90 transition-colors rounded-sm w-full md:w-auto text-sm sm:text-base lg:text-lg font-medium min-w-[220px]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              ACHETER LE BUNDLE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
