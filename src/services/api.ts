import { Platform } from 'react-native';
import { ApiResponse } from '../types';
import { supabase } from './supabase';
import { storage } from './storage';

// Determine default local host
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const FALLBACK_LOCAL_URL = `http://${DEFAULT_HOST}:3001`;

// Production HTTPS API URL from environment, or fallback
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || FALLBACK_LOCAL_URL;

export interface RequestApiOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Universal authenticated API client for FitVerse AI.
 * Automatically attaches Supabase session Bearer token and handles timeouts.
 */
export async function requestApi<T>(
  endpoint: string,
  options: RequestApiOptions = {}
): Promise<ApiResponse<T>> {
  const timeoutMs = options.timeoutMs || 15000; // 15s default for AI endpoints
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${API_BASE_URL}${endpoint}`;

    // Resolve Authorization token
    let token: string | null = null;
    try {
      const { data } = await supabase.auth.getSession();
      token = data?.session?.access_token || null;
    } catch {}

    if (!token) {
      token = await storage.getItem<string>(storage.KEYS.AUTH_TOKEN);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr: any = null;
      try {
        parsedErr = JSON.parse(errText);
      } catch {}

      return {
        success: false,
        data: null,
        error: parsedErr?.error || {
          code: `HTTP_${response.status}`,
          message: `Server returned status ${response.status}`,
        },
      };
    }

    const json = await response.json();
    return json;
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    return {
      success: false,
      data: null,
      error: {
        code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: isTimeout
          ? 'Network request timed out. Please check server connectivity.'
          : err.message || 'Unable to communicate with FitVerse backend server.',
      },
    };
  }
}
