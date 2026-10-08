import { Platform } from 'react-native';
import { ApiResponse } from '../types';

// In development, default to localhost (or 10.0.2.2 on Android emulator)
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${DEFAULT_HOST}:3001`;

export async function requestApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s network timeout

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
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
    return {
      success: false,
      data: null,
      error: {
        code: err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: err.message || 'Network request failed',
      },
    };
  }
}
