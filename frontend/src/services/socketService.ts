import { io, Socket } from 'socket.io-client';

export type CodeActionType = 'explain' | 'analyze' | 'refactor';

export interface CodeRequest {
  code: string;
  action: CodeActionType;
  error?: string;
}

export interface SocketResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
}

class SocketService {
  private socket: Socket | null = null;
  private API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  constructor() {
    this.initSocket();
  }

  // Fix: Add namespace to match backend
  private initSocket() {
    if (!this.socket) {
      this.socket = io(`${this.API_URL}/code`, {
        autoConnect: true,
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
  }

  public processCode(data: CodeRequest): void {
    if (!this.socket?.connected) {
      this.initSocket();
    }
    
    console.log(`Sending ${data.action} request to server`);
    console.log(data)
    this.socket?.emit(data.action, data);
  }

  public subscribeToExplain(callback: (data: any) => void): () => void {
    const handler = (data: any) => callback(data);
    this.socket?.on('explain', handler);
    return () => {
      this.socket?.off('explain', handler);
    };
  }

  public subscribeToAnalyze(callback: (data: any) => void): () => void {
    const handler = (data: any) => callback(data);
    this.socket?.on('analyze', handler);
    return () => {
      this.socket?.off('analyze', handler);
    };
  }

  public subscribeToRefactor(callback: (data: any) => void): () => void {
    const handler = (data: any) => callback(data);
    this.socket?.on('refactor', handler);
    return () => {
      this.socket?.off('refactor', handler);
    };
  }

  public disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;
