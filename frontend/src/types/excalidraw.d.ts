declare module '@excalidraw/excalidraw' {
  export * from '@excalidraw/excalidraw/types';
}

interface Window {
  EXCALIDRAW_ASSET_PATH: string;
}

declare global {
  interface Process {
    env: {
      NODE_ENV: string;
      REACT_APP_BACKEND_V2_GET_URL?: string;
      REACT_APP_BACKEND_V2_POST_URL?: string;
      [key: string]: string | undefined;
    };
  }
  
  var process: Process;
}