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

  private initSocket() {
    if (this.socket) {
      // Clean up existing connection first
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    // Connect to the /code namespace
    this.socket = io(`${this.API_URL}/code`, {
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 60000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket disconnected:', reason);
      setTimeout(() => this.initSocket(), 2000);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    this.socket.onAny((event, ...args) => {
      console.log(`📥 Received event: ${event}`, args);
    });
  }

  public processCode(data: CodeRequest): Promise<any> {
    if (!this.socket?.connected) {
      console.warn('⚠️ Socket is not connected! Reconnecting...');
      this.initSocket();
    }

    return new Promise((resolve, reject) => {
      console.log(`🚀 Sending ${data.action} request:`, data);
      
      let isResolved = false;
      const timeout = setTimeout(() => {
        if (!isResolved) {
          console.error('⏰ Request timed out for action:', data.action);
          reject(new Error('Request timed out'));
        }
      }, 60000);
      
      const responseHandler = (response: any) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeout);
        console.log(`📥 Received ${data.action} response:`, response);
        
        if (response?.status === 'error') {
          reject(response.message);
        } else {
          resolve(response);
        }
      };

      this.socket?.once(data.action, responseHandler);
      
      this.socket?.emit(data.action, data, (ack: any) => {
        if (ack && !isResolved) {
          responseHandler(ack);
        }
      });
    });
  }

  public subscribeToExplain(callback: (data: any) => void): () => void {
    if (!this.socket?.connected) {
      this.initSocket();
    }

    const handler = (data: any) => {
      console.log('📥 Received explain:', data);
      try {
        callback(data);
      } catch (err) {
        console.error('Error in explain callback:', err);
      }
    };

    this.socket?.off('explain', handler);
    this.socket?.on('explain', handler);
    
    const errorHandler = (error: any) => {
      console.error('❌ Explain error:', error);
      callback({ status: 'error', message: error.message || 'Failed to get explanation' });
    };
    
    this.socket?.on('error', errorHandler);

    return () => {
      this.socket?.off('explain', handler);
      this.socket?.off('error', errorHandler);
    };
  }

  public subscribeToAnalyze(callback: (data: any) => void): () => void {
    if (!this.socket?.connected) {
      this.initSocket();
    }

    const handler = (data: any) => {
      console.log('📥 Received analysis:', data);
      try {
        callback(data);
      } catch (err) {
        console.error('Error in analysis callback:', err);
      }
    };

    this.socket?.off('analyze', handler);
    this.socket?.on('analyze', handler);

    return () => {
      this.socket?.off('analyze', handler);
    };
  }

  public subscribeToRefactor(callback: (data: any) => void): () => void {
    if (!this.socket?.connected) {
      this.initSocket();
    }

    const handler = (data: any) => {
      console.log('📥 Received refactor:', data);
      try {
        callback(data);
      } catch (err) {
        console.error('Error in refactor callback:', err);
      }
    };

    this.socket?.off('refactor', handler);
    this.socket?.on('refactor', handler);

    return () => {
      this.socket?.off('refactor', handler);
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;
