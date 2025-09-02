import { LoginResponse } from '@/models/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { appleLogin, googleLogin, login } from '../service/auth_service';
import { saveToken } from '../session/session';

export default function AuthHook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Login email/password
  const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);
      await saveToken(res.token);
      router.replace('/home/main');
      return res;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login Google
  const handleLoginGoogle = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleLogin(email, password);
      await saveToken(res.token);
      return res;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleLoginApple = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await appleLogin(email, password);
      await saveToken(res.token);
      return res;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleLoginGoogle, handleLoginApple, loading, error };
}
