import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, Eye, Code2, Play } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css';

interface DualCodePreviewProps {
  code: string;
  previewCode: string;
  frontendCode?: string;
  backendCode?: string;
}

type MobileView = 'preview' | 'code-view';
type CodeType = 'html' | 'css' | 'js' | 'all';
type DesktopViewMode = 'preview' | 'code';

const decodeHtmlEntities = (html: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

export default function DualCodePreview({ 
  code, 
  previewCode, 
  frontendCode, 
  backendCode 
}: DualCodePreviewProps) {
  const { mode } = useThemeStore();
  const [mobileView, setMobileView] = useState<MobileView>('preview');
  const [codeType, setCodeType] = useState<CodeType>('all');
  const [activeTab, setActiveTab] = useState<'preview' | 'frontend' | 'backend'>('preview');
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);
  const [desktopViewMode, setDesktopViewMode] = useState<DesktopViewMode>('preview');
  const [editedCode, setEditedCode] = useState<string>('');
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeRefMobile = useRef<HTMLPreElement>(null);
  const codeRefDesktop = useRef<HTMLPreElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const currentCode = activeTab === 'frontend' ? frontendCode : activeTab === 'backend' ? backendCode : code;

  const getCodeByType = (type: CodeType): string => {
    const decodedCode = decodeHtmlEntities(currentCode || '');
    if (type === 'all') {
      return decodedCode;
    }
    if (type === 'html') {
      const htmlMatch = decodedCode.match(/<html[\s\S]*?<\/html>/i);
      return htmlMatch ? htmlMatch[0] : decodedCode;
    }
    if (type === 'css') {
      const styleMatch = decodedCode.match(/<style[^>]*>[\s\S]*?<\/style>/i);
      return styleMatch ? styleMatch[0] : '/* 未找到CSS样式 */';
    }
    if (type === 'js') {
      const scriptMatch = decodedCode.match(/<script[^>]*>[\s\S]*?<\/script>/i);
      return scriptMatch ? scriptMatch[0] : '/* 未找到JavaScript代码 */';
    }
    return '';
  };

  const getFullPreviewCode = (type: CodeType, modifiedCode: string): string => {
    if (type === 'all') {
      return modifiedCode;
    }
    
    const decodedOriginal = decodeHtmlEntities(currentCode || '');
    let fullCode = decodedOriginal;
    
    if (type === 'html') {
      const htmlMatch = fullCode.match(/<html[\s\S]*?<\/html>/i);
      if (htmlMatch) {
        fullCode = fullCode.replace(htmlMatch[0], modifiedCode);
      } else {
        fullCode = modifiedCode;
      }
    } else if (type === 'css') {
      const styleMatch = fullCode.match(/<style[^>]*>[\s\S]*?<\/style>/i);
      if (styleMatch) {
        fullCode = fullCode.replace(styleMatch[0], modifiedCode);
      } else {
        fullCode = modifiedCode;
      }
    } else if (type === 'js') {
      const scriptMatch = fullCode.match(/<script[^>]*>[\s\S]*?<\/script>/i);
      if (scriptMatch) {
        fullCode = fullCode.replace(scriptMatch[0], modifiedCode);
      } else {
        fullCode = modifiedCode;
      }
    }
    
    return fullCode;
  };

  useEffect(() => {
    const initialCode = getCodeByType(codeType);
    setEditedCode(initialCode);
    setInitialLoadComplete(true);
  }, [currentCode, frontendCode, backendCode]);

  useEffect(() => {
    if (initialLoadComplete) {
      const newCode = getCodeByType(codeType);
      setEditedCode(newCode);
    }
  }, [codeType, initialLoadComplete, currentCode, frontendCode, backendCode]);

  const updatePreview = useCallback(() => {
    setIframeKey(prev => prev + 1);
  }, []);

  const getCurrentPreviewContent = useCallback(() => {
    return getFullPreviewCode(codeType, editedCode);
  }, [codeType, editedCode, currentCode, frontendCode, backendCode]);

  useEffect(() => {
    if (initialLoadComplete) {
      updatePreview();
    }
  }, [updatePreview, initialLoadComplete]);

  useEffect(() => {
    const highlightCode = () => {
      if (codeRefMobile.current) {
        Prism.highlightElement(codeRefMobile.current);
      }
      if (codeRefDesktop.current) {
        Prism.highlightElement(codeRefDesktop.current);
      }
    };
    highlightCode();
  }, [codeType, editedCode, mode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCodeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDesktopCodeTypeSelect = (type: CodeType) => {
    setCodeType(type);
    setCodeDropdownOpen(false);
  };

  const typeLabels: Record<CodeType, string> = { 
    html: 'HTML', 
    css: 'CSS', 
    js: 'JavaScript',
    all: '全部代码'
  };
  
  const typeColors: Record<CodeType, { bg: string; border: string; text: string }> = { 
    html: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400' },
    css: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    js: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    all: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' }
  };

  const getLanguageClass = (type: CodeType) => {
    if (type === 'all') return 'language-markup';
    return `language-${type}`;
  };

  const MobileCodeView = () => {
    const colors = typeColors[codeType];
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempCode, setTempCode] = useState(editedCode);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setShowMenu(false);
        }
      };
      if (showMenu) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showMenu]);

    useEffect(() => {
      if (!isEditing) {
        setTempCode(editedCode);
      }
    }, [editedCode, isEditing]);
    
    const handleMenuSelect = (type: CodeType | 'preview') => {
      if (type === 'preview') {
        setMobileView('preview');
      } else {
        setCodeType(type);
        setMobileView('code-view');
      }
      setShowMenu(false);
    };

    const handleSave = () => {
      setEditedCode(tempCode);
      setIsEditing(false);
      updatePreview();
    };

    const handleCancel = () => {
      setTempCode(editedCode);
      setIsEditing(false);
    };
    
    return (
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between p-4 border-b ${
          mode === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                updatePreview();
                setMobileView('preview');
              }}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                mode === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-black'
              }`}
              title="运行预览"
            >
              <Play size={18} fill="currentColor" />
              <span className="text-sm font-medium">运行</span>
            </button>
            <span className={`font-medium ${colors.text}`}>
              {typeLabels[codeType]}
            </span>
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-lg transition-colors ${
                    mode === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  保存
                </button>
                <button
                  onClick={handleCancel}
                  className={`p-2 rounded-lg transition-colors ${
                    mode === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-black'
                  }`}
                >
                  取消
                </button>
              </>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-lg transition-colors ${
                mode === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-black'
              }`}
              title="切换代码类型"
            >
              <Menu size={20} />
            </button>
            
            {showMenu && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-2xl z-50 border ${
                mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="p-2">
                  <button
                    onClick={() => handleMenuSelect('preview')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      mobileView === 'preview'
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Eye size={18} />
                    <span>预览</span>
                  </button>
                  <button
                    onClick={() => handleMenuSelect('all')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      codeType === 'all' && mobileView === 'code-view'
                        ? `${typeColors.all.bg} ${typeColors.all.text}` 
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Code2 size={18} />
                    <span>全部代码</span>
                  </button>
                  <button
                    onClick={() => handleMenuSelect('html')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      codeType === 'html' && mobileView === 'code-view'
                        ? `${typeColors.html.bg} ${typeColors.html.text}` 
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Code2 size={18} />
                    <span>HTML</span>
                  </button>
                  <button
                    onClick={() => handleMenuSelect('css')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      codeType === 'css' && mobileView === 'code-view'
                        ? `${typeColors.css.bg} ${typeColors.css.text}` 
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Code2 size={18} />
                    <span>CSS</span>
                  </button>
                  <button
                    onClick={() => handleMenuSelect('js')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      codeType === 'js' && mobileView === 'code-view'
                        ? `${typeColors.js.bg} ${typeColors.js.text}` 
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Code2 size={18} />
                    <span>JavaScript</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={`flex-1 overflow-auto p-4 border-2 rounded-xl ${
          mode === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={tempCode}
              onChange={(e) => setTempCode(e.target.value)}
              className={`w-full h-full text-xs font-mono leading-relaxed resize-none outline-none p-4 -m-4 rounded-md ${
                mode === 'dark' ? 'text-white bg-gray-900 placeholder-gray-500' : 'text-slate-950 bg-gray-100 placeholder-gray-500'
              }`}
              style={{ 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word', 
                wordBreak: 'break-all',
                overflowWrap: 'anywhere',
                lineHeight: '1.7',
                minHeight: '300px',
                tabSize: 2
              }}
              spellCheck={false}
              autoFocus
              placeholder="在此编辑代码..."
            />
          ) : (
            <div onClick={() => setIsEditing(true)} className="cursor-text min-h-[300px]">
              <pre 
                ref={codeRefMobile}
                className={`text-xs font-mono leading-relaxed m-0 p-0 ${
                  mode === 'dark' ? 'text-white' : 'text-slate-950'
                } ${getLanguageClass(codeType)}`}
                style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordWrap: 'break-word', 
                  wordBreak: 'break-all',
                  overflowWrap: 'anywhere',
                  background: 'transparent',
                  lineHeight: '1.7'
                }}
              >
                <code>{editedCode}</code>
              </pre>
              <p className={`text-xs mt-3 flex items-center gap-1 ${
                mode === 'dark' ? 'text-gray-500' : 'text-black'
              }`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                点击编辑代码
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MobilePreviewView = () => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setShowMenu(false);
        }
      };
      if (showMenu) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showMenu]);
    
    const handleMenuSelect = (type: CodeType | 'preview') => {
      if (type === 'preview') {
        setMobileView('preview');
      } else {
        setCodeType(type);
        setMobileView('code-view');
      }
      setShowMenu(false);
    };
    
    return (
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between p-3 border-b ${
          mode === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-medium ${mode === 'dark' ? 'text-white' : 'text-black'}`}>成品预览</span>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-lg transition-colors ${
                mode === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-black'
              }`}
              title="切换代码类型"
            >
              <Menu size={20} />
            </button>
            
            {showMenu && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-2xl z-50 border ${
                mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="p-2">
                  <button
                    onClick={() => handleMenuSelect('preview')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      mobileView === 'preview'
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Eye size={18} />
                    <span>预览</span>
                  </button>
                  <button
                    onClick={() => handleMenuSelect('html')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      codeType === 'html' && mobileView === 'code-view'
                        ? `${typeColors.html.bg} ${typeColors.html.text}` 
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Code2 size={18} />
                    <span>HTML</span>
                  </button>
                  <button
                    onClick={() => handleMenuSelect('css')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      codeType === 'css' && mobileView === 'code-view'
                        ? `${typeColors.css.bg} ${typeColors.css.text}` 
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Code2 size={18} />
                    <span>CSS</span>
                  </button>
                  <button
                    onClick={() => handleMenuSelect('js')}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      codeType === 'js' && mobileView === 'code-view'
                        ? `${typeColors.js.bg} ${typeColors.js.text}` 
                        : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Code2 size={18} />
                    <span>JavaScript</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={`flex-1 flex items-center justify-center p-4 overflow-auto ${
          mode === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
        }`}>
          <div className="w-full max-w-[320px] mx-auto">
            <iframe
              key={`mobile-preview-${iframeKey}`}
              title="preview"
              className={`w-full border-2 rounded-lg shadow-lg ${
                mode === 'dark' ? 'border-gray-700 bg-white' : 'border-gray-200 bg-white'
              }`}
              style={{ height: '480px' }}
              srcDoc={getCurrentPreviewContent()}
              sandbox="allow-scripts allow-modals allow-same-origin"
            />
          </div>
        </div>
      </div>
    );
  };

  const DesktopView = () => {
    const colors = typeColors[codeType];
    const [isEditing, setIsEditing] = useState(false);
    const [tempCode, setTempCode] = useState(editedCode);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (!isEditing) {
        setTempCode(editedCode);
      }
    }, [editedCode, isEditing]);

    const handleSave = () => {
      setEditedCode(tempCode);
      setIsEditing(false);
      updatePreview();
    };

    const handleCancel = () => {
      setTempCode(editedCode);
      setIsEditing(false);
    };
    
    return (
      <div className="hidden lg:flex flex-col gap-4">
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${
          mode === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            {desktopViewMode === 'code' && (
              <>
                <button
                  onClick={() => {
                    updatePreview();
                    setDesktopViewMode('preview');
                  }}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                  mode === 'dark' ? 'hover:bg-gray-800 text-white bg-gray-800' : 'hover:bg-gray-100 text-black bg-gray-50'
                }`}
                  title="运行预览"
                >
                  <Play size={18} fill="currentColor" />
                  <span className="text-sm font-medium">运行</span>
                </button>
                {isEditing && (
                  <>
                    <button
                      onClick={handleSave}
                      className={`p-2 rounded-lg transition-colors ${
                        mode === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`p-2 rounded-lg transition-colors ${
                      mode === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-black'
                    }`}
                    >
                      取消
                    </button>
                  </>
                )}
              </>
            )}
            <span className={`font-medium ${
              desktopViewMode === 'preview' 
                ? (mode === 'dark' ? 'text-white' : 'text-black') 
                : colors.text
            }`}>
              {desktopViewMode === 'preview' ? '成品预览' : typeLabels[codeType]}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCodeDropdownOpen(!codeDropdownOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  mode === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-black'
                }`}
                title="切换"
              >
                <Menu size={20} />
              </button>
              
              {codeDropdownOpen && (
                <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden shadow-2xl z-50 border ${
                  mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        updatePreview();
                        setDesktopViewMode('preview');
                        setCodeDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        desktopViewMode === 'preview'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      <Eye size={18} />
                      <div className="flex flex-col items-start">
                        <span>预览</span>
                        <span className="text-xs opacity-60">成品效果</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setDesktopViewMode('code');
                        handleDesktopCodeTypeSelect('all');
                        setIsEditing(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        desktopViewMode === 'code' && codeType === 'all'
                          ? `${typeColors.all.bg} ${typeColors.all.text}` 
                          : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      <Code2 size={18} />
                      <div className="flex flex-col items-start">
                        <span>{typeLabels.all}</span>
                        <span className="text-xs opacity-60">完整代码</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setDesktopViewMode('code');
                        handleDesktopCodeTypeSelect('html');
                        setIsEditing(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        desktopViewMode === 'code' && codeType === 'html'
                          ? `${typeColors.html.bg} ${typeColors.html.text}` 
                          : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      <Code2 size={18} />
                      <div className="flex flex-col items-start">
                        <span>{typeLabels.html}</span>
                        <span className="text-xs opacity-60">网页骨架</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setDesktopViewMode('code');
                        handleDesktopCodeTypeSelect('css');
                        setIsEditing(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        desktopViewMode === 'code' && codeType === 'css'
                          ? `${typeColors.css.bg} ${typeColors.css.text}` 
                          : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      <Code2 size={18} />
                      <div className="flex flex-col items-start">
                        <span>{typeLabels.css}</span>
                        <span className="text-xs opacity-60">视觉样式</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setDesktopViewMode('code');
                        handleDesktopCodeTypeSelect('js');
                        setIsEditing(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        desktopViewMode === 'code' && codeType === 'js'
                          ? `${typeColors.js.bg} ${typeColors.js.text}` 
                          : mode === 'dark' ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-black hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      <Code2 size={18} />
                      <div className="flex flex-col items-start">
                        <span>{typeLabels.js}</span>
                        <span className="text-xs opacity-60">交互功能</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {desktopViewMode === 'preview' ? (
          <div className="flex flex-col items-center">
            <div className={`flex flex-col rounded-xl overflow-hidden h-[500px] w-full max-w-[320px] border-2 ${
              mode === 'dark' ? 'border-gray-700 bg-white' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex-1">
                <iframe
                  key={`desktop-preview-${iframeKey}`}
                  title="desktop-preview"
                  className="w-full h-full border-0"
                  srcDoc={getCurrentPreviewContent()}
                  sandbox="allow-scripts allow-modals allow-same-origin"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={`flex flex-col rounded-xl overflow-hidden h-[500px] w-full max-w-[320px] border-2 ${
              mode === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex-1 overflow-auto p-4">
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={tempCode}
                    onChange={(e) => setTempCode(e.target.value)}
                    className={`w-full h-full text-sm font-mono leading-relaxed resize-none outline-none p-4 -m-4 rounded-md ${
                      mode === 'dark' ? 'text-white bg-gray-900 placeholder-gray-500' : 'text-slate-950 bg-gray-100 placeholder-gray-500'
                    }`}
                    style={{ 
                      whiteSpace: 'pre-wrap', 
                      wordWrap: 'break-word', 
                      wordBreak: 'break-all',
                      overflowWrap: 'anywhere',
                      lineHeight: '1.7',
                      tabSize: 2
                    }}
                    spellCheck={false}
                    autoFocus
                    placeholder="在此编辑代码..."
                  />
                ) : (
                  <div onClick={() => setIsEditing(true)} className="cursor-text h-full">
                    <pre 
                      ref={codeRefDesktop}
                      className={`!bg-transparent !p-0 !m-0 text-sm font-mono leading-relaxed ${
                        mode === 'dark' ? 'text-white' : 'text-slate-950'
                      } ${getLanguageClass(codeType)}`}
                      style={{ 
                        whiteSpace: 'pre-wrap', 
                        wordWrap: 'break-word', 
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere',
                        background: 'transparent',
                        lineHeight: '1.7'
                      }}
                    >
                      <code>{editedCode}</code>
                    </pre>
                    <p className={`text-xs mt-3 flex items-center gap-1 ${
                      mode === 'dark' ? 'text-gray-500' : 'text-black'
                    }`}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      点击编辑代码
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        ${mode === 'light' ? `
          /* Light theme - all black for readability */
          .prism-tomorrow .token,
          .prism-tomorrow .token.operator,
          .prism-tomorrow .token.comment,
          .prism-tomorrow .token.prolog,
          .prism-tomorrow .token.doctype,
          .prism-tomorrow .token.cdata,
          .prism-tomorrow .token.punctuation,
          .prism-tomorrow .token.property,
          .prism-tomorrow .token.tag,
          .prism-tomorrow .token.boolean,
          .prism-tomorrow .token.number,
          .prism-tomorrow .token.constant,
          .prism-tomorrow .token.symbol,
          .prism-tomorrow .token.deleted,
          .prism-tomorrow .token.selector,
          .prism-tomorrow .token.attr-name,
          .prism-tomorrow .token.string,
          .prism-tomorrow .token.char,
          .prism-tomorrow .token.builtin,
          .prism-tomorrow .token.inserted,
          .prism-tomorrow .token.atrule,
          .prism-tomorrow .token.attr-value,
          .prism-tomorrow .token.keyword,
          .prism-tomorrow .token.function,
          .prism-tomorrow .token.class-name,
          .prism-tomorrow .token.regex,
          .prism-tomorrow .token.important,
          .prism-tomorrow .token.variable {
            color: #000000 !important;
          }
          /* Override prism theme for light mode */
          pre[class*="language-"],
          code[class*="language-"] {
            background: transparent !important;
          }
        ` : ''}
      `}</style>
      <div className="block lg:hidden h-[calc(100vh-200px)] min-h-[500px]">
        <div className={`h-full rounded-xl overflow-hidden border-2 ${
          mode === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {mobileView === 'preview' && <MobilePreviewView />}
          {mobileView === 'code-view' && <MobileCodeView />}
        </div>
      </div>
      <DesktopView />
    </>
  );
}
