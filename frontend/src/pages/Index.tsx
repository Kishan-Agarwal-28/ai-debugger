
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CodeEditor from '@/components/CodeEditor';
import DiffViewer from '@/components/DiffViewer';
import { analyzeCode, explainCode, refactorCode } from '@/utils/codeAnalysis';
import { Loader2, Play, Code, PanelRightClose, PanelRightOpen } from 'lucide-react';

const Index = () => {
  const [code, setCode] = useState('// Enter your code here\n\nfunction example() {\n  console.log("Hello, world!");\n  \n  // Add more code here\n  for (let i = 0; i < 10; i++) {\n    console.log(i);\n  }\n}');
  const [language, setLanguage] = useState('javascript');
  const [activeOption, setActiveOption] = useState('explain');
  const [explanation, setExplanation] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      if (activeOption === 'explain') {
        const result = await explainCode(code, language);
        setExplanation(result);
        setOptimizedCode('');
      } else if (activeOption === 'refactor') {
        const result = await refactorCode(code, language);
        setOptimizedCode(result);
        setExplanation('Code has been refactored to follow best practices.');
      } else if (activeOption === 'analyze') {
        const result = await analyzeCode(code, language);
        setExplanation(result.explanation);
        setOptimizedCode(result.suggestions[0]?.code || '');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('An error occurred during analysis. Please try again.');
      toast.error('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <div className="flex flex-col h-screen bg-editor">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeOption={activeOption} onOptionChange={setActiveOption} />
        
        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Code input area */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
            <div className="flex flex-col h-full rounded-lg overflow-hidden border border-white/10 bg-editor-lighter animate-fadeIn">
              <div className="flex items-center justify-between p-2 border-b border-white/10">
                <h2 className="text-sm font-medium">Code Editor</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-muted text-xs rounded px-2 py-1 border border-white/10"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                  </select>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-1 bg-code-blue hover:bg-opacity-80 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        <span>Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                />
              </div>
            </div>
            
            {/* Output panel */}
            <div className={`flex flex-col h-full rounded-lg overflow-hidden border border-white/10 bg-editor-lighter transition-all duration-300 ease-in-out ${showPanel ? 'opacity-100' : 'opacity-0 md:opacity-100'} animate-fadeIn`}>
              <div className="flex items-center justify-between p-2 border-b border-white/10">
                <h2 className="text-sm font-medium">
                  {activeOption === 'explain' ? 'Explanation' : activeOption === 'refactor' ? 'Refactored Code' : 'Analysis'}
                </h2>
                <button
                  onClick={togglePanel}
                  className="md:hidden text-muted-foreground hover:text-foreground"
                >
                  {showPanel ? (
                    <PanelRightClose className="h-4 w-4" />
                  ) : (
                    <PanelRightOpen className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className={`flex-1 overflow-hidden ${!showPanel && 'md:block hidden'}`}>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <p className="text-sm text-muted-foreground">Analyzing your code...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-destructive text-center p-4">
                      <p>{error}</p>
                    </div>
                  </div>
                ) : activeOption === 'explain' && explanation ? (
                  <div className="p-4 h-full overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{explanation}</pre>
                  </div>
                ) : optimizedCode ? (
                  <DiffViewer
                    original={code}
                    modified={optimizedCode}
                    language={language}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center max-w-md p-4">
                      <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <h3 className="text-lg font-medium mb-1">Ready to analyze your code</h3>
                      <p className="text-sm">Click the Analyze button to get insights about your code.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Input area at the bottom */}
          <div className="border-t border-white/10 p-3 bg-editor-lighter glass-panel">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter what error you are facing or ask a question about your code..."
                className="w-full bg-muted/50 border border-white/10 rounded-md py-2 px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-code-blue"
              />
              <button
                className="absolute right-1 top-1 bg-code-blue hover:bg-opacity-80 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                Ask
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
