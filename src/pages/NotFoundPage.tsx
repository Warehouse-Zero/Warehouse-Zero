import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function NotFoundPage() {
  const { mode } = useThemeStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      mode === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#f8fafc]'
    }`}>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="relative inline-block mb-8">
              <div className={`absolute inset-0 blur-3xl opacity-30 animate-pulse ${
                mode === 'dark' ? 'bg-indigo-500' : 'bg-indigo-400'
              }`} />
              <div className={`relative text-[150px] sm:text-[200px] font-black leading-none tracking-tighter ${
                mode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="inline-block" style={{ transform: 'rotate(-10deg)' }}>4</span>
                <span className="inline-block text-indigo-500" style={{ transform: 'rotate(5deg)' }}>0</span>
                <span className="inline-block" style={{ transform: 'rotate(10deg)' }}>4</span>
              </div>
            </div>

            <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${
              mode === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              页面不见了
            </h1>

            <p className={`text-lg mb-8 max-w-md mx-auto ${
              mode === 'dark' ? 'text-white/60' : 'text-gray-600'
            }`}>
              您访问的页面似乎已经迷失在宇宙中，但我们会帮您找到回去的路。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <Home size={20} />
                返回首页
              </Link>
              <button
                onClick={() => window.history.back()}
                className={`flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  mode === 'dark'
                    ? 'bg-white/10 hover:bg-white/15 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <ArrowLeft size={20} />
                上一页
              </button>
            </div>

            <div className={`mt-16 pt-16 border-t ${
              mode === 'dark' ? 'border-white/10' : 'border-black/10'
            }`}>
              <p className={`text-sm mb-6 ${
                mode === 'dark' ? 'text-white/40' : 'text-gray-500'
              }`}>
                或者试试这些地方
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/category/graphic"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-900'
                  }`}
                >
                  平面设计
                </Link>
                <Link
                  to="/category/video"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-900'
                  }`}
                >
                  视频制作
                </Link>
                <Link
                  to="/category/3d"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-900'
                  }`}
                >
                  3D建模
                </Link>
                <Link
                  to="/category/code"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-900'
                  }`}
                >
                  开发项目
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none -z-10">
            <div className={`h-[300px] w-full opacity-10 ${
              mode === 'dark' ? 'bg-gradient-to-t from-indigo-500/20 to-transparent' : 'bg-gradient-to-t from-indigo-400/20 to-transparent'
            }`} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
