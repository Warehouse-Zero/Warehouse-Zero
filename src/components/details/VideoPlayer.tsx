import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const { mode } = useThemeStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showFullControls, setShowFullControls] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setKey(prev => prev + 1);
    setIsPlaying(false);
    setShowPlayButton(true);
    setShowFullControls(false);
  }, [src]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || 
                     !!(document as any).webkitFullscreenElement || 
                     !!(document as any).mozFullScreenElement || 
                     !!(document as any).msFullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
      setShowFullControls(false);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
    };
    const handlePause = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [key]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  const showControls = useCallback(() => {
    setShowFullControls(true);
    resetHideTimer();
  }, []);

  const resetHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowFullControls(false);
    }, 3000);
  }, []);

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 300 && timeDiff > 0) {
      toggleFullscreen();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      togglePlay();
    }
  }, [togglePlay]);

  const handleVideoTouch = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 300 && timeDiff > 0) {
      toggleFullscreen();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      togglePlay();
    }
  }, [togglePlay]);
  
  const handleVideoTouchStart = useCallback(() => {
    showControls();
  }, [showControls]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
    }
  }, [duration]);

  const handleProgressTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current && e.touches.length > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.touches[0].clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
    }
  }, [duration]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    setIsMuted(value === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleRateChange = useCallback(() => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  }, [playbackRate]);

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  }, [currentTime, duration]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container && !video) return;

    // 先检查是否已有全屏元素
    const fullscreenElement = document.fullscreenElement || 
                            (document as any).webkitFullscreenElement || 
                            (document as any).mozFullScreenElement || 
                            (document as any).msFullscreenElement;

    if (fullscreenElement) {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } else {
      // 尝试进入全屏 - 优先使用视频元素在手机端更兼容
      const element = video || container;
      if (element!.requestFullscreen) {
        element!.requestFullscreen().catch(err => {
          console.error('全屏请求失败:', err);
        });
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).webkitEnterFullscreen && video) {
        // iOS Safari 特有方法
        (video as any).webkitEnterFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    }
  }, []);

  const formatTime = useCallback((time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div
      ref={containerRef}
      key={key}
      className="relative rounded-xl overflow-hidden bg-black"
      onMouseMove={showControls}
      onMouseLeave={() => setShowFullControls(false)}
      onTouchStart={handleVideoTouchStart}
    >
      <div
        className="w-full aspect-video"
        onClick={handleVideoClick}
        onTouchEnd={handleVideoTouch}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-contain"
          playsInline
          preload="metadata"
        />
      </div>

      {showPlayButton && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <button
            className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all hover:scale-110"
          >
            <Play size={32} />
          </button>
        </div>
      )}

      {showFullControls && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-3 px-3 sm:px-4 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={progressRef}
            className="relative h-1.5 sm:h-1 bg-white/30 rounded-full cursor-pointer mb-3 sm:mb-4 group touch-none"
            onClick={handleProgressClick}
            onTouchStart={handleProgressTouch}
          >
            <div
              className="absolute h-full bg-orange-500 rounded-full"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            <div
              className="absolute w-4 h-4 sm:w-3 sm:h-3 bg-orange-500 rounded-full -top-1.5 sm:-top-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 8px)` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }} 
                className="text-white hover:text-orange-400 transition-colors p-1"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  skip(-10);
                }} 
                className="text-white hover:text-orange-400 transition-colors p-1 hidden sm:block"
              >
                <SkipBack size={18} />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  skip(10);
                }} 
                className="text-white hover:text-orange-400 transition-colors p-1 hidden sm:block"
              >
                <SkipForward size={18} />
              </button>

              <span className="text-white/70 text-xs sm:text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRateChange();
                }}
                className="px-2 py-1 text-white/70 hover:text-white text-xs font-mono rounded bg-white/10 hover:bg-white/20 transition-colors"
              >
                {playbackRate}x
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="text-white hover:text-orange-400 transition-colors p-1"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
