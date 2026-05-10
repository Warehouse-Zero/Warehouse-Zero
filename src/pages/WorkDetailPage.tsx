import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, StarOff, Download, Trash2, Palette, Video, Box, Code } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useWorksStore } from '../stores/worksStore';
import { categories, CategoryType } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ImageViewer from '../components/common/ImageViewer';
import VideoPlayer from '../components/details/VideoPlayer';
import ModelViewer from '../components/details/ModelViewer';
import DualCodePreview from '../components/details/DualCodePreview';
import ConfirmModal from '../components/common/ConfirmModal';

const iconMap: Record<string, any> = {
  Palette,
  Video,
  Box,
  Code,
};

export default function WorkDetailPage() {
  const { mode } = useThemeStore();
  const { getWorkById, removeWork, toggleCarouselFeatured } = useWorksStore();
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);

  const work = id ? getWorkById(id) : undefined;
  const category = categories.find((c) => c.id === type);

  if (!work) {
    return (
      <div className={`min-h-screen ${mode === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#f8fafc]'}`}>
        <Navbar />
        <div className="pt-32 text-center">
          <p className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>作品不存在</p>
          <Link to="/" className="text-indigo-500 hover:underline mt-4 inline-block">
            返回首页
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    removeWork(work.id);
    navigate(`/category/${work.category}`);
    setDeleteModalOpen(false);
  };

  const handleToggleFeatured = () => {
    setFeatureModalOpen(true);
  };

  const confirmToggleFeatured = () => {
    toggleCarouselFeatured(work.id);
    setFeatureModalOpen(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = work.url || work.thumbnail;
    link.download = `${work.title}.${work.url?.split('.').pop() || 'jpg'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CategoryIcon = category ? iconMap[category.icon] : Palette;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      mode === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#f8fafc]'
    }`}>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              to={`/category/${work.category}`}
              className={`inline-flex items-center gap-2 transition-colors ${
                mode === 'dark'
                  ? 'text-white/60 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft size={18} />
              返回 {category?.nameZh || '分类'}
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFeatured}
                className={`p-2 rounded-lg transition-colors ${
                  mode === 'dark'
                    ? 'hover:bg-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-black/10 text-gray-600 hover:text-gray-900'
                } ${work.isCarouselFeatured ? 'text-yellow-500' : ''}`}
                title={work.isCarouselFeatured ? '取消轮播展示' : '设为轮播展示'}
              >
                {work.isCarouselFeatured ? <Star size={18} /> : <StarOff size={18} />}
              </button>
              <button
                onClick={handleDownload}
                className={`p-2 rounded-lg transition-colors ${
                  mode === 'dark'
                    ? 'hover:bg-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-black/10 text-gray-600 hover:text-gray-900'
                }`}
                title="下载"
              >
                <Download size={18} />
              </button>
              <button
                onClick={handleDelete}
                className={`p-2 rounded-lg transition-colors ${
                  mode === 'dark'
                    ? 'hover:bg-red-500/20 text-red-400'
                    : 'hover:bg-red-50 text-red-600'
                }`}
                title="删除"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: mode === 'dark' ? '#14141f' : '#f1f5f9',
                }}
              >
                {work.category === 'graphic' && (
                  <div
                    className="cursor-pointer"
                    onClick={() => setImageViewerOpen(true)}
                  >
                    <img
                      src={work.url || work.thumbnail}
                      alt={work.title}
                      className="w-full h-auto"
                    />
                    <div className={`absolute bottom-0 left-0 right-0 p-4 ${
                      mode === 'dark' ? 'bg-black/50' : 'bg-white/50'
                    } backdrop-blur-sm text-center text-sm opacity-0 hover:opacity-100 transition-opacity`}>
                      点击查看大图
                    </div>
                  </div>
                )}

                {work.category === 'video' && (
                  <VideoPlayer src={work.url} poster={work.thumbnail} />
                )}

                {work.category === 'model' && (
                  <ModelViewer src={work.url} color={category?.color} />
                )}

                {work.category === 'development' && work.code && (
                  <DualCodePreview
                    code={work.code}
                    previewCode={work.code}
                    frontendCode={work.frontendCode}
                    backendCode={work.backendCode}
                  />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`rounded-2xl p-6 ${
                mode === 'dark' ? 'bg-white/5' : 'bg-white'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: (category?.color || '#6366f1') + '20',
                    }}
                  >
                    <CategoryIcon
                      size={20}
                      style={{ color: category?.color || '#6366f1' }}
                    />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: category?.color || '#6366f1' }}
                  >
                    {category?.nameZh}
                  </span>
                </div>

                <h1 className={`text-2xl font-bold mb-4 ${
                  mode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {work.title}
                </h1>

                {work.description && (
                  <p className={`text-sm leading-relaxed ${
                    mode === 'dark' ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    {work.description}
                  </p>
                )}

                <div className={`mt-6 pt-6 border-t ${
                  mode === 'dark' ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={mode === 'dark' ? 'text-white/50' : 'text-gray-500'}>
                      创建时间
                    </span>
                    <span className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {work.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ImageViewer
        src={work.url || work.thumbnail}
        alt={work.title}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="确认删除"
        message="确定要删除这个作品吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        type="danger"
        icon="delete"
      />

      <ConfirmModal
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
        onConfirm={confirmToggleFeatured}
        title={work.isCarouselFeatured ? '取消轮播展示' : '设为轮播展示'}
        message={work.isCarouselFeatured 
          ? '确定要取消此作品的轮播展示吗？' 
          : '确定要将此作品设为轮播展示吗？'}
        confirmText="确认"
        cancelText="取消"
        type="info"
        icon="star"
      />

      <Footer />
    </div>
  );
}
