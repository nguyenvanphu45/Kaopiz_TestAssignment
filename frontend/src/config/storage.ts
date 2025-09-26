export const KEY_LOCAL_STORAGE = {
    ACCESS_TOKEN: 'access_token',
    USER_DATA: 'user_data',
    REFRESH_TOKEN: 'refresh_token'
} as const;

// Local Storage
export const getLocalStorage = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('Error getting from localStorage:', error);
        return null;
    }
};

export const setLocalStorage = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error('Error setting localStorage:', error);
    }
};

export const removeLocalStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};

export const clearAuthStorage = (): void => {
  removeLocalStorage(KEY_LOCAL_STORAGE.ACCESS_TOKEN);
  removeLocalStorage(KEY_LOCAL_STORAGE.USER_DATA);
  removeLocalStorage(KEY_LOCAL_STORAGE.REFRESH_TOKEN);
};