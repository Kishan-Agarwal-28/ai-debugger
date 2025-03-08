
import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { Loader2 } from 'lucide-react';

interface TextEditorProps {
  onChange?: (data: any) => void;
  initialData?: string;
  readOnly?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  onChange, 
  initialData = '',
  readOnly = false 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [markdown, setMarkdown] = useState(initialData);
  const mdParser = new MarkdownIt();

  useEffect(() => {
    // Simulate loading to match the behavior of the previous editor
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEditorChange = ({ text }: { text: string }) => {
    setMarkdown(text);
    if (onChange) {
      onChange(text);
    }
  };

  return (
    <div className="w-full h-full bg-background rounded-md overflow-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <MdEditor
          style={{ height: '100%', border: 'none' }}
          value={markdown}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
          view={{ menu: true, md: true, html: false }}
          canView={{ menu: true, md: true, html: true, fullScreen: false, hideMenu: true }}
          readOnly={readOnly}
          placeholder="Write your markdown here..."
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export default TextEditor;
