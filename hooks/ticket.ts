import { Ticket } from '@/models/ticket';
import { getTicket } from '@/service/ticket_services';
import { useEffect, useState } from 'react';

export const useTicket = (userId: string) => {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTicket(userId);

      if (response.success) {
        // Parsing sesuai model Ticket
        const parsedData: Ticket[] = response.data.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          title: item.title,
          description: item.description,
          category: item.category,
          image: item.image,
          status: item.status,
          admin_response: item.admin_response,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        setData(parsedData);
      } else {
        setError(response.success || 'Gagal mengambil data tiket');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTicket();
    }
  }, [userId]);

  return { data, loading, error, refetch: fetchTicket };
};
