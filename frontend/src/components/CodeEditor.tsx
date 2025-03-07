
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Monaco editor will be loaded dynamically
interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
}

const CodeEditor: React.FC<EditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  className,
  placeholder
}) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [monaco, setMonaco] = useState<any>(null);
  const [editor, setEditor] = useState<any>(null);

  // Dynamically load Monaco editor
  useEffect(() => {
    import('monaco-editor/esm/vs/editor/editor.api')
      .then(monaco => {
        setMonaco(monaco);
        setIsEditorReady(true);
      })
      .catch(error => {
        console.error('Failed to load Monaco editor:', error);
        toast.error('Failed to load code editor');
      });

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, []);

  // Initialize editor after Monaco is loaded
  useEffect(() => {
    if (isEditorReady && containerRef.current && !editor) {
      // Configure Monaco editor
      const newEditor = monaco.editor.create(containerRef.current, {
        value: value || placeholder || '',
        language,
        theme: 'vs-dark',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        readOnly,
        folding: true,
        wordWrap: 'on',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontLigatures: true,
        smoothScrolling: true,
        contextmenu: true,
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        padding: { top: 16, bottom: 16 },
      });
      
      // Track editor content changes
      newEditor.onDidChangeModelContent(() => {
        const newValue = newEditor.getValue();
        onChange(newValue);
      });
      
      setEditor(newEditor);
    }
  }, [isEditorReady, containerRef, monaco, editor, value, language, readOnly, onChange, placeholder]);

  return (
    <div className={cn("relative h-full w-full rounded-md overflow-hidden", className)}>
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-editor-lighter">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
      
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};

export default CodeEditor;
