
import React, { useEffect, useState } from 'react';
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import { Loader2, Save, Share } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface DrawingBoardProps {
  roomId?: string;
  isCollaborative?: boolean;
}

const DrawingBoard: React.FC<DrawingBoardProps> = ({ 
  roomId = 'default-room',
  isCollaborative = false 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  // Initialize collaborative editing
  useEffect(() => {
    if (isCollaborative && !yDoc) {
      const doc = new Y.Doc();
      setYDoc(doc);
      
      // Replace with your actual backend websocket URL
      const websocketProvider = new WebsocketProvider(
        'ws://localhost:1234', // Replace with your actual websocket endpoint
        `excalidraw-${roomId}`,
        doc
      );
      
      websocketProvider.on('status', (event: { status: string }) => {
        console.log('Collaboration status:', event.status);
      });
      
      setProvider(websocketProvider);
      
      return () => {
        if (websocketProvider) {
          websocketProvider.disconnect();
        }
        doc.destroy();
      };
    }
  }, [isCollaborative, roomId]);

  const handleSaveDrawing = async () => {
    if (!excalidrawAPI) return;
    
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      
      // Create a blob from the drawing - fixed to match ExportOpts type
      const blob = await exportToBlob({
        elements,
        appState: {
          ...appState,
          exportWithDarkMode: appState.theme === 'dark',
        },
        files: {}, // This was missing and causing the error
        mimeType: 'image/png',
      });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success('Drawing saved successfully');
    } catch (error) {
      console.error('Error saving drawing:', error);
      toast.error('Failed to save drawing');
    }
  };

  const handleShareDrawing = () => {
    if (!excalidrawAPI) return;
    
    try {
      // Generate a more specific room ID
      const specificRoomId = `${roomId}-${Date.now()}`;
      
      // Build the shareable URL
      const shareableUrl = `${window.location.origin}/app?tab=drawing&roomId=${specificRoomId}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareableUrl);
      
      toast.success('Share link copied to clipboard');
    } catch (error) {
      console.error('Error sharing drawing:', error);
      toast.error('Failed to share drawing');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-card rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-medium">Drawing Board</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleSaveDrawing}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleShareDrawing}>
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        <div className="w-full h-full">
          <Excalidraw
            excalidrawAPI={(api) => {
              setExcalidrawAPI(api);
              setIsLoading(false);
            }}
            initialData={{
              appState: {
                viewBackgroundColor: "#ffffff",
              },
            }}
            theme="light"
            UIOptions={{
              canvasActions: {
                loadScene: false,
                export: false,
                saveToActiveFile: false,
                clearCanvas: true,
                saveAsImage: true,
                toggleTheme: false,
                changeViewBackgroundColor: false,
              },
            }}
            renderTopRightUI={null}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawingBoard;
