export type CategoryType = 'graphic' | 'video' | 'model' | 'development';

export interface Work {
  id: string;
  title: string;
  category: CategoryType;
  thumbnail: string;
  url: string;
  createdAt: string;
  description?: string;
  code?: string;
  frontendCode?: string;
  backendCode?: string;
  isCarouselFeatured?: boolean;
  width?: number;
  height?: number;
}

export interface Category {
  id: CategoryType;
  name: string;
  nameZh: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'graphic', name: 'Graphic Design', nameZh: '平面设计', icon: 'Palette', color: '#f472b6' },
  { id: 'video', name: 'Video Production', nameZh: '视频制作', icon: 'Video', color: '#fb923c' },
  { id: 'model', name: '3D Modeling', nameZh: '3D建模', icon: 'Box', color: '#38bdf8' },
  { id: 'development', name: 'Development', nameZh: '开发项目', icon: 'Code', color: '#a78bfa' },
];

export const categoryExtensions: Record<CategoryType, string[]> = {
  graphic: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.psd', '.ai'],
  video: ['.mp4', '.webm', '.mov', '.avi'],
  model: ['.obj', '.fbx', '.gltf', '.glb', '.stl'],
  development: ['.html', '.css', '.js', '.jsx', '.ts', '.tsx'],
};
