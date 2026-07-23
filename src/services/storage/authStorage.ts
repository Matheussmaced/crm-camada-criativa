import { createRecordStore } from "./createRecordStore";
import { STORAGE_KEYS } from "./keys";

export interface AuthSession {
  isAuthenticated: boolean;
  email: string | null;
}

export const DEFAULT_AUTH_SESSION: AuthSession = {
  isAuthenticated: false,
  email: null,
};

export const authStore = createRecordStore<AuthSession>(STORAGE_KEYS.auth, DEFAULT_AUTH_SESSION);
