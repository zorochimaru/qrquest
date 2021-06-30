export {}

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      DB_PORT: number,
      DB_BASE: string,
      DB_USERNAME: string,
      DB_PASS: string,
      EMAIL_SECRET: string,
      JWT_SECRET: string,
      HOST: string
    }
  }
}