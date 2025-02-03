import {
  createKindeServerClient,
  GrantType,
  SessionManager,
  UserType,
  type UserProfile,
} from '@kinde-oss/kinde-typescript-sdk';
import { type Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { createFactory, createMiddleware } from 'hono/factory';

let store: { [key: string]: unknown } = {};

// Client for authorization code flow
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_ISSUER_URL!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    redirectURL: process.env.KINDE_REDIRECT_URL!,
    logoutRedirectURL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL!,
  }
);

// export const sessionManager: SessionManager = {
//   async getSessionItem(key: string) {
//     return store[key];
//   },
//   async setSessionItem(key: string, value: unknown) {
//     store[key] = value;
//   },
//   async removeSessionItem(key: string) {
//     delete store[key];
//   },
//   async destroySession() {
//     store = {};
//   },
// };

export const sessionManager = (c: Context): SessionManager => {
  return {
    async getSessionItem(key: string) {
      return getCookie(c, key);
    },
    async setSessionItem(key: string, value: unknown) {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      } as const;
      if (typeof value === 'string') {
        setCookie(c, key, value, cookieOptions);
      } else {
        setCookie(c, key, JSON.stringify(value), cookieOptions);
      }
    },
    async removeSessionItem(key: string) {
      deleteCookie(c, key);
    },
    async destroySession() {
      ['id_token', 'access_token', 'user', 'refresh_token'].forEach((key) => {
        deleteCookie(c, key);
      });
    },
  };
};

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);

    if (!isAuthenticated) {
      return c.json({ message: 'You are not authenticated' }, 401);
    }

    if (isAuthenticated) {
      const user = await kindeClient.getUser(manager);
      c.set('user', user);
      await next();
    }
  } catch (error) {
    console.error(error);
    return c.json({ message: 'You are not authenticated' }, 401);
  }
});
