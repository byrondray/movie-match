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
