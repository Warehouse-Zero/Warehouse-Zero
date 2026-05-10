import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
  const { mode } = useThemeStore();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const positionStart = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoom(0.25);
      if (e.key === '-') handleZoom(-0.25);
      if (e.key === '0') handleReset();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isOpen, onClose]);

  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleZoom = useCallback((delta: number) => {
    setScale(prev => {
      const newScale = Math.max(0.5, Math.min(3, prev + delta));
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta);
  };

  const clampPosition = useCallback((x: number, y: number, currentScale: number) => {
    if (!imgRef.current) return { x: 0, y: 0 };
    
    const maxX = imgRef.current.offsetWidth * (currentScale - 1) / 2;
    const maxY = imgRef.current.offsetHeight * (currentScale - 1) / 2;
    
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y))
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistanceRef.current = getDistance(e.touches);
      initialScaleRef.current = scale;
      setIsDragging(false);
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      positionStart.current = { ...position };
    }
    setShowControls(false);
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2 && initialDistanceRef.current) {
      const currentDistance = getDistance(e.touches);
      const scaleFactor = currentDistance / initialDistanceRef.current;
      const newScale = Math.max(0.5, Math.min(3, initialScaleRef.current * scaleFactor));
      
      if (newScale !== scale) {
        setScale(newScale);
        if (newScale <= 1) {
          setPosition({ x: 0, y: 0 });
        }
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const deltaX = e.touches[0].clientX - dragStart.current.x;
        const deltaY = e.touches[0].clientY - dragStart.current.y;
        
        const newX = positionStart.current.x + deltaX;
        const newY = positionStart.current.y + deltaY;
        
        const clamped = clampPosition(newX, newY, scale);
        setPosition(clamped);
      });
    }
  }, [isDragging, scale, clampPosition]);

  const handleTouchEnd = () => {
    initialDistanceRef.current = null;
    setIsDragging(false);
    setShowControls(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      positionStart.current = { ...position };
      setShowControls(false);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;
        
        const newX = positionStart.current.x + deltaX;
        const newY = positionStart.current.y + deltaY;
        
        const clamped = clampPosition(newX, newY, scale);
        setPosition(clamped);
      });
    }
  }, [isDragging, scale, clampPosition]);

  const handleMouseUp = () => {
    setIsDragging(false);
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setShowControls(true);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
      style={{ touchAction: 'none' }}
    >
      {showControls && (
        <>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={() => handleZoom(0.25)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => handleZoom(-0.25)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <RotateCcw size={20} />
            </button>
            <span className="flex items-center px-3 text-white/50 text-sm">
              {Math.round(scale * 100)}%
            </span>
          </div>
        </>
      )}

      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          draggable={false}
        />
      </div>

      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white/60 text-xs transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {scale === 1 ? '双指缩放 · 滚轮缩放' : '单指平移 · 双指缩放 · 滚轮缩放'}
      </div>
    </div>
  );
}
