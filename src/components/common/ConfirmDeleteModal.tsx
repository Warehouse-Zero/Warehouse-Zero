import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = '确认删除',
  message = '确定要删除这个作品吗？此操作无法撤销。'
}: ConfirmDeleteModalProps) {
  const { mode } = useThemeStore();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 ${
        mode === 'dark' ? 'bg-[#14141f] border border-white/10' : 'bg-white border border-black/10'
      }`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              mode === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
            }`}>
              <Trash2 size={24} className="text-red-500" />
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                mode === 'dark' ? 'hover:bg-white/10 text-white/50 hover:text-white' : 'hover:bg-black/10 text-gray-500 hover:text-gray-900'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          <h3 className={`text-xl font-bold mb-2 ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed ${
            mode === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>
            {message}
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                mode === 'dark'
                  ? 'bg-white/10 hover:bg-white/15 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isDeleting ? '删除中...' : '删除'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
