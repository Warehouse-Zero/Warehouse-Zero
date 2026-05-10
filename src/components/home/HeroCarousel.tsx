import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorksStore } from '../../stores/worksStore';
import { categories } from '../../types';

export default function HeroCarousel() {
  const { mode } = useThemeStore();
  const { carouselWorks } = useWorksStore();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % carouselWorks.length);
  }, [carouselWorks.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + carouselWorks.length) % carouselWorks.length);
  };

  useEffect(() => {
    if (isPaused || carouselWorks.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next, carouselWorks.length]);

  if (carouselWorks.length === 0) return null;

  const currentWork = carouselWorks[current];

  return (
    <section
      className="relative h-[60vh] min-h-[500px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: 1 }}
      >
        <img
          src={currentWork.thumbnail}
          alt={currentWork.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-2xl">
            <span
              className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4"
              style={{
                backgroundColor: categories.find(c => c.id === currentWork.category)?.color + '20',
                color: categories.find(c => c.id === currentWork.category)?.color,
              }}
            >
              {categories.find(c => c.id === currentWork.category)?.nameZh}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {currentWork.title}
            </h1>
            {currentWork.description && (
              <p className="text-white/70 text-lg max-w-xl line-clamp-2">
                {currentWork.description}
              </p>
            )}
            <a
              href={`/work/${currentWork.category}/${currentWork.id}`}
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all hover:gap-3"
            >
              查看详情
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
        style={{ opacity: 0.6 }}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full transition-all"
        style={{ opacity: 0.6 }}
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselWorks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current
                ? 'w-8 bg-white'
                : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
