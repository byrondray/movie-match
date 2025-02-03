import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Toggle } from '../../components/ui/toggle';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';

import {
  userQueryOptions,
  getAllGenresOptions,
  getUserGenresOptions,
  addUserGenreOptions,
  removeUserGenreOptions,
} from '../../lib/api';

const GenrePreferencesPage = () => {
  const queryClient = useQueryClient();

  const { data: user, isError: isUserError } = useQuery(userQueryOptions);

  const {
    data: genresData,
    isLoading: isGenresLoading,
    isError: isGenresError,
  } = useQuery(getAllGenresOptions);

  const {
    data: userGenresData,
    isLoading: isUserGenresLoading,
    isError: isUserGenresError,
  } = useQuery({
    ...getUserGenresOptions(user?.id ?? ''),
    enabled: !!user?.id,
  });

  const addGenreMutation = useMutation({
    ...addUserGenreOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-genres', user?.id] });
    },
  });

  const removeGenreMutation = useMutation({
    ...removeUserGenreOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-genres', user?.id] });
    },
  });

  const isLoading = isGenresLoading || isUserGenresLoading;
  const isError = isUserError || isGenresError || isUserGenresError;

  const selectedGenres = new Set(
    userGenresData?.data?.map(
      (genre: { genreSchmea: { id: string } }) => genre.genreSchmea.id
    ) ?? []
  );

  const handleToggleGenre = async (genreId: string) => {
    if (!user?.id) return;

    if (selectedGenres.has(genreId)) {
      removeGenreMutation.mutate({
        userId: user.id,
        genreId: genreId,
      });
    } else {
      addGenreMutation.mutate({
        userId: user.id,
        genreId: genreId,
      });
    }
  };

  if (isLoading) {
    return (
      <div className='p-6 container mx-auto max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>
              Select Your Favorite Genres
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='flex items-center justify-between'>
                <Skeleton className='h-8 w-24' />
                <Skeleton className='h-6 w-12' />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-6 container mx-auto max-w-2xl'>
        <Alert variant='destructive'>
          <AlertDescription>
            Failed to load genres. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='p-6 container mx-auto max-w-2xl'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>
            Select Your Favorite Genres
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(addGenreMutation.isError || removeGenreMutation.isError) && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>
                Failed to update genre preference. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className='grid grid-cols-2 gap-4'>
            {genresData?.data?.map(
              (genre: { genreSchmea: { id: string; genre: string } }) => (
                <div
                  key={genre.genreSchmea.id}
                  className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50'
                >
                  <Badge variant='secondary' className='text-sm'>
                    {genre.genreSchmea.genre}
                  </Badge>
                  <Toggle
                    pressed={selectedGenres.has(genre.genreSchmea.id)}
                    onPressedChange={() =>
                      handleToggleGenre(genre.genreSchmea.id)
                    }
                    disabled={
                      addGenreMutation.isPending ||
                      removeGenreMutation.isPending
                    }
                    size='sm'
                    className='data-[state=on]:bg-green-500'
                  >
                    {selectedGenres.has(genre.genreSchmea.id)
                      ? 'Selected'
                      : 'Select'}
                  </Toggle>
                </div>
              )
            )}
          </div>

          {(!genresData?.data || genresData.data.length === 0) && (
            <div className='text-center text-gray-500 py-8'>
              No genres available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenrePreferencesPage;
