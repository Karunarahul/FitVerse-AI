import { storage } from './storage';
import { UserProfile } from '../types';
import { demoUser } from '../utils/demoData';

export const authService = {
  async login(email: string, pass: string): Promise<{ token: string; user: UserProfile }> {
    // If demo credentials or regular entry, authenticate seamlessly
    const token = `fitverse_jwt_${Date.now()}`;
    const user: UserProfile = {
      ...demoUser,
      email: email || demoUser.email,
    };
    await storage.setItem(storage.KEYS.AUTH_TOKEN, token);
    await storage.setItem(storage.KEYS.USER_PROFILE, user);
    return { token, user };
  },

  async register(name: string, email: string): Promise<{ token: string; user: UserProfile }> {
    const token = `fitverse_jwt_${Date.now()}`;
    const user: UserProfile = {
      ...demoUser,
      id: `usr_${Date.now()}`,
      name: name || 'Athlete',
      email: email || 'athlete@fitverse.ai',
    };
    await storage.setItem(storage.KEYS.AUTH_TOKEN, token);
    await storage.setItem(storage.KEYS.USER_PROFILE, user);
    return { token, user };
  },

  async logout(): Promise<void> {
    await storage.removeItem(storage.KEYS.AUTH_TOKEN);
    // keep profile or wipe as appropriate
  },

  async getSession(): Promise<{ token: string | null; user: UserProfile | null }> {
    const token = await storage.getItem<string>(storage.KEYS.AUTH_TOKEN);
    const user = await storage.getItem<UserProfile>(storage.KEYS.USER_PROFILE);
    return { token, user };
  },
};
