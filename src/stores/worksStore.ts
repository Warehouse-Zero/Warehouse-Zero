import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Work, CategoryType } from '../types';

interface WorksState {
  works: Work[];
  carouselWorks: Work[];
  addWork: (work: Work) => void;
  removeWork: (id: string) => void;
  toggleCarouselFeatured: (id: string) => void;
  getWorksByCategory: (category: CategoryType) => Work[];
  getWorkById: (id: string) => Work | undefined;
  searchWorks: (query: string) => Work[];
}

const initialWorks: Work[] = [
  {
    id: 'g1',
    title: '品牌视觉系统设计',
    category: 'graphic',
    thumbnail: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=1200&q=90',
    createdAt: '2024-03-15',
    description: '为科技公司设计的完整品牌视觉系统，包含Logo、名片、信纸等全套VI设计',
    isCarouselFeatured: true,
    width: 1920,
    height: 1080,
  },
  {
    id: 'g2',
    title: '极简海报系列',
    category: 'graphic',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=90',
    createdAt: '2024-02-20',
    description: '系列极简风格艺术海报，运用几何图形和渐变色彩',
    width: 1080,
    height: 1920,
  },
  {
    id: 'g3',
    title: '产品包装设计',
    category: 'graphic',
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=90',
    createdAt: '2024-01-10',
    description: '高端护肤品牌产品包装设计',
    width: 1200,
    height: 1600,
  },
  {
    id: 'g4',
    title: '插画艺术作品',
    category: 'graphic',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=90',
    createdAt: '2023-12-05',
    description: '数字插画作品集，融合东方美学与现代设计',
    width: 1920,
    height: 2560,
  },
  {
    id: 'g5',
    title: 'UI界面设计',
    category: 'graphic',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90',
    createdAt: '2023-11-20',
    description: '移动应用界面设计案例',
    width: 1440,
    height: 900,
  },
  {
    id: 'v1',
    title: '品牌形象片',
    category: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    createdAt: '2024-03-10',
    description: '企业品牌形象宣传片，4K超清制作',
    isCarouselFeatured: true,
    width: 1920,
    height: 1080,
  },
  {
    id: 'v2',
    title: '产品演示视频',
    category: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    createdAt: '2024-02-15',
    description: '科技产品功能演示视频',
    width: 1920,
    height: 1080,
  },
  {
    id: 'v3',
    title: '纪录片短片',
    category: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    createdAt: '2024-01-25',
    description: '人文纪实短片创作',
    width: 1920,
    height: 1080,
  },
  {
    id: 'v4',
    title: '动画短片',
    category: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    createdAt: '2023-12-15',
    description: '原创动画短片',
    width: 1920,
    height: 1080,
  },
  {
    id: 'v5',
    title: '活动记录',
    category: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    createdAt: '2023-11-10',
    description: '商业活动全程记录',
    width: 1920,
    height: 1080,
  },
  {
    id: 'v6',
    title: '测试视频(5秒)',
    category: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    createdAt: '2024-04-15',
    description: '5秒时长的测试视频，用于实验和调试',
    width: 400,
    height: 300,
  },
  {
    id: 'm1',
    title: '机械手表建模',
    category: 'model',
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=90',
    createdAt: '2024-03-05',
    description: '精密机械手表3D建模与渲染',
    isCarouselFeatured: true,
    width: 1200,
    height: 1200,
  },
  {
    id: 'm2',
    title: '未来感汽车概念设计',
    category: 'model',
    thumbnail: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=90',
    createdAt: '2024-02-10',
    description: '未来主义汽车概念设计3D模型',
    width: 1920,
    height: 1280,
  },
  {
    id: 'm3',
    title: '建筑可视化',
    category: 'model',
    thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=90',
    createdAt: '2024-01-15',
    description: '现代建筑室内外一体化设计可视化',
    width: 1920,
    height: 1440,
  },
  {
    id: 'm4',
    title: '角色建模',
    category: 'model',
    thumbnail: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=1200&q=90',
    createdAt: '2023-12-20',
    description: '游戏角色3D建模',
    width: 1080,
    height: 1920,
  },
  {
    id: 'm5',
    title: '产品细节展示',
    category: 'model',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90',
    createdAt: '2023-11-25',
    description: '工业产品细节建模展示',
    width: 1200,
    height: 1600,
  },
  {
    id: 'd2',
    title: '响应式仪表盘',
    category: 'development',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    url: '',
    createdAt: '2024-03-01',
    description: '数据分析仪表盘，React + TypeScript开发',
    width: 1920,
    height: 1080,
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Analytics Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white p-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Analytics Dashboard</h1>
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-slate-800 p-6 rounded-xl">
        <p class="text-slate-400">Total Users</p>
        <p class="text-4xl font-bold text-indigo-400">24,589</p>
      </div>
      <div class="bg-slate-800 p-6 rounded-xl">
        <p class="text-slate-400">Revenue</p>
        <p class="text-4xl font-bold text-emerald-400">$89,432</p>
      </div>
      <div class="bg-slate-800 p-6 rounded-xl">
        <p class="text-slate-400">Growth</p>
        <p class="text-4xl font-bold text-amber-400">+12.5%</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    isCarouselFeatured: true,
  },
  {
    id: 'd3',
    title: '电商首页模板',
    category: 'development',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    url: '',
    createdAt: '2024-02-05',
    description: '现代电商网站首页模板',
    width: 1920,
    height: 1080,
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Modern Shop</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
  <nav class="flex justify-between items-center p-6 shadow-sm">
    <h1 class="text-2xl font-bold">MODERN SHOP</h1>
    <div class="flex gap-6">
      <a href="#" class="hover:text-indigo-600">Home</a>
      <a href="#" class="hover:text-indigo-600">Products</a>
      <a href="#" class="hover:text-indigo-600">About</a>
    </div>
  </nav>
  <section class="bg-indigo-600 text-white py-20 text-center">
    <h2 class="text-5xl font-bold mb-4">Summer Collection</h2>
    <p class="text-xl mb-8">Discover the latest trends</p>
    <button class="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold">
      Shop Now
    </button>
  </section>
</body>
</html>`,
  },
  {
    id: 'd4',
    title: '任务管理应用',
    category: 'development',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    url: '',
    createdAt: '2024-01-20',
    description: 'Kanban风格任务管理应用',
    width: 1440,
    height: 900,
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Task Board</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 p-8">
  <h1 class="text-2xl font-bold mb-6">My Task Board</h1>
  <div class="flex gap-4">
    <div class="bg-white p-4 rounded-lg w-64">
      <h3 class="font-semibold text-amber-600 mb-3">To Do</h3>
      <div class="bg-slate-50 p-3 rounded mb-2 text-sm">Design system</div>
      <div class="bg-slate-50 p-3 rounded text-sm">API integration</div>
    </div>
    <div class="bg-white p-4 rounded-lg w-64">
      <h3 class="font-semibold text-blue-600 mb-3">In Progress</h3>
      <div class="bg-slate-50 p-3 rounded text-sm">User auth</div>
    </div>
    <div class="bg-white p-4 rounded-lg w-64">
      <h3 class="font-semibold text-emerald-600 mb-3">Done</h3>
      <div class="bg-slate-50 p-3 rounded text-sm">Project setup</div>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'd5',
    title: '个人作品集',
    category: 'development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c52495680d4?w=600&q=80',
    url: '',
    createdAt: '2023-12-10',
    description: '创意工作者作品集网站',
    width: 1920,
    height: 1080,
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-900 text-white">
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold mb-4">CREATIVE<br><span class="text-indigo-400">DIRECTOR</span></h1>
      <p class="text-slate-400 mb-8">Crafting digital experiences</p>
      <div class="flex justify-center gap-4">
        <button class="bg-indigo-600 px-6 py-2 rounded-full">View Work</button>
        <button class="border border-white px-6 py-2 rounded-full">Contact</button>
      </div>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'd6',
    title: '天气应用',
    category: 'development',
    thumbnail: 'https://images.unsplash.com/photo-1592210454619-84fdc83265d?w=600&q=80',
    url: '',
    createdAt: '2023-11-15',
    description: '现代化天气查询应用',
    width: 800,
    height: 600,
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Weather App</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-400 to-purple-500 min-h-screen flex items-center justify-center">
  <div class="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-white text-center">
    <p class="text-8xl mb-2">☀️</p>
    <h1 class="text-6xl font-bold">24°C</h1>
    <p class="text-xl mt-2">Sunny</p>
    <p class="mt-4">Shanghai, China</p>
  </div>
</body>
</html>`,
  },
  {
    id: 'd1',
    title: '404 Not Found',
    category: 'development',
    thumbnail: 'https://images.unsplash.com/photo-1575087683924-649d4d9d4d4?w=600&q=80',
    url: '',
    createdAt: '2024-04-01',
    description: '创意404错误页面设计，包含动画效果和友好提示。分为前端展示页面和Node.js/Express后端服务。',
    width: 1920,
    height: 1080,
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      overflow: hidden;
    }
    .container {
      text-align: center;
      position: relative;
      z-index: 10;
    }
    .error-code {
      font-size: clamp(100px, 25vw, 200px);
      font-weight: 900;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      animation: glitch 3s infinite;
    }
    @keyframes glitch {
      0%, 90%, 100% { transform: translate(0); }
      92% { transform: translate(-5px, 2px); }
      94% { transform: translate(5px, -2px); }
      96% { transform: translate(-3px, 1px); }
    }
    .floating-balls {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      overflow: hidden;
    }
    .ball {
      position: absolute;
      border-radius: 50%;
      animation: float 4s ease-in-out infinite;
    }
    .ball:nth-child(1) { width: 60px; height: 60px; background: #ffd93d; top: 10%; left: 10%; animation-delay: 0s; }
    .ball:nth-child(2) { width: 40px; height: 40px; background: #6c5ce7; top: 20%; right: 15%; animation-delay: 0.5s; }
    .ball:nth-child(3) { width: 50px; height: 50px; background: #ff6b6b; bottom: 20%; left: 20%; animation-delay: 1s; }
    .ball:nth-child(4) { width: 35px; height: 35px; background: #00d2d3; bottom: 30%; right: 10%; animation-delay: 1.5s; }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
      50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
    }
    h2 { color: #fff; font-size: 2rem; margin: 20px 0; }
    p { color: rgba(255,255,255,0.6); font-size: 1.1rem; margin-bottom: 30px; }
    .btn-group { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
    .btn {
      padding: 12px 30px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5); }
    .btn-secondary {
      background: transparent;
      color: #fff;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }
    .dots { display: flex; gap: 8px; justify-content: center; margin-top: 40px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; animation: pulse 1.5s infinite; }
    .dot:nth-child(1) { background: #667eea; animation-delay: 0s; }
    .dot:nth-child(2) { background: #764ba2; animation-delay: 0.2s; }
    .dot:nth-child(3) { background: #f093fb; animation-delay: 0.4s; }
    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } }
  </style>
</head>
<body>
  <div class="floating-balls">
    <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div>
  </div>
  <div class="container">
    <div class="error-code">404</div>
    <h2>Oops! Page Not Found</h2>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <div class="btn-group">
      <a href="/" class="btn btn-primary">Go Home</a>
      <button onclick="history.back()" class="btn btn-secondary">Go Back</button>
    </div>
    <div class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</body>
</html>`,
frontendCode: `<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - 页面未找到</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      overflow: hidden;
    }
    .container {
      text-align: center;
      padding: 20px;
    }
    .error-code {
      font-size: clamp(120px, 30vw, 220px);
      font-weight: 900;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      position: relative;
    }
    .error-code::after {
      content: '404';
      position: absolute;
      left: 3px;
      top: 0;
      background: #ff6b6b;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      opacity: 0;
      animation: glitch 2s infinite;
    }
    @keyframes glitch {
      0%, 90%, 100% { opacity: 0; }
      92%, 94%, 96% { opacity: 0.8; }
      93%, 95% { opacity: 0; }
    }
    .floating-balls { position: fixed; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; overflow: hidden; z-index: 0; }
    .ball {
      position: absolute;
      border-radius: 50%;
      filter: blur(1px);
      animation: float 6s ease-in-out infinite;
    }
    .ball:nth-child(1) { width: 80px; height: 80px; background: radial-gradient(circle, #ffd93d, transparent); top: 10%; left: 10%; }
    .ball:nth-child(2) { width: 60px; height: 60px; background: radial-gradient(circle, #6c5ce7, transparent); top: 15%; right: 20%; animation-delay: 1s; }
    .ball:nth-child(3) { width: 100px; height: 100px; background: radial-gradient(circle, #ff6b6b, transparent); bottom: 20%; left: 15%; animation-delay: 2s; }
    .ball:nth-child(4) { width: 50px; height: 50px; background: radial-gradient(circle, #00cec9, transparent); bottom: 25%; right: 10%; animation-delay: 3s; }
    .ball:nth-child(5) { width: 70px; height: 70px; background: radial-gradient(circle, #a29bfe, transparent); top: 50%; left: 5%; animation-delay: 4s; }
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-40px) scale(1.1); }
    }
    h2 { color: #fff; font-size: clamp(1.5rem, 4vw, 2.5rem); margin: 20px 0; font-weight: 600; }
    p { color: rgba(255,255,255,0.6); font-size: clamp(0.9rem, 2vw, 1.1rem); margin-bottom: 30px; max-width: 400px; margin-left: auto; margin-right: auto; }
    .btn-group { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
    .btn {
      padding: 14px 32px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
    }
    .btn-primary:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 20px 50px rgba(102, 126, 234, 0.5); }
    .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 2px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px); }
    .btn-secondary:hover { background: rgba(255,255,255,0.2); transform: translateY(-3px); }
    .dots { display: flex; gap: 10px; justify-content: center; margin-top: 50px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out; }
    .dot:nth-child(1) { background: #667eea; animation-delay: -0.32s; }
    .dot:nth-child(2) { background: #764ba2; animation-delay: -0.16s; }
    .dot:nth-child(3) { background: #f093fb; }
    @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
  </style>
</head>
<body>
  <div class="floating-balls">
    <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div>
  </div>
  <div class="container">
    <div class="error-code">404</div>
    <h2>哎呀！页面未找到</h2>
    <p>您访问的页面不存在或已被移动，请返回首页或返回上一页。</p>
    <div class="btn-group">
      <a href="/" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
        返回首页
      </a>
      <button onclick="history.back()" class="btn btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"/></svg>
        返回上页
      </button>
    </div>
    <div class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</body>
</html>`,
backendCode: `// server.js - Node.js + Express 后端服务
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static('public'));

// API 路由示例
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 处理中间件
app.use((req, res, next) => {
  // 检查请求是否来自 API
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found',
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }
  
  // 对于非 API 请求，返回自定义 404 页面
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
  console.log('404 page available at http://localhost:' + PORT + '/404.html');
});

// 启动命令: node server.js
// 环境变量: PORT=8080 node server.js
`,
  },
];

export const useWorksStore = create<WorksState>()(
  persist(
    (set, get) => ({
      works: initialWorks,
      carouselWorks: initialWorks.filter(w => w.isCarouselFeatured),
      addWork: (work) => set((state) => ({
        works: [work, ...state.works],
        carouselWorks: work.isCarouselFeatured 
          ? [work, ...state.carouselWorks] 
          : state.carouselWorks,
      })),
      removeWork: (id) => set((state) => ({
        works: state.works.filter(w => w.id !== id),
        carouselWorks: state.carouselWorks.filter(w => w.id !== id),
      })),
      toggleCarouselFeatured: (id) => set((state) => {
        const updatedWorks = state.works.map(w => 
          w.id === id ? { ...w, isCarouselFeatured: !w.isCarouselFeatured } : w
        );
        return {
          works: updatedWorks,
          carouselWorks: updatedWorks.filter(w => w.isCarouselFeatured),
        };
      }),
      getWorksByCategory: (category) => get().works.filter(w => w.category === category),
      getWorkById: (id) => get().works.find(w => w.id === id),
      searchWorks: (query) => {
        const q = query.toLowerCase();
        return get().works.filter(w => 
          w.title.toLowerCase().includes(q) || 
          w.description?.toLowerCase().includes(q)
        );
      },
    }),
    {
      name: 'works-storage-v5',
    }
  )
);
