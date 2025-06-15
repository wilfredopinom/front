import { useUser } from '@clerk/clerk-react';
import useSWR from 'swr';

export function useBackendUser() {
  const { user } = useUser();
  const clerkId = user?.id;

  const { data, error, isLoading } = useSWR(
    clerkId ? `/api/users/profile` : null,
    async (url) => {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('No user');
      return res.json();
    }
  );

  return { backendUser: data, error, isLoading };
}
