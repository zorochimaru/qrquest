import User from "../models/user.model";

export { }

declare module 'express-session' {
  interface SessionData {
    logedUser: { user: User, refreshToken: string },
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
      HOST: string,
      SESSION_SECRET: string,
      SESSION_MAX_AGE: number,
    }
  }
}