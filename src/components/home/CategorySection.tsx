import { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronRight, Download, Trash2 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorksStore } from '../../stores/worksStore';
import { categories, CategoryType, type Work } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

interface PositionedWork extends Work {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ActiveMenu {
  workId: string;
  rect: DOMRect;
}

interface CategorySectionProps {
  maxVisible?: number;
  showViewMore?: boolean;
}

export default function CategorySection({ maxVisible = 6, showViewMore = true }: CategorySectionProps) {
  const { mode } = useThemeStore();
  const { getWorksByCategory } = useWorksStore();

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category, catIndex) => {
          const works = getWorksByCategory(category.id);
          const displayWorks = works.slice(0, maxVisible);
          const totalWorks = works.length;
          const categoryColor = category.color;

          return (
            <div
              key={category.id}
              className="mb-16 last:mb-0"
            >
              <div className="flex items-center justify-between mb-6">
                <a
                  href={`/category/${category.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <h2 className={`text-xl sm:text-2xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.nameZh}
                  </h2>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    mode === 'dark' ? 'bg-white/10 text-white/60' : 'bg-black/10 text-gray-600'
                  }`}>
                    {totalWorks}
                  </span>
                </a>

                {showViewMore && totalWorks > maxVisible && (
                  <a
                    href={`/category/${category.id}`}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      mode === 'dark'
                        ? 'text-white/60 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    查看全部
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>

              <CategoryMasonry works={displayWorks} color={categoryColor} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CategoryMasonry({ works, color }: { works: Work[]; color: string }) {
  const { mode } = useThemeStore();
  const { removeWork } = useWorksStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [columns, setColumns] = useState(5);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<Work | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const autoHideTimer = useRef<NodeJS.Timeout | null>(null);
  const gap = 16;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        if (width < 640) {
          setColumns(2);
        } else if (width < 768) {
          setColumns(3);
        } else if (width < 1024) {
          setColumns(4);
        } else {
          setColumns(5);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenu) {
        setActiveMenu(null);
        if (autoHideTimer.current) {
          clearTimeout(autoHideTimer.current);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  useEffect(() => {
    if (!activeMenu) return;

    const handleScroll = () => {
      setActiveMenu(null);
      if (autoHideTimer.current) {
        clearTimeout(autoHideTimer.current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeMenu]);

  const startLongPress = (work: Work, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).closest('.rounded-xl')?.getBoundingClientRect();
    if (!rect) return;

    longPressTimer.current = setTimeout(() => {
      setActiveMenu({ workId: work.id, rect });
      autoHideTimer.current = setTimeout(() => {
        setActiveMenu(null);
      }, 3000);
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDownload = (work: Work) => {
    const link = document.createElement('a');
    link.href = work.thumbnail;
    link.download = `${work.title}.jpg`;
    link.click();
    setActiveMenu(null);
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
    }
  };

  const handleDelete = (work: Work) => {
    setWorkToDelete(work);
    setConfirmDeleteOpen(true);
    setActiveMenu(null);
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
    }
  };

  const confirmDelete = () => {
    if (workToDelete) {
      removeWork(workToDelete.id);
    }
    setConfirmDeleteOpen(false);
    setWorkToDelete(null);
  };

  const positionedWorks = useMemo(() => {
    if (containerWidth === 0 || works.length === 0) return [];

    const actualColumnWidth = (containerWidth - gap * (columns - 1)) / columns;
    const heights = new Array(columns).fill(0);
    const result: PositionedWork[] = [];

    works.forEach((work) => {
      const shortestColumn = heights.indexOf(Math.min(...heights));
      // 主页使用固定尺寸：所有卡片高度相同
      const imgHeight = actualColumnWidth + 60;

      const positionedWork: PositionedWork = {
        ...work,
        x: shortestColumn * (actualColumnWidth + gap),
        y: heights[shortestColumn],
        width: actualColumnWidth,
        height: imgHeight,
      };

      result.push(positionedWork);
      heights[shortestColumn] += imgHeight + gap;
    });

    return result;
  }, [works, containerWidth, columns, gap]);

  const totalHeight = useMemo(() => {
    if (positionedWorks.length === 0) return 0;
    return Math.max(...positionedWorks.map((w) => w.y + w.height));
  }, [positionedWorks]);

  if (works.length === 0) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="w-full relative"
        style={{ height: `${totalHeight}px` }}
      >
        {positionedWorks.map((work) => (
          <div
            key={work.id}
            className={`absolute rounded-xl overflow-hidden transition-all duration-300 group ${
              mode === 'dark'
                ? 'bg-[#14141f]'
                : 'bg-gray-100'
            }`}
            style={{
              left: `${work.x}px`,
              top: `${work.y}px`,
              width: `${work.width}px`,
              height: `${work.height}px`,
            }}
            onMouseDown={(e) => startLongPress(work, e)}
            onMouseUp={endLongPress}
            onMouseLeave={endLongPress}
            onTouchStart={(e) => startLongPress(work, e)}
            onTouchEnd={endLongPress}
          >
            <a
              href={`/work/${work.category}/${work.id}`}
              className="w-full h-full block"
              onClick={(e) => {
                if (longPressTimer.current) {
                  endLongPress();
                }
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src={work.thumbnail}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to top, ${color}40, transparent 60%)` }}
                />
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-sm font-medium text-white truncate">
                    {work.title}
                  </h3>
                </div>
              </div>
            </a>
          </div>
        ))}

        {activeMenu && (() => {
          const work = works.find(w => w.id === activeMenu.workId);
          if (!work) return null;

          const cardX = activeMenu.rect.left;
          const cardY = activeMenu.rect.top;
          const cardWidth = activeMenu.rect.width;
          const cardHeight = activeMenu.rect.height;

          return (
            <div
              className={`fixed z-50 rounded-full shadow-2xl flex items-center justify-center gap-3 px-4 py-3 animate-in zoom-in-95 duration-200 ${
                mode === 'dark'
                  ? 'bg-[#14141f] border border-white/10'
                  : 'bg-white border border-black/10'
              }`}
              style={{
                left: `${cardX + cardWidth / 2}px`,
                top: `${cardY + cardHeight / 2}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleDownload(work)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                  mode === 'dark'
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-900 hover:bg-black/10'
                }`}
              >
                <Download size={20} />
              </button>
              <div className={`w-px h-6 ${mode === 'dark' ? 'bg-white/20' : 'bg-black/20'}`} />
              <button
                onClick={() => handleDelete(work)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-transform hover:scale-110"
              >
                <Trash2 size={20} />
              </button>
            </div>
          );
        })()}
      </div>

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="确认删除"
        message="确定要删除这个作品吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        type="danger"
        icon="delete"
      />
    </>
  );
}
