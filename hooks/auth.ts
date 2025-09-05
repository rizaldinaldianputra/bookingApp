import { useAuth } from '@/context/AuthContext';
import { LoginResponse } from '@/models/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { appleLogin, googleLogin, login } from '../service/auth_service';

export default function AuthHook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { login: saveLogin } = useAuth(); // ambil login dari context

  const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);

      // simpan token di context
      await saveLogin(res.token, res.user);

      // pindah ke home
      router.replace('/home/main');
      return res;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleLogin(email, password);
      await saveLogin(res.token, res.user);
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
      await saveLogin(res.token, res.user);
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
