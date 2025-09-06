import { useAuth } from '@/context/AuthContext';
import { LoginResponse } from '@/models/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { appleLogin, googleLogin, login } from '../service/auth_service';

export default function AuthHook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { login: saveLogin } = useAuth();

  const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);

      // simpan token di context
      await saveLogin(res.token, res.user);

      // pindah ke home
      router.replace('/home/main');

      // tahan loading sebentar biar indikator masih muncul sampai perpindahan
      setTimeout(() => setLoading(false), 500);
      return res;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const handleLoginGoogle = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleLogin(email, password);
      await saveLogin(res.token, res.user);
      router.replace('/home/main');
      setTimeout(() => setLoading(false), 500);
      return res;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const handleLoginApple = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await appleLogin(email, password);
      await saveLogin(res.token, res.user);
      router.replace('/home/main');
      setTimeout(() => setLoading(false), 500);
      return res;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { handleLogin, handleLoginGoogle, handleLoginApple, loading, error };
}
