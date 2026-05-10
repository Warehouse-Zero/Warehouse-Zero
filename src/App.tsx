import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import WorkDetailPage from './pages/WorkDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function AppContent() {
  const { mode } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 检查是否有保存的重定向路径
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      navigate(redirectPath);
    }
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <div className={mode === 'dark' ? 'dark' : ''}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:type" element={<CategoryPage />} />
        <Route path="/work/:type/:id" element={<WorkDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router basename="/Warehouse-Zero">
      <AppContent />
    </Router>
  );
}