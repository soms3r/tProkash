/* Database interface — no ORM, no SQL, no migrations */

export interface ConnectionConfig {
  url: string;
  maxRetries?: number;
  timeout?: number;
}

export interface DatabaseAdapter {
  connect(config: ConnectionConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

export const createAdapter = (): DatabaseAdapter => {
  let connected = false;

  return {
    async connect(_config: ConnectionConfig): Promise<void> {
      connected = true;
    },

    async disconnect(): Promise<void> {
      connected = false;
    },

    isConnected(): boolean {
      return connected;
    },
  };
};
