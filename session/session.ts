// src/session/session.ts
import { User } from '@/models/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Token
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

// User
export const saveUser = async (user: User) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const json = await AsyncStorage.getItem(USER_KEY);
  return json ? (JSON.parse(json) as User) : null;
};

export const removeUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};

// Clear all
export const clearSession = async () => {
  await removeToken();
  await removeUser();
};
