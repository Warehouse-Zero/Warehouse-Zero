import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Upload, Image, Film, Box, Code, type LucideIcon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorksStore } from '../../stores/worksStore';
import { categories, CategoryType, categoryExtensions, type Work } from '../../types';
import ConfirmModal from './ConfirmModal';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<CategoryType, LucideIcon> = {
  graphic: Image,
  video: Film,
  model: Box,
  development: Code,
};

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { mode } = useThemeStore();
  const { addWork } = useWorksStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detectedCategory, setDetectedCategory] = useState<CategoryType | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [featureConfirmOpen, setFeatureConfirmOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const detectCategory = useCallback((file: File): CategoryType | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    for (const [category, extensions] of Object.entries(categoryExtensions)) {
      if (extensions.includes(ext)) {
        return category as CategoryType;
      }
    }
    return null;
  }, []);

  const handleFile = useCallback((file: File) => {
    setUploadedFile(file);
    const category = detectCategory(file);
    setDetectedCategory(category);

    if (category === 'development') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCodeContent(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [detectCategory]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleUpload = () => {
    if (!uploadedFile || !title || !detectedCategory) return;

    const newWork: Work = {
      id: `work-${Date.now()}`,
      title,
      category: detectedCategory,
      thumbnail: preview || '',
      url: preview || '',
      createdAt: new Date().toISOString().split('T')[0],
      description,
      code: detectedCategory === 'development' ? codeContent : undefined,
      isCarouselFeatured: isFeatured,
    };

    addWork(newWork);
    handleClose();
  };

  const handleClose = () => {
    setUploadedFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setDetectedCategory(null);
    setIsFeatured(false);
    setCodeContent('');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleFeaturedToggle = () => {
    if (isFeatured) {
      setIsFeatured(false);
    } else {
      setFeatureConfirmOpen(true);
    }
  };

  const confirmFeature = () => {
    setIsFeatured(true);
    setFeatureConfirmOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div 
          ref={modalRef}
          className={`relative w-full max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl overflow-hidden ${
            mode === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          <div className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${
            mode === 'dark' ? 'border-white/10 bg-gray-900' : 'border-black/10 bg-white'
          }`}>
            <h2 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              上传作品
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${
                mode === 'dark'
                  ? 'hover:bg-white/10 text-white/70'
                  : 'hover:bg-black/10 text-gray-500'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!uploadedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : mode === 'dark'
                      ? 'border-white/20 hover:border-white/30'
                      : 'border-black/20 hover:border-black/30'
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.webm,.mov,.avi,.obj,.fbx,.gltf,.glb,.stl,.html,.css,.js,.jsx,.ts,.tsx"
                />
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  mode === 'dark' ? 'text-white/50' : 'text-gray-400'
                }`} />
                <p className={`text-lg font-medium mb-2 ${
                  mode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  拖拽文件或点击选择
                </p>
                <p className={`text-sm ${
                  mode === 'dark' ? 'text-white/50' : 'text-gray-500'
                }`}>
                  支持图片、视频、3D模型、代码文件
                </p>
              </div>
            ) : (
              <div className={`rounded-xl p-4 ${
                mode === 'dark' ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <div className="flex items-center gap-4">
                  {preview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      mode === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {uploadedFile.name}
                    </p>
                    <p className={`text-sm ${
                      mode === 'dark' ? 'text-white/50' : 'text-gray-500'
                    }`}>
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {detectedCategory && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: categories.find(c => c.id === detectedCategory)?.color + '20',
                        color: categories.find(c => c.id === detectedCategory)?.color,
                      }}
                    >
                      {(() => {
                        const Icon = categoryIcons[detectedCategory];
                        return <Icon size={14} />;
                      })()}
                      {categories.find(c => c.id === detectedCategory)?.nameZh}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                mode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                作品标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入作品标题"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors ${
                  mode === 'dark'
                    ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-indigo-500'
                    : 'bg-black/5 border border-black/10 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                mode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                作品描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述你的作品..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-colors ${
                  mode === 'dark'
                    ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-indigo-500'
                    : 'bg-black/5 border border-black/10 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                }`}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={handleFeaturedToggle}
                className="w-5 h-5 rounded border-2 border-indigo-500 bg-transparent checked:bg-indigo-500"
              />
              <span className={`text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                设置为轮播图展示
              </span>
            </label>
          </div>

          <div className={`flex gap-3 p-6 border-t flex-shrink-0 ${
            mode === 'dark' ? 'border-white/10 bg-gray-900' : 'border-black/10 bg-white'
          }`}>
            <button
              onClick={handleClose}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                mode === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-black/10 hover:bg-black/20 text-gray-900'
              }`}
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={!uploadedFile || !title || !detectedCategory}
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上传
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={featureConfirmOpen}
        onClose={() => setFeatureConfirmOpen(false)}
        onConfirm={confirmFeature}
        title="设为轮播展示"
        message="确定要将此作品设为轮播展示吗？"
        confirmText="确认"
        cancelText="取消"
        type="info"
        icon="star"
      />
    </>
  );
}
