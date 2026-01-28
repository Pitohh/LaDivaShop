import { Truck, CreditCard, MessageCircle, Award } from 'lucide-react';

export function Reassurance() {
  const features = [
    {
      icon: Truck,
      title: 'Livraison Express',
      description: 'Libreville & Port-Gentil',
    },
    {
      icon: CreditCard,
      title: 'Paiement Flexible',
      description: 'À la livraison ou Mobile',
    },
    {
      icon: MessageCircle,
      title: 'Service Client',
      description: 'WhatsApp 24/7',
    },
    {
      icon: Award,
      title: 'Qualité Premium',
      description: '100% Cheveux Naturels',
    },
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-12 md:py-14 lg:py-16 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-[#D63384]/5 rounded-full mb-2 sm:mb-3 md:mb-4">
                  <Icon className="text-[#D63384] w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </div>
                <h3
                  className="text-[#D63384] mb-1 text-xs sm:text-sm md:text-base lg:text-lg font-medium"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-[#D63384]/60 text-xs sm:text-sm md:text-base"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
