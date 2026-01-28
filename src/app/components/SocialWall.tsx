import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Instagram } from 'lucide-react';

interface SocialPost {
  id: number;
  image: string;
}

interface SocialWallProps {
  posts: SocialPost[];
}

export function SocialWall({ posts }: SocialWallProps) {
  return (
    <section className="w-full bg-[#F9FAFB] py-10 sm:py-12 md:py-14 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title - Style Gisou */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#D63384] mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Get The Look
          </h2>
          <p
            className="text-[#D63384]/70 flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <Instagram size={18} className="sm:w-5 sm:h-5" />
            @ladiva.officiel
          </p>
        </div>

        {/* Instagram Grid - 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square overflow-hidden group cursor-pointer rounded-sm"
            >
              <ImageWithFallback
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#064E3B]/0 group-hover:bg-[#064E3B]/20 transition-colors duration-300 flex items-center justify-center">
                <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#D63384] px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-medium">
                  Shop the look
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
