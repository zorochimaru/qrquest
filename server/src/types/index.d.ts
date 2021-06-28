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
      PORT?: string = 5000;
      DB_PORT?: number,
      EMIAL_SECRET: string,
      DOMAIN: string
    }
  }
}