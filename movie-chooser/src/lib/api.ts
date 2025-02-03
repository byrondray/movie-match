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

export const createMovieSessionOptions = {
  mutationFn: async ({ created_by }: { created_by: string }) => {
    const response = await api.movieSessions.create.$post({
      json: { created_by },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        'error' in errorData
          ? errorData.error
          : 'Failed to create movie session'
      );
    }
    return response.json();
  },
};

export const addParticipantOptions = {
  mutationFn: async ({
    sessionId,
    user_id,
  }: {
    sessionId: number;
    user_id: string;
  }) => {
    const response = await api.movieSessions[':sessionId'].participants.$post({
      param: { sessionId: sessionId.toString() },
      json: { user_id },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        'error' in errorData ? errorData.error : 'Failed to add participant'
      );
    }
    return response.json();
  },
};

export const addMovieSelectionOptions = {
  mutationFn: async ({
    sessionId,
    user_id,
    movie_id,
  }: {
    sessionId: number;
    user_id: string;
    movie_id: number;
  }) => {
    const response = await api.movieSessions[':sessionId'].selections.$post({
      param: { sessionId: sessionId.toString() },
      json: { user_id, movie_id },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        'error' in errorData ? errorData.error : 'Failed to add movie selection'
      );
    }
    return response.json();
  },
};

export const getMovieSessionOptions = (sessionId: number) => ({
  queryKey: ['movie-session', sessionId],
  queryFn: async () => {
    const response = await api.movieSessions[':sessionId'].$get({
      param: { sessionId: sessionId.toString() },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch movie session');
    }
    return response.json();
  },
  staleTime: Infinity,
});

export const getAllGenresOptions = {
  queryKey: ['genres-all'],
  queryFn: async () => {
    const response = await api.genres.all.$get();
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    return response.json();
  },
  staleTime: Infinity,
};

export const getGenreByIdOptions = (id: string) => ({
  queryKey: ['genre', id],
  queryFn: async () => {
    const response = await api.genres[':id'].$get({
      param: { id },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch genre');
    }
    return response.json();
  },
  staleTime: Infinity,
});

export const searchGenreOptions = (genre: string) => ({
  queryKey: ['genre-search', genre],
  queryFn: async () => {
    const response = await api.genres.search[':genre'].$get({
      param: { genre },
    });
    if (!response.ok) {
      throw new Error('Failed to search genre');
    }
    return response.json();
  },
  staleTime: Infinity,
});

export const getUserGenresOptions = (userId: string) => ({
  queryKey: ['user-genres', userId],
  queryFn: async () => {
    const response = await api.genres[':userId'].$get({
      param: { userId },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user genres');
    }
    return response.json();
  },
  staleTime: Infinity,
});

export const addUserGenreOptions = {
  mutationFn: async ({
    userId,
    genreId,
  }: {
    userId: string;
    genreId: string;
  }) => {
    const response = await api.genres.add.$post({
      json: { userId, genreId },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        'error' in errorData ? errorData.error : 'Failed to add user genre'
      );
    }
    return response.json();
  },
};

export const removeUserGenreOptions = {
  mutationFn: async ({
    userId,
    genreId,
  }: {
    userId: string;
    genreId: string;
  }) => {
    const response = await api.genres.remove.$post({
      json: { userId, genreId },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        'error' in errorData ? errorData.error : 'Failed to remove user genre'
      );
    }
    return response.json();
  },
};

// Movie Queries
export const getMovieByIdOptions = (id: number) => ({
  queryKey: ['movie', id],
  queryFn: async () => {
    const response = await api.movies[':id'].$get({
      param: { id: id.toString() },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }
    return response.json();
  },
  staleTime: Infinity,
});

export const addMovieOptions = {
  mutationFn: async ({
    title,
    genre,
    releaseDate,
  }: {
    title: string;
    genre: string;
    releaseDate: string;
  }) => {
    const response = await api.movies.add.$post({
      json: { title, genre, releaseDate },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        'error' in errorData ? errorData.error : 'Failed to add movie'
      );
    }
    return response.json();
  },
};
