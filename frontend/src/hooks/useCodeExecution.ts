
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface CustomWindow extends Window {
  console: Console;
  eval: (code: string) => any;
}

export const useCodeExecution = () => {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  const runCode = useCallback((code: string, language: string) => {
    if (!code.trim()) {
      toast.error('Please enter some code to run');
      return;
    }
    
    setIsRunning(true);
    setOutput('');
    
    // Currently only supports JavaScript
    if (language !== 'javascript' && language !== 'typescript') {
      setOutput(`Running ${language} code is not yet supported in this browser environment.`);
      setIsRunning(false);
      return;
    }
    
    try {
      // Create a sandbox iframe or use an existing one
      if (!iframeRef.current) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframeRef.current = iframe;
      }
      
      // Get the iframe window
      const iframeWindow = iframeRef.current.contentWindow as unknown as CustomWindow;
      if (!iframeWindow) {
        throw new Error('Could not access iframe window');
      }
      
      // Clear previous console outputs
      const outputs: string[] = [];
      
      // Override console methods
      const originalConsole = iframeWindow.console;
      iframeWindow.console = {
        ...originalConsole,
        log: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push(`[log] ${output}`);
          originalConsole.log(...args);
        },
        error: (...args: any[]) => {
          const output = args.map(arg => String(arg)).join(' ');
          outputs.push(`[error] ${output}`);
          originalConsole.error(...args);
        },
        warn: (...args: any[]) => {
          const output = args.map(arg => String(arg)).join(' ');
          outputs.push(`[warn] ${output}`);
          originalConsole.warn(...args);
        },
        info: (...args: any[]) => {
          const output = args.map(arg => String(arg)).join(' ');
          outputs.push(`[info] ${output}`);
          originalConsole.info(...args);
        },
      };
      
      // Execute the code
      iframeWindow.eval(`
        try {
          ${code}
        } catch (error) {
          console.error('Execution error:', error.message);
        }
      `);
      
      // Collect and display the output
      setOutput(outputs.join('\n'));
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`Error: ${error.message}`);
      } else {
        setOutput('An unknown error occurred');
      }
    }
    
    setIsRunning(false);
  }, []);
  
  return { output, isRunning, runCode };
};
