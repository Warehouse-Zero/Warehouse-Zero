import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useWorksStore } from '../stores/worksStore';
import { categories, CategoryType } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MasonryGrid from '../components/common/MasonryGrid';

export default function CategoryPage() {
  const { mode } = useThemeStore();
  const { getWorksByCategory } = useWorksStore();
  const { type } = useParams<{ type: string }>();

  const category = categories.find((c) => c.id === type);
  const works = type ? getWorksByCategory(type as CategoryType) : [];

  if (!category) {
    return (
      <div className={`min-h-screen ${mode === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#f8fafc]'}`}>
        <Navbar />
        <div className="pt-32 text-center">
          <p className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>分类不存在</p>
          <Link to="/" className="text-indigo-500 hover:underline mt-4 inline-block">
            返回首页
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      mode === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#f8fafc]'
    }`}>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 mb-6 transition-colors ${
              mode === 'dark'
                ? 'text-white/60 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={18} />
            返回首页
          </Link>

          <div className="mb-8">
            <MasonryGrid works={works} columnWidth={280} gap={16} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
