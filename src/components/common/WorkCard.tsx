import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorksStore } from '../../stores/worksStore';
import type { Work } from '../../types';

interface WorkCardProps {
  work: Work;
}

export default function WorkCard({ work }: WorkCardProps) {
  const { mode } = useThemeStore();
  const { removeWork } = useWorksStore();
  const [showActions, setShowActions] = useState(false);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const clearAllTimers = useCallback(() => {
    if (touchTimer) clearTimeout(touchTimer);
    if (autoHideTimer) clearTimeout(autoHideTimer);
    setTouchTimer(null);
    setAutoHideTimer(null);
  }, [touchTimer, autoHideTimer]);

  const handleShowActions = useCallback(() => {
    clearAllTimers();
    setShowActions(true);
    const timer = setTimeout(() => {
      setShowActions(false);
    }, 3000);
    setAutoHideTimer(timer);
  }, [clearAllTimers]);

  const handleHideActions = useCallback(() => {
    clearAllTimers();
    setShowActions(false);
  }, [clearAllTimers]);

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      handleShowActions();
    }, 500);
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const timer = setTimeout(() => {
      handleShowActions();
    }, 500);
    setTouchTimer(timer);
  };

  const handleMouseUp = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  const handleMouseLeave = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showActions && cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleHideActions();
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions, handleHideActions]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = work.url || work.thumbnail;
    link.download = `${work.title}.${work.url?.split('.').pop() || 'jpg'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleHideActions();
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个作品吗？')) {
      removeWork(work.id);
    }
    handleHideActions();
  };

  return (
    <div
      ref={cardRef}
      className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        mode === 'dark'
          ? 'bg-white/5 hover:bg-white/10'
          : 'bg-black/5 hover:bg-black/10'
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <a href={`/work/${work.category}/${work.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={work.thumbnail}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className={`text-sm font-medium truncate ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {work.title}
          </h3>
          <p className={`text-xs mt-1 ${
            mode === 'dark' ? 'text-white/50' : 'text-gray-500'
          }`}>
            {work.createdAt}
          </p>
        </div>
      </a>

      {showActions && (
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 ${
            mode === 'dark' ? 'bg-black/80' : 'bg-white/90'
          } backdrop-blur-sm rounded-xl z-10`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDownload}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors shadow-lg"
            title="下载"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors shadow-lg"
            title="删除"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
