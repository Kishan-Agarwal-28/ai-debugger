import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CodeEditor from '@/components/CodeEditor';
import DiffViewer from '@/components/DiffViewer';
import TextEditor from '@/components/TextEditor';
import DrawingBoard from '@/components/DrawingBoard';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import socketService, { CodeActionType } from '@/services/socketService';
import { 
  Loader2, Play, Code, PanelRightClose, PanelRightOpen, 
  FileText, PencilRuler, Terminal, ThumbsUp, X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

type TabType = 'code' | 'notes' | 'drawing' | 'output';

const Index = () => {
  // State for the code editor
  const [code, setCode] = useState('// Enter your code here\n\nfunction example() {\n  console.log("Hello, world!");\n  \n  // Add more code here\n  for (let i = 0; i < 10; i++) {\n    console.log(i);\n  }\n}');
  const [language, setLanguage] = useState('javascript');
  const [activeOption, setActiveOption] = useState<CodeActionType>('explain');
  const [explanation, setExplanation] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('code');
  const [roomId, setRoomId] = useState(`room-${Date.now()}`);
  const { output, isRunning, runCode } = useCodeExecution();
  const [isProcessing, setIsProcessing] = useState(false);

  // Add this loading indicator component
  const LoadingIndicator = () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-code-blue border-t-transparent" />
        <p className="text-sm text-muted-foreground">Processing your request...</p>
      </div>
    </div>
  );

  // Add error display component
  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-full">
      <div className="text-destructive text-center p-4">
        <X className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );

  // Listen for socket responses
  useEffect(() => {
    const unsubscribeExplain = socketService.subscribeToExplain((data) => {
      console.log('Explanation received:', data);
      setIsAnalyzing(false);
      
      if (typeof data === 'string') {
        // Direct string response
        setExplanation(data);
        return;
      }

      if (data.status === 'success') {
        setExplanation(data.data || 'No explanation provided');
        toast.success('Code explanation received');
      } else {
        setError(data.message || 'Failed to get explanation');
        toast.error('Explanation failed');
      }
    });

    const unsubscribeAnalyze = socketService.subscribeToAnalyze((data) => {
      console.log('Raw analysis data received:', data); // Debug log
      setIsAnalyzing(false);
      
      if (typeof data === 'string') {
        // Handle string response
        setExplanation(data);
        toast.success('Analysis complete');
        return;
      }

      // Handle object response
      if (data.status === 'success') {
        // Update both explanation and analysis
        const analysisText = data.data?.analysis || data.data || 'No analysis provided';
        setExplanation(analysisText);
        
        // If there's optimized code, set it
        if (data.data?.optimizedCode) {
          setOptimizedCode(data.data.optimizedCode);
        }
        
        toast.success('Code analysis complete');
      } else {
        const errorMessage = data.message || 'Failed to analyze code';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });

    const unsubscribeRefactor = socketService.subscribeToRefactor((data) => {
      console.log('Refactor received:', data);
      setIsAnalyzing(false);
      
      if (typeof data === 'string') {
        // Handle string response
        setOptimizedCode(data);
        setExplanation('Code has been refactored');
        toast.success('Code refactored');
        return;
      }

      // Handle object response
      if (data.status === 'success') {
        setOptimizedCode(data.data?.refactoredCode || data.data || '');
        setExplanation(data.data?.explanation || 'Code has been refactored to follow best practices');
        toast.success('Code refactored successfully');
      } else {
        setError(data.message || 'Failed to refactor code');
        toast.error('Refactoring failed');
      }
    });

    return () => {
      unsubscribeExplain();
      unsubscribeAnalyze();
      unsubscribeRefactor();
    };
  }, []);

  // Update the handleAnalyze function
  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }
    
    console.log(`Starting ${activeOption} operation...`);
    setIsAnalyzing(true);
    setError('');
    setExplanation('');
    setOptimizedCode('');
    
    try {
      const request = {
        code,
        action: activeOption,
        error: ''
      };
      console.log('Sending request:', request);
      
      await socketService.processCode(request);
      toast.success(`${activeOption} request sent successfully`);
    } catch (err) {
      console.error(`${activeOption} error:`, err);
      setError(typeof err === 'string' ? err : `An error occurred during ${activeOption}`);
      toast.error(`${activeOption} failed`);
      setIsAnalyzing(false);
    }
  }, [code, activeOption]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const handleRunCode = () => {
    if (activeTab === 'code') {
      runCode(code, language);
      setActiveTab('output');
    }
  };

  const handleOptionChange = (option: string) => {
    setActiveOption(option as CodeActionType);
  };

  return (
    <div className="flex flex-col h-screen bg-editor">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeOption={activeOption} onOptionChange={handleOptionChange} />
        
        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab navigation */}
          <div className="px-1 pt-1">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="code">
                    <Code className="h-4 w-4 mr-1" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="notes">
                    <FileText className="h-4 w-4 mr-1" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="drawing">
                    <PencilRuler className="h-4 w-4 mr-1" />
                    Drawing
                  </TabsTrigger>
                  <TabsTrigger value="output">
                    <Terminal className="h-4 w-4 mr-1" />
                    Output
                  </TabsTrigger>
                </TabsList>
                
                {activeTab === 'code' && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRunCode}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      Run
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="code" className="mt-0">
                {/* Code editor tab content */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-1 p-1 h-[calc(100vh-160px)]">
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
                        <LoadingIndicator />
                      ) : error ? (
                        <ErrorDisplay message={error} />
                      ) : activeOption === 'analyze' && explanation ? (
                        <div className="h-full overflow-auto">
                          <div className="p-4">
                            <div className="prose prose-invert max-w-none">
                              <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                              <pre className="whitespace-pre-wrap text-sm font-mono bg-editor-darker p-4 rounded-lg">
                                {explanation}
                              </pre>
                            </div>
                          </div>
                          {optimizedCode && (
                            <div className="mt-4 border-t border-white/10">
                              <div className="p-4">
                                <h3 className="text-lg font-medium mb-4">Suggested Improvements</h3>
                                <DiffViewer
                                  original={code}
                                  modified={optimizedCode}
                                  language={language}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : activeOption === 'explain' && explanation ? (
                        <div className="p-4 h-full overflow-auto">
                          <div className="prose prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap text-sm font-mono bg-editor-darker p-4 rounded-lg">
                              {explanation}
                            </pre>
                          </div>
                        </div>
                      ) : (activeOption === 'analyze' || activeOption === 'refactor') && optimizedCode ? (
                        <div className="h-full">
                          <DiffViewer
                            original={code}
                            modified={optimizedCode}
                            language={language}
                          />
                          {explanation && (
                            <div className="p-4 border-t border-white/10">
                              <pre className="whitespace-pre-wrap text-sm font-mono bg-editor-darker p-4 rounded-lg">
                                {explanation}
                              </pre>
                            </div>
                          )}
                        </div>
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
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <div className="h-[calc(100vh-160px)] p-1">
                  <TextEditor />
                </div>
              </TabsContent>

              <TabsContent value="drawing" className="mt-0">
                <div className="h-[calc(100vh-160px)] p-1">
                  <DrawingBoard roomId={roomId} isCollaborative={true} />
                </div>
              </TabsContent>

              <TabsContent value="output" className="mt-0">
                <div className="h-[calc(100vh-160px)] p-1">
                  <div className="h-full rounded-lg overflow-hidden border border-white/10 bg-editor-lighter">
                    <div className="flex items-center justify-between p-2 border-b border-white/10">
                      <h2 className="text-sm font-medium">Code Output</h2>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setActiveTab('code')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-2 h-[calc(100%-40px)] overflow-auto bg-black font-mono text-sm">
                      {isRunning ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Running code...
                        </div>
                      ) : output ? (
                        <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
                      ) : (
                        <div className="text-muted-foreground">Run your code to see output here</div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
