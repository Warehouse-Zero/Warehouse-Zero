import { useThemeStore } from '../stores/themeStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroCarousel from '../components/home/HeroCarousel';
import CategorySection from '../components/home/CategorySection';

export default function HomePage() {
  const { mode } = useThemeStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      mode === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#f8fafc]'
    }`}>
      <Navbar />
      <main className="pt-16">
        <HeroCarousel />
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
}
