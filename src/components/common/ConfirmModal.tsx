import { useState, useEffect } from 'react';
import { X, AlertTriangle, Star, Check } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: 'delete' | 'star' | 'check';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'danger',
  icon = 'delete'
}: ConfirmModalProps) {
  const { mode } = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    onConfirm();
    setIsLoading(false);
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'danger':
        return mode === 'dark' ? 'bg-red-500/10' : 'bg-red-50';
      case 'warning':
        return mode === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50';
      case 'info':
        return mode === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50';
      default:
        return mode === 'dark' ? 'bg-red-500/10' : 'bg-red-50';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      case 'info':
        return 'text-indigo-500';
      default:
        return 'text-red-500';
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-500';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500';
      case 'info':
        return 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500';
      default:
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-500';
    }
  };

  const renderIcon = () => {
    const iconClass = `w-6 h-6 ${getIconColor()}`;
    switch (icon) {
      case 'star':
        return <Star className={iconClass} />;
      case 'check':
        return <Check className={iconClass} />;
      default:
        return <AlertTriangle className={iconClass} />;
    }
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
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconBgColor()}`}>
              {renderIcon()}
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
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getConfirmButtonColor()}`}
            >
              {isLoading ? '处理中...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
