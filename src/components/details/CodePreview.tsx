import { useState, useEffect, useRef } from 'react';
import { Edit3, Eye, Copy, Check } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css';

interface CodePreviewProps {
  code: string;
  language?: string;
}

export default function CodePreview({ code, language = 'html' }: CodePreviewProps) {
  const { mode } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setEditedCode(code);
    updatePreview(code);
  }, [code]);

  const updatePreview = (htmlCode: string) => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlCode);
        doc.close();
      }
    }
  };

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [editedCode, isEditing]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setEditedCode(newCode);
    updatePreview(newCode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageClass = () => {
    switch (language) {
      case 'typescript':
      case 'ts':
        return 'language-ts';
      case 'tsx':
        return 'language-tsx';
      case 'css':
        return 'language-css';
      case 'javascript':
      case 'js':
        return 'language-javascript';
      default:
        return 'language-markup';
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-xl overflow-hidden ${
      mode === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex-1 flex flex-col min-h-[300px] lg:min-h-0">
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          mode === 'dark' ? 'border-white/10 bg-black/20' : 'border-black/10 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className={`text-xs font-medium ml-2 ${
              mode === 'dark' ? 'text-white/50' : 'text-gray-500'
            }`}>
              代码编辑器
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${
                mode === 'dark'
                  ? 'hover:bg-white/10 text-white/60 hover:text-white'
                  : 'hover:bg-black/10 text-gray-500 hover:text-gray-900'
              }`}
              title="复制代码"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isEditing
                  ? 'bg-indigo-600 text-white'
                  : mode === 'dark'
                    ? 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                    : 'bg-black/10 text-gray-500 hover:text-gray-900 hover:bg-black/20'
              }`}
            >
              {isEditing ? <Eye size={14} /> : <Edit3 size={14} />}
              {isEditing ? '预览' : '编辑'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isEditing ? (
            <textarea
              value={editedCode}
              onChange={handleCodeChange}
              className={`w-full h-full min-h-[200px] font-mono text-sm outline-none resize-none rounded-lg p-4 ${
                mode === 'dark'
                  ? 'bg-gray-800 text-gray-100'
                  : 'bg-gray-100 text-gray-900'
              }`}
              spellCheck={false}
            />
          ) : (
            <pre className={`${getLanguageClass()} !bg-transparent !p-0 !m-0 text-sm font-mono`}>
              <code ref={codeRef} className={getLanguageClass()}>
                {editedCode}
              </code>
            </pre>
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-h-[250px] lg:min-h-0 border-t lg:border-t-0 lg:border-l ${
        mode === 'dark' ? 'border-white/10' : 'border-black/10'
      }`}>
        <div className={`flex items-center gap-2 px-4 py-3 border-b ${
          mode === 'dark' ? 'border-white/10 bg-black/20' : 'border-black/10 bg-gray-50'
        }`}>
          <span className={`text-xs font-medium ${
            mode === 'dark' ? 'text-white/50' : 'text-gray-500'
          }`}>
            实时预览
          </span>
          {!isEditing && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">
              同步更新
            </span>
          )}
        </div>

        <div className="flex-1 bg-white rounded-br-xl overflow-hidden">
          <iframe
            ref={iframeRef}
            title="preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>
    </div>
  );
}
