import { useState, useEffect, useCallback } from 'react';
import { Search, X, Upload, Sun, Moon, Menu, ChevronDown } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorksStore } from '../../stores/worksStore';
import { categories, CategoryType } from '../../types';
import UploadModal from '../common/UploadModal';
import { Palette, Video, Box, Code } from 'lucide-react';

const iconMap: Record<string, any> = {
  Palette,
  Video,
  Box,
  Code,
};

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { mode, toggleTheme } = useThemeStore();
  const { searchWorks } = useWorksStore();
  const [searchResults, setSearchResults] = useState<typeof categories>([]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const results = searchWorks(searchQuery);
      setSearchResults(results as any);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchWorks]);

  useEffect(() => {
    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [handleSearch]);

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        mode === 'dark' 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' 
          : 'bg-white/80 backdrop-blur-xl border-b border-black/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <a href="/" className={`text-xl font-bold tracking-tight ${
                mode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="text-indigo-500">Warehouse</span>-Zero
              </a>

              <div className="hidden lg:flex items-center gap-1">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.icon];
                  return (
                    <a
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        mode === 'dark'
                          ? 'hover:bg-white/10 text-white/70 hover:text-white'
                          : 'hover:bg-black/10 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={16} style={{ color: cat.color }} />
                      {cat.nameZh}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    mode === 'dark'
                      ? 'hover:bg-white/10 text-white/70 hover:text-white'
                      : 'hover:bg-black/10 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Search size={20} />
                </button>
              ) : (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索作品..."
                    autoFocus
                    className={`w-48 sm:w-64 px-4 py-2 rounded-lg text-sm outline-none transition-all ${
                      mode === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white placeholder-white/50'
                        : 'bg-black/5 border border-black/10 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className={`ml-2 p-2 rounded-lg ${
                      mode === 'dark' ? 'text-white/70' : 'text-gray-600'
                    }`}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  mode === 'dark'
                    ? 'hover:bg-white/10 text-white/70 hover:text-white'
                    : 'hover:bg-black/10 text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setUploadOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Upload size={16} />
                <span className="hidden sm:inline">上传</span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  mode === 'dark'
                    ? 'hover:bg-white/10 text-white/70'
                    : 'hover:bg-black/10 text-gray-600'
                }`}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className={`lg:hidden border-t ${
            mode === 'dark'
              ? 'bg-gray-900/95 backdrop-blur-xl border-white/10'
              : 'bg-white/95 backdrop-blur-xl border-black/10'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon];
                return (
                  <a
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      mode === 'dark'
                        ? 'hover:bg-white/10 text-white/70 hover:text-white'
                        : 'hover:bg-black/10 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} style={{ color: cat.color }} />
                    {cat.nameZh}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {searchOpen && searchQuery && searchResults.length > 0 && (
          <div className={`absolute top-16 left-0 right-0 max-h-96 overflow-y-auto border-t ${
            mode === 'dark'
              ? 'bg-gray-900/95 backdrop-blur-xl border-white/10'
              : 'bg-white/95 backdrop-blur-xl border-black/10'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className={`text-xs font-medium mb-3 ${
                mode === 'dark' ? 'text-white/50' : 'text-gray-500'
              }`}>
                搜索结果 ({searchResults.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {searchResults.slice(0, 8).map((work: any) => (
                  <a
                    key={work.id}
                    href={`/work/${work.category}/${work.id}`}
                    className={`group rounded-lg overflow-hidden transition-all ${
                      mode === 'dark' ? 'bg-white/5' : 'bg-black/5'
                    }`}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={work.thumbnail}
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <p className={`text-sm font-medium truncate ${
                        mode === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {work.title}
                      </p>
                      <p className={`text-xs ${
                        mode === 'dark' ? 'text-white/50' : 'text-gray-500'
                      }`}>
                        {categories.find(c => c.id === work.category)?.nameZh}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
