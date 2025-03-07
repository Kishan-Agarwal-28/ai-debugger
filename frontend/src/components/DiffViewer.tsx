
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
  className?: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  original,
  modified,
  language = 'javascript',
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [monaco, setMonaco] = useState<any>(null);
  const [diffEditor, setDiffEditor] = useState<any>(null);

  // Dynamically load Monaco editor
  useEffect(() => {
    import('monaco-editor/esm/vs/editor/editor.api')
      .then(monaco => {
        setMonaco(monaco);
        setIsEditorReady(true);
      })
      .catch(error => {
        console.error('Failed to load Monaco diff editor:', error);
      });

    return () => {
      if (diffEditor) {
        diffEditor.dispose();
      }
    };
  }, []);

  // Initialize diff editor after Monaco is loaded
  useEffect(() => {
    if (isEditorReady && containerRef.current && !diffEditor) {
      // Configure Monaco diff editor
      const editor = monaco.editor.createDiffEditor(containerRef.current, {
        theme: 'vs-dark',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        readOnly: true,
        renderSideBySide: true,
        wordWrap: 'on',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontLigatures: true,
        smoothScrolling: true,
        contextmenu: true,
        renderLineHighlight: 'all',
        padding: { top: 16, bottom: 16 },
      });
      
      // Set original and modified models
      const originalModel = monaco.editor.createModel(original, language);
      const modifiedModel = monaco.editor.createModel(modified, language);
      
      editor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
      
      setDiffEditor(editor);
    }
  }, [isEditorReady, containerRef, monaco, diffEditor, original, modified, language]);

  // Update models when content changes
  useEffect(() => {
    if (diffEditor && monaco) {
      const originalModel = diffEditor.getOriginalEditor().getModel();
      const modifiedModel = diffEditor.getModifiedEditor().getModel();
      
      if (originalModel && modifiedModel) {
        originalModel.setValue(original);
        modifiedModel.setValue(modified);
      }
    }
  }, [original, modified, diffEditor, monaco]);

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

export default DiffViewer;
