import { TopBar } from '@/app/components/TopBar';
import { Header } from '@/app/components/Header';
import { HeroSection } from '@/app/components/HeroSection';
import { NewDrops } from '@/app/components/NewDrops';
import { Bundles } from '@/app/components/Bundles';
import { Transformation } from '@/app/components/Transformation';
import { SocialWall } from '@/app/components/SocialWall';
import { Reassurance } from '@/app/components/Reassurance';
import { Footer } from '@/app/components/Footer';
import { BottomNav } from '@/app/components/BottomNav';

// Social Posts - Still using mock data for now
const socialPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1614173515218-835035bcaff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWFuJTIwbG9uZyUyMGhhaXJ8ZW58MXx8fHwxNzY5MDAyNDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1702236240794-58dc4c6895e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBicmFpZHMlMjBoYWlyfGVufDF8fHx8MTc2OTAwMjQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1554458245-cf8d874d708d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWFuJTIwaGFpciUyMHN0eWxpbmd8ZW58MXx8fHwxNzY5MDAyNDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1552324864-b21d0d69d87a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhlZCUyMHJhY2UlMjB3b21hbiUyMGhhaXJ8ZW58MXx8fHwxNzY5MDAyNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Top Bar - Promo */}
      <TopBar />

      {/* Header - Navigation */}
      <Header />

      {/* Hero Section - Immersion */}
      <HeroSection
        imageUrl="https://images.unsplash.com/photo-1508174492734-7cce2629cadc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjBibGFjayUyMHdvbWFuJTIwaGFpcnxlbnwxfHx8fDE3NjkwMDI0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />

      {/* New Drops - Urgence (Style Fenty) - NOW DYNAMIC */}
      <NewDrops />

      {/* Bundles - Cross-Sell (Style Kylie) */}
      <Bundles
        imageUrl="https://images.unsplash.com/photo-1749325096387-56e9c44a0369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWFuJTIwaGFpciUyMHByb2R1Y3RzfGVufDF8fHx8MTc2OTAwMjQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />

      {/* Transformation - Preuve (Style Bellami) */}
      <Transformation
        beforeImage="https://images.unsplash.com/photo-1508418717103-8b56bcf03360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBuYXR1cmFsJTIwaGFpcnxlbnwxfHx8fDE3Njg5OTIwNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        afterImage="https://images.unsplash.com/photo-1723541104653-5e478f84e687?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBoYWlyJTIwdHJhbnNmb3JtYXRpb258ZW58MXx8fHwxNzY5MDAyNDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />

      {/* Social Wall - Preuve Sociale (Style Gisou) */}
      <SocialWall posts={socialPosts} />

      {/* Reassurance - Services */}
      <Reassurance />

      {/* Footer */}
      <Footer />

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
}