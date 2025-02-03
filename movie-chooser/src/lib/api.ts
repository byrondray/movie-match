import { client } from '../routes/_authenticated/index';
import { queryOptions } from '@tanstack/react-query';

export const api = client.api;

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: fetchProfile,
  staleTime: Infinity,
});

async function fetchProfile() {
  const c = await client.api.me.$get();
  const d = await c.json();
  return d;
}

export const friendsQueryOptions = (userId: string) => ({
  queryKey: ['friends', userId],
  queryFn: async () => {
    const response = await api.friends.list[':userId'].$get({
      param: { userId },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch friends');
    }
    return response.json();
  },
  staleTime: Infinity,
});

export const addFriendMutationOptions = {
  mutationFn: async ({
    userId,
    friendId,
  }: {
    userId: string;
    friendId: string;
  }) => {
    const response = await api.friends.add.$post({
      json: { userId, friendId },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        'error' in errorData ? errorData.error : 'Failed to add friend'
      );
    }
    return response.json();
  },
};

export const getFriendByEmailQueryOptions = (email: string) => ({
  queryKey: ['friend-by-email', email],
  queryFn: async () => {
    const response = await api.friends['get-by-email'][':email'].$get({
      param: { email },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch friend by email');
    }
    return response.json();
  },
});

