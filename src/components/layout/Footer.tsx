import { useThemeStore } from '../../stores/themeStore';
import { categories } from '../../types';

export default function Footer() {
  const { mode } = useThemeStore();

  return (
    <footer className={`py-12 border-t ${
      mode === 'dark' 
        ? 'border-white/5 bg-black/50' 
        : 'border-black/5 bg-white/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className={`text-lg font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <span className="text-indigo-500">Warehouse</span>-Zero
            </h3>
            <p className={`text-sm mt-1 ${mode === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
              零号仓库
            </p>
          </div>

          <p className={`text-xs ${mode === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
            © 2024 Warehouse-Zero. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
