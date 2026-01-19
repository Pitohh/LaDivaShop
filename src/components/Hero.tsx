import React from 'react';

const Hero = () => {
    return (
        <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10"></div> {/* Overlay for readability */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?q=80&w=2576&auto=format&fit=crop"
                >
                    {/* Placeholder video - Replace with actual 4K optimized asset */}
                    <source
                        src="https://videos.pexels.com/video-files/3756003/3756003-uhd_2560_1440_25fps.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto animate-fade-in">
                <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-lg">
                    <span className="block text-diva-gold mb-4 text-2xl md:text-3xl tracking-widest uppercase font-sans font-light">
                        Bienvenue chez
                    </span>
                    La Diva Shop
                </h1>
                <p className="font-sans text-xl md:text-2xl text-rose-pale mb-10 font-light tracking-wide">
                    L'Élégance Capillaire à Libreville
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <a
                        href="#catalog"
                        className="px-8 py-4 bg-diva-pink text-white font-playfair text-lg rounded-full shadow-2xl hover:bg-pink-700 transition-all transform hover:scale-105"
                    >
                        Découvrir la Collection
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 bg-transparent border-2 border-diva-gold text-diva-gold font-playfair text-lg rounded-full hover:bg-diva-gold hover:text-white transition-all"
                    >
                        Prendre Rendez-vous
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-white/70">
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Hero;
